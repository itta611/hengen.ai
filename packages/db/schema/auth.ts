import {
  boolean,
  integer,
  jsonb,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  stripeCustomerId: text("stripeCustomerId"),
  creditQuota: integer("creditQuota").notNull().default(40),
  editorSettings: jsonb("editorSettings")
    .$type<{ snapToGrid: boolean }>()
    .notNull()
    .default({ snapToGrid: true }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("account_provider_account_idx").on(
      table.providerId,
      table.accountId
    ),
  ]
)

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const subscriptions = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    plan: text("plan").notNull(),
    referenceId: text("referenceId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripeCustomerId"),
    stripeSubscriptionId: text("stripeSubscriptionId"),
    status: text("status").notNull().default("incomplete"),
    periodStart: timestamp("periodStart", { withTimezone: true }),
    periodEnd: timestamp("periodEnd", { withTimezone: true }),
    trialStart: timestamp("trialStart", { withTimezone: true }),
    trialEnd: timestamp("trialEnd", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
    cancelAt: timestamp("cancelAt", { withTimezone: true }),
    canceledAt: timestamp("canceledAt", { withTimezone: true }),
    endedAt: timestamp("endedAt", { withTimezone: true }),
    seats: integer("seats"),
    billingInterval: text("billingInterval"),
    stripeScheduleId: text("stripeScheduleId"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("subscription_reference_idx").on(table.referenceId),
    uniqueIndex("subscription_stripe_subscription_idx").on(
      table.stripeSubscriptionId
    ),
  ]
)
