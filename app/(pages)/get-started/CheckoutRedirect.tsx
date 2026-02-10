"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { handleCheckout } from "@/lib/lemon-squeezy/server";
import { Loader2 } from "lucide-react";

export default function CheckoutRedirect({
  variantId,
}: {
  variantId: string;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!variantId) {
      router.replace("/get-started");
      return;
    }
    if (!session?.user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      const checkoutUrl = await handleCheckout(variantId);
      if (cancelled) return;
      if (checkoutUrl) {
        router.replace(checkoutUrl);
      } else {
        router.replace("/get-started");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isPending, router, session, variantId]);

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      <span>Preparing your checkout...</span>
    </div>
  );
}
