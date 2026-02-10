import { getSession } from "@/auth";
import PlatformNavbar from "@/components/custom/PlatformNavbar";
import PlatformSidebar from "@/components/custom/PlatformSidebar";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session || session.user.role !== "admin") redirect("/login");
  return (
    <div
      className={`antialiased flex flex-col w-full h-screen overflow-hidden`}
      dir="ltr"
    >
      <PlatformNavbar />
      <div className="flex w-full overflow-hidden dashboard-sizing">
        <PlatformSidebar />
        {/* Main Content */}
        <main className="w-full flex flex-col gap-8 p-4 md:p-8 lg:pl-12 dashboard-sizing overflow-scroll bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
