import { getSession } from "@/auth";
import { hasSubscriptionEndedByAccountId } from "@/db/queries";
import { getSubscriptionProducts } from "@/lib/lemon-squeezy/server";
import Link from "next/link";
import { PricingSection } from "../PricingSection";
import CheckoutRedirect from "./CheckoutRedirect";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ variantId?: string }>;
}) {
  const { variantId } = await searchParams;

  if (variantId) {
    return (
      <section>
        <div className="container flex flex-col items-start text-start section-px py-20 text-foreground gap-8">
          <CheckoutRedirect variantId={variantId} />
        </div>
      </section>
    );
  }

  const session = await getSession();
  const subscriptionRes = session?.user.id
    ? await hasSubscriptionEndedByAccountId(session?.user.id)
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
          <div>
            {session ? (
              <Link href={`/dashboard/${session.user.role}`}>Go to portal</Link>
            ) : (
              <p>Subscription is active</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
