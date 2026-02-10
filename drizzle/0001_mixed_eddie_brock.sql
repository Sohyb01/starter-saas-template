CREATE TABLE "products" (
	"variant_id" bigint PRIMARY KEY NOT NULL,
	"product_id" bigint NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" text NOT NULL,
	"product_id" bigint NOT NULL,
	"variant_id" bigint NOT NULL,
	"status" text NOT NULL,
	"cancelled" boolean DEFAULT false,
	"renews_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customer_id_account_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_variant_id_products_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."products"("variant_id") ON DELETE no action ON UPDATE cascade;