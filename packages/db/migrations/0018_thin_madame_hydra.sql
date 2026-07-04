CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"referenceId" text NOT NULL,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"status" text DEFAULT 'incomplete' NOT NULL,
	"periodStart" timestamp with time zone,
	"periodEnd" timestamp with time zone,
	"trialStart" timestamp with time zone,
	"trialEnd" timestamp with time zone,
	"cancelAtPeriodEnd" boolean DEFAULT false,
	"cancelAt" timestamp with time zone,
	"canceledAt" timestamp with time zone,
	"endedAt" timestamp with time zone,
	"seats" integer,
	"billingInterval" text,
	"stripeScheduleId" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripeCustomerId" text;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_referenceId_user_id_fk" FOREIGN KEY ("referenceId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscription_reference_idx" ON "subscription" USING btree ("referenceId");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_stripe_subscription_idx" ON "subscription" USING btree ("stripeSubscriptionId");