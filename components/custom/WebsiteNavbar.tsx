import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./LogoSVGs";
import Link from "next/link";
import WebsiteUserNav from "./WebsiteUserNav";

export default async function WebsiteNavbar() {
  return (
    <nav className="absolute top-0 w-full nav py-6">
      <div className="nav-internal items-center lg:max-w-393 lg:px-20 ">
        {/* Logo */}
        <Link href="/">
          <Logo width={72} />
        </Link>

        {/* Links */}

        {/* CTA and Menu Button */}
        <div className="hidden md:flex items-center gap-3 w-fit">
          <WebsiteUserNav
            fallback={
              <Link
                href="/login"
                className={buttonVariants({ variant: "default" })}
              >
                Start for free
              </Link>
            }
          />
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
