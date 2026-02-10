CREATE TYPE "public"."roles" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "role" "roles" DEFAULT 'user' NOT NULL;