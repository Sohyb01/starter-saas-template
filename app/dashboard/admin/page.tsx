"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  router.push("/dashboard/admin/home");
  // Redirect to the 'finances' subpage
}
