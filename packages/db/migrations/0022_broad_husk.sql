CREATE TABLE "billing_mutation_lock" (
	"userId" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_mutation_lock" ADD CONSTRAINT "billing_mutation_lock_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;