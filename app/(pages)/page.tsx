import { getSession } from "@/auth";
import { hasSubscriptionEndedByAccountId } from "@/db/queries";
import { getSubscriptionProducts } from "@/lib/lemon-squeezy/server";
import Link from "next/link";
import { PricingSection } from "./PricingSection";

export default async function Home() {
  const session = await getSession();
  const subscriptionData = session?.user.id
    ? await hasSubscriptionEndedByAccountId(session?.user.id)
    : null;
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
