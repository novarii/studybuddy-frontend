CREATE TABLE "ai"."agent_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"key_hash" text NOT NULL,
	"label" text,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agent_api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE INDEX "idx_agent_api_keys_user_id" ON "ai"."agent_api_keys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_agent_api_keys_key_hash" ON "ai"."agent_api_keys" USING btree ("key_hash");