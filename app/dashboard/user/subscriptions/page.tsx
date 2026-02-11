import { getSession } from "@/auth";
import { db } from "@/db";
import { products, subscriptions, user } from "@/db/schema";
import { hasSubscriptionEndedByAccountId } from "@/db/queries";
import { createCustomerPortal } from "@/lib/lemon-squeezy/server";
import { Button } from "@/components/ui/button";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  UserSubscriptionRow,
  UserSubscriptionsColumns,
} from "@/components/columns/UserSubscriptionsColumns";

export default async function SubscriptionPage() {
  const session = await getSession();
  if (!session?.user) return null;

  const userRow = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: {
      customerId: true,
    },
  });

  if (!userRow?.customerId) {
    return (
      <div className="dashboard-tab-wrapper">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-h3">Subscription</h3>
        </div>
        <div className="text-muted-foreground">
          You do not have an active subscription yet.
        </div>
        <Link href="/get-started" className="w-fit">
          <Button size="sm">Choose a plan</Button>
        </Link>
      </div>
    );
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.customerId, userRow.customerId),
    orderBy: [desc(subscriptions.updatedAt)],
  });

  if (!subscription) {
    return (
      <div className="dashboard-tab-wrapper">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-h3">Subscription</h3>
        </div>
        <div className="text-muted-foreground">
          No subscription record found.
        </div>
        <Link href="/get-started" className="w-fit">
          <Button size="sm">Choose a plan</Button>
        </Link>
      </div>
    );
  }

  const product = await db.query.products.findFirst({
    where: eq(products.variantId, subscription.variantId),
    columns: {
      name: true,
      price: true,
    },
  });

  const statusRes = await hasSubscriptionEndedByAccountId(userRow.customerId);
  const hasEnded = statusRes.success
    ? (statusRes.data?.hasEnded ?? true)
    : true;

  const portalUrl =
    !hasEnded && subscription.subscriptionId
      ? await createCustomerPortal(subscription.subscriptionId.toString())
      : null;

  const rows: UserSubscriptionRow[] = [
    {
      plan: product?.name ?? "Unknown",
      price:
        product?.price != null ? `$${(product.price / 100).toFixed(2)}` : "-",
      status: subscription.status,
      cancelled: subscription.cancelled ? "Yes" : "No",
      renewsAt: subscription.renewsAt
        ? subscription.renewsAt.toLocaleDateString()
        : "-",
      endsAt: subscription.endsAt
        ? subscription.endsAt.toLocaleDateString()
        : "-",
      portalUrl,
    },
  ];

  return (
    <div className="dashboard-tab-wrapper">
      <div className="flex justify-between w-full items-center">
        <h3 className="text-h3">Subscription</h3>
      </div>

      <DataTable
        columns={UserSubscriptionsColumns}
        data={rows}
        addButton={false}
        viewButton={false}
        showSelected={false}
        // searchLabeledProperties={[{ property: "plan", label: "plan" }]}
      />
    </div>
  );
}
