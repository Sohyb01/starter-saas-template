// Queries interacting with your supabase (or other) backend

// src/server/subscriptions.ts
import { db } from "@/db"; // <- adjust to your db export
import { products, subscriptions, user } from "@/db/schema"; // <- adjust path
import { eq, desc, sql } from "drizzle-orm";

type SubscriptionStatusResult = {
  hasEnded: boolean;
  endsAt: Date | null;
  status: string | null;
  cancelled: boolean | null;
};

/**
 * Takes account.id (your "customerId" FK points to account.id)
 * Returns whether the current subscription has ended.
 */
export async function hasSubscriptionEndedByAccountId(
  accountId: string,
): Promise<SubscriptionStatusResult> {
  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.customerId, accountId),
    orderBy: [desc(subscriptions.updatedAt)], // "current" = latest updated record
    columns: {
      endsAt: true,
      status: true,
      cancelled: true,
    },
  });

  // No subscription record => treat as ended (no active access)
  if (!sub) {
    return { hasEnded: true, endsAt: null, status: null, cancelled: null };
  }

  const now = new Date();

  // If endsAt is set and in the past => ended
  if (sub.endsAt && sub.endsAt.getTime() <= now.getTime()) {
    return {
      hasEnded: true,
      endsAt: sub.endsAt,
      status: sub.status,
      cancelled: sub.cancelled ?? null,
    };
  }

  // If endsAt is null, fall back to status/cancelled to decide.
  // Adjust these rules to your status values.
  const normalizedStatus = (sub.status ?? "").toLowerCase();
  const endedByStatus =
    normalizedStatus === "ended" ||
    normalizedStatus === "expired" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "inactive";

  if (endedByStatus) {
    return {
      hasEnded: true,
      endsAt: sub.endsAt ?? null,
      status: sub.status,
      cancelled: sub.cancelled ?? null,
    };
  }

  // Otherwise, subscription is considered not ended
  return {
    hasEnded: false,
    endsAt: sub.endsAt ?? null,
    status: sub.status,
    cancelled: sub.cancelled ?? null,
  };
}

/**
 * Upsert into `products` using `variant_id` as the conflict target (PK).
 * Your schema expects BIGINT for variantId/productId, so we coerce safely.
 */
export async function upsertProduct({
  variant_id,
  product_id,
  name,
  price,
}: {
  variant_id: string;
  product_id: string;
  name: string;
  price: number;
}) {
  const variantId = Number(variant_id);
  const productId = Number(product_id);

  if (!Number.isSafeInteger(variantId)) {
    throw new Error(
      `Invalid variant_id (must be a safe integer): ${variant_id}`,
    );
  }
  if (!Number.isSafeInteger(productId)) {
    throw new Error(
      `Invalid product_id (must be a safe integer): ${product_id}`,
    );
  }

  const [row] = await db
    .insert(products)
    .values({
      variantId,
      productId,
      name,
      price,
      // createdAt/updatedAt have defaults; we'll explicitly bump updatedAt on conflict
    })
    .onConflictDoUpdate({
      target: products.variantId, // == ON CONFLICT (variant_id)
      set: {
        productId,
        name,
        price,
        updatedAt: sql`now()`,
      },
    })
    .returning();

  return row ?? null;
}

/**
 * Drizzle version of:
 * UPDATE users SET customer_id = ? WHERE user_id = ? RETURNING *
 */
export async function updateCustomerId({
  userId,
  customerId,
}: {
  userId: string;
  customerId: string;
}) {
  const [row] = await db
    .update(user)
    .set({
      customerId, // maps to "customer_id"
    })
    .where(eq(user.id, userId)) // maps to "user_id"
    .returning();

  return row ?? null;
}

export async function insertSubscription({
  customerId,
  subscriptionId,
  productId,
  variantId,
  status,
  cancelled,
  renewsAt,
  endsAt,
  createdAt,
  updatedAt,
}: {
  customerId: string;
  subscriptionId: number;
  productId: string;
  variantId: string;
  status: string;
  cancelled: boolean;
  renewsAt: string;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}) {
  const productIdNum = Number(productId);
  const variantIdNum = Number(variantId);

  const [row] = await db
    .insert(subscriptions)
    .values({
      customerId,
      subscriptionId,
      productId: productIdNum,
      variantId: variantIdNum,
      status,
      cancelled,
      renewsAt: renewsAt ? new Date(renewsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    })
    .onConflictDoUpdate({
      target: subscriptions.customerId, // ON CONFLICT (customer_id)
      set: {
        subscriptionId,
        productId: productIdNum,
        variantId: variantIdNum,
        status,
        cancelled,
        renewsAt: renewsAt ? new Date(renewsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        updatedAt: new Date(updatedAt),
      },
    })
    .returning();

  return row ?? null;
}
