import { getSession } from "@/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { hasSubscriptionEndedByAccountId } from "@/db/queries";
import { getSubscriptionProducts } from "@/lib/lemon-squeezy/server";
import Link from "next/link";
import { PricingSection } from "./PricingSection";
import { eq } from "drizzle-orm";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getSession();
  const userRow = session?.user.id
    ? await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        columns: { customerId: true },
      })
    : null;
  const subscriptionRes = userRow?.customerId
    ? await hasSubscriptionEndedByAccountId(userRow.customerId)
    : null;
  const subscriptionData =
    subscriptionRes?.success === true ? subscriptionRes.data : null;
  const products = await getSubscriptionProducts();

  return (
    <section>
      <div className="container flex flex-col items-start text-start section-px py-20 text-foreground gap-8">
        {!subscriptionData || subscriptionData.hasEnded || !session?.user.id ? (
          <PricingSection products={products} />
        ) : (
          <div className="space-y-2 w-full grid place-items-center">
            <p className="text-p">Subscription is active</p>
            <Link
              className={buttonVariants({ variant: "default" })}
              href={`/dashboard/${session.user.role}`}
            >
              Go to dashboard
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
