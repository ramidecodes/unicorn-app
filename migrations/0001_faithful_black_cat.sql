CREATE TABLE "llamas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"features" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"position" jsonb DEFAULT '{"x":0,"y":0,"z":0}'::jsonb NOT NULL,
	"velocity" jsonb DEFAULT '{"x":0,"y":0,"z":0}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_llamas_user_id" ON "llamas" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_llamas_created_at" ON "llamas" USING btree ("created_at");