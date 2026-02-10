ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_customer_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_id_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_customer_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_variant_id_products_variant_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variantId" bigint PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "productId" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "customerId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "subscriptionId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "productId" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "variantId" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "renewsAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "endsAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customerId" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customerId_user_customerId_fk" FOREIGN KEY ("customerId") REFERENCES "public"."user"("customerId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_variantId_products_variantId_fk" FOREIGN KEY ("variantId") REFERENCES "public"."products"("variantId") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "variant_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "customer_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "subscription_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "variant_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "renews_at";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "ends_at";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customerId_unique" UNIQUE("customerId");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_customerId_unique" UNIQUE("customerId");