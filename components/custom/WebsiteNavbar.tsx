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

export default async function WebsiteNavbar() {
  return (
    <nav className="absolute top-0 w-full nav py-6">
      <div className="nav-internal items-center lg:max-w-393 lg:px-20 ">
        {/* Logo */}
        <Logo width={72} />

        {/* Links */}

        {/* CTA and Menu Button */}
        <div className="hidden md:flex items-center gap-3 w-fit">
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Login
            <LogIn size={20} />
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Sign up
          </Link>
        </div>

        {/* Mobile sheet */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Menu size={24} className="stroke-foreground" />
          </SheetTrigger>
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <SheetContent className="lg:hidden w-full flex flex-col gap-8 items-start py-10">
            {/* CTA and Menu Button */}

            {/* Links */}
            <div className="flex flex-col items-start gap-3 w-fit"></div>
            <div className="flex md:hidden flex-col items-start gap-3 w-full">
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Login
                <LogIn size={20} />
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Sign up
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
