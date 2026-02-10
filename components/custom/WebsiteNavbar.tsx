import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogIn } from "lucide-react";
import { Logo } from "./LogoSVGs";
import Link from "next/link";
import { getSession } from "@/auth";

export default async function WebsiteNavbar() {
  const session = await getSession();

  return (
    <nav className="absolute top-0 w-full nav py-6">
      <div className="nav-internal items-center lg:max-w-393 lg:px-20 ">
        {/* Logo */}
        <Logo width={72} />

        {/* Links */}

        {/* CTA and Menu Button */}
        <div className="hidden md:flex items-center gap-3 w-fit capitalize">
          {session?.user ? (
            <Link
              href={`/dashboard/${session.user.role}/home`}
              className={buttonVariants({ variant: "default" })}
            >
              Go to dashboard
              <LogIn size={20} />
            </Link>
          ) : (
            <Link
              href="/signup"
              className={buttonVariants({ variant: "default" })}
            >
              Start for free
            </Link>
          )}
          {/* Mobile sheet */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Menu size={24} className="stroke-foreground" />
            </SheetTrigger>
            <SheetTitle className="hidden">Navigation</SheetTitle>
            <SheetContent className="lg:hidden w-full flex flex-col gap-8 items-start px-5 py-12">
              No content here!
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
