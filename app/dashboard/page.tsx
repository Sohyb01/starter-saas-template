"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (session == null || session.user == null) {
      router.replace("/login");
      return;
    }
    router.replace(`/dashboard/${session.user.role}/home`);
  }, [router, session, isPending]);

  return null;
}
