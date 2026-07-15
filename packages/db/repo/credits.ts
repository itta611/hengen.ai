import { randomUUID } from "node:crypto"

import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm"

import { db, sql as neonSql } from ".."
import { creditLedger, subscriptions, users } from "../schema"
import { getCreditQuotaByPlan, isUserPlan, type UserPlan } from "./plans"

function getCreditPeriod(now = new Date()) {
  const periodStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  )
  const periodEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  )

  return { periodEnd, periodStart }
}

export async function getCreditUsageByUserId(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    return null
  }

  const [activeSubscription] = await db
    .select({
      plan: subscriptions.plan,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.referenceId, userId),
        inArray(subscriptions.status, ["active", "trialing"])
      )
    )
    .orderBy(
      desc(subscriptions.periodStart),
      desc(subscriptions.updatedAt),
      desc(subscriptions.createdAt)
    )
    .limit(1)
  const plan: UserPlan = isUserPlan(activeSubscription?.plan)
    ? activeSubscription.plan
    : "free"

  const { periodEnd, periodStart } = getCreditPeriod()
  const [usage] = await db
    .select({
      used: sql<number>`
        coalesce(sum(
          case
            when ${creditLedger.state} = 'succeeded' then ${creditLedger.amount}
            when ${creditLedger.state} = 'loading'
              and ${creditLedger.createdAt} >= now() - interval '1 hour'
              and not exists (
                select 1
                from credit_ledger cancellations
                where cancellations."projectId" = ${creditLedger.projectId}
                  and cancellations.state = 'canceled'
              )
            then ${creditLedger.amount}
            else 0
          end
        ), 0)
      `.mapWith(Number),
    })
    .from(creditLedger)
    .where(
      and(
        eq(creditLedger.userId, userId),
        gte(creditLedger.createdAt, periodStart),
        lt(creditLedger.createdAt, periodEnd)
      )
    )

  return {
    plan,
    quota: getCreditQuotaByPlan(plan),
    used: usage?.used ?? 0,
  }
}

export async function reserveCreditsForProjects({
  projectIds,
  userId,
}: {
  projectIds: string[]
  userId: string
}) {
  const usage = await getCreditUsageByUserId(userId)

  if (!usage) {
    return { reserved: false, usage: null }
  }

  if (projectIds.length === 0) {
    return { reserved: true, usage }
  }

  if (usage.used + projectIds.length > usage.quota) {
    return { reserved: false, usage }
  }

  const entries = projectIds.map((projectId) => ({
    id: randomUUID(),
    projectId,
  }))
  const { periodEnd, periodStart } = getCreditPeriod()
  const rows = await neonSql`
    with user_lock as (
      update "user"
      set "updatedAt" = "updatedAt"
      where "id" = ${userId}
        and (
          select coalesce(sum(
            case
              when "state" = 'succeeded' then "amount"
              when "state" = 'loading'
                and "createdAt" >= now() - interval '1 hour'
                and not exists (
                  select 1
                  from "credit_ledger" cancellations
                  where cancellations."projectId" = "credit_ledger"."projectId"
                    and cancellations."state" = 'canceled'
                )
              then "amount"
              else 0
            end
          ), 0)
          from "credit_ledger"
          where "userId" = ${userId}
            and "createdAt" >= ${periodStart}
            and "createdAt" < ${periodEnd}
        ) + ${projectIds.length} <= ${usage.quota}
      returning "id"
    ),
    requested as (
      select
        value ->> 'id' as "id",
        value ->> 'projectId' as "projectId"
      from jsonb_array_elements(${JSON.stringify(entries)}::jsonb)
    ),
    inserted as (
      insert into "credit_ledger" (
        "id",
        "userId",
        "projectId",
        "amount",
        "reason",
        "state"
      )
      select
        requested."id",
        ${userId},
        requested."projectId",
        1,
        'project_generation',
        'loading'
      from requested
      cross join user_lock
      returning "id"
    )
    select count(*)::int as "reservedCount"
    from inserted
  `
  const reservedCount = Number(rows[0]?.reservedCount ?? 0)

  return {
    reserved: reservedCount === projectIds.length,
    usage,
  }
}

export async function cancelProjectCredits({
  projectIds,
  userId,
}: {
  projectIds: string[]
  userId: string
}) {
  if (projectIds.length === 0) {
    return
  }

  await db
    .update(creditLedger)
    .set({ state: "canceled" })
    .where(
      and(
        eq(creditLedger.userId, userId),
        inArray(creditLedger.projectId, projectIds),
        eq(creditLedger.state, "loading")
      )
    )
}

export async function markProjectCreditSucceeded({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  await db
    .update(creditLedger)
    .set({ state: "succeeded" })
    .where(
      and(
        eq(creditLedger.userId, userId),
        eq(creditLedger.projectId, projectId),
        eq(creditLedger.state, "loading")
      )
    )
}
