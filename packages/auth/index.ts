import { stripe } from "@better-auth/stripe"
import { db } from "@mutar/db"
import { getUserPlanById } from "@mutar/db/repo"
import * as schema from "@mutar/db/schema"
import { sendMagicLinkEmail } from "@mutar/email"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { customSession, magicLink } from "better-auth/plugins"
import Stripe from "stripe"
import { env } from "@/lib/env"
import { deleteUserData } from "./delete-user-data"

const stripeConfig = {
  apiVersion: "2026-06-24.dahlia",
} as const

const stripePlugins = env.STRIPE_SECRET_KEY
  ? [
      stripe({
        stripeClient: new Stripe(env.STRIPE_SECRET_KEY, stripeConfig),
        stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
        createCustomerOnSignUp: true,
        subscription: {
          enabled: true,
          plans: [
            {
              name: "basic",
              lookupKey: "basic",
            },
            {
              name: "premium",
              lookupKey: "premium",
              prorationBehavior: "always_invoice",
            },
          ],
        },
      }),
    ]
  : []

export const auth = betterAuth({
  secret: env.AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL, env.NEXT_PUBLIC_BETTER_AUTH_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      subscription: schema.subscriptions,
    },
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 2,
    freshAge: 0,
  },
  user: {
    deleteUser: {
      beforeDelete: deleteUserData,
      enabled: true,
    },
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url })
      },
    }),
    ...stripePlugins,
    customSession(async ({ session, user }) => {
      return {
        session,
        user: {
          ...user,
          plan: await getUserPlanById(user.id),
        },
      }
    }),
  ],
  advanced: {
    cookiePrefix: "mutar",
  },
})
