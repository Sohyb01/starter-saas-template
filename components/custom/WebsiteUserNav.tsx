"use client";

import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { UserNav2 } from "./UserNav2";

export default function WebsiteUserNav({
  fallback,
  loading = null,
}: {
  fallback: ReactNode;
  loading?: ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return loading;
  if (!session?.user) return fallback;

  return <UserNav2 />;
}
