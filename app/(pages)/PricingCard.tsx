"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  handleCheckout,
  TSubscriptionsProduct,
} from "@/lib/lemon-squeezy/server";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function PricingCard({ product }: { product: TSubscriptionsProduct }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const formatProductName = (name: string) => {
    return name
      .replace("subscription_", "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const parseDescription = (html: string) => {
    // Simple regex to strip HTML tags for SSR compatibility
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const onSubscribe = () => {
    startTransition(async () => {
      if (!session?.user) {
        if (!product.variant_id) return;
        await authClient.signIn.social({
          provider: "google",
          callbackURL: `/get-started?variantId=${encodeURIComponent(
            product.variant_id,
          )}`,
        });
        return;
      }

      const checkoutUrl = await handleCheckout(product.variant_id!);

      if (checkoutUrl) {
        router.push(checkoutUrl);
      } else {
        router.push("/login");
      }
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl">
            {formatProductName(product.name)}
          </CardTitle>
          {product.test_mode && (
            <Badge variant="secondary" className="text-xs">
              Test Mode
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="text-3xl font-bold">{product.price_formatted}</div>
        <CardDescription className="text-base">
          {parseDescription(product.description)}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-1 items-center"
          size="lg"
          onClick={onSubscribe}
          disabled={isPending || !product.variant_id}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? "Processing..." : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
