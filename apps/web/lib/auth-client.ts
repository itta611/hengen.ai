"use client"

import { createAuthClient } from "better-auth/react"
import { customSessionClient, magicLinkClient } from "better-auth/client/plugins"
import { stripeClient } from "@better-auth/stripe/client"
import type { auth } from "@mutar/auth"
import { env } from "./env"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    magicLinkClient(),
    stripeClient({ subscription: true }),
    customSessionClient<typeof auth>(),
  ],
})
