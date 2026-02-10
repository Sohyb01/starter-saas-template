"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (session == null || session.user == null) {
    router.push("/login");
  } else {
    router.push(`/dashboard/${session.user.role}/home`);
  }
  // Redirect to the 'finances' subpage
}
