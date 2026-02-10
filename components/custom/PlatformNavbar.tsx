"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserNav } from "./UserNav";
import { DashboardNavigationLinks } from "./PlatformSidebar";
import { authClient } from "@/lib/auth-client";
import { Logo } from "./LogoSVGs";
import NotificationsTab from "./NotificationsTab";

export const PlatformNavbar = () => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <nav className="nav border-b-solid border-b-border border-b">
      <div className="nav-internal">
        <div className="flex gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={`${buttonVariants({
                variant: "outline",
                size: "icon",
              })} lg:hidden`}
            >
              <AlignLeft size={16} className="h-4 w-4" />
            </SheetTrigger>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetContent
              side="left"
              className="p-4 md:p-6 pt-20 w-70 gap-8 flex flex-col items-start overflow-scroll lg:hidden bg-background text-foreground"
            >
              <div className="flex-1 sidebar-groups-container">
                {DashboardNavigationLinks["admin"].map((group, idx) => {
                  return (
                    <div key={idx} className="sidebar-group justify-between">
                      <div className="sidebar-links-container">
                        <div className="sidebar-group-label">{group.label}</div>
                        {group.items.map((item) => (
                          <Link
                            key={item.title}
                            href={`/dashboard/${session?.user.role}/${item.url}`}
                          >
                            <Button
                              className={`gap-2 w-full justify-start items-center text-subtle font-normal text-start ${
                                pathname.split("/")[4] ==
                                item.url.split("/").pop()!
                                  ? ` bg-foreground/5 font-bold`
                                  : ` text-foreground/80`
                              }`}
                              variant={"ghost"}
                              size="sm"
                            >
                              <item.icon size={20} />
                              {item.title}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
          <Logo width={72} />
        </div>

        <div className="flex gap-2">
          <NotificationsTab />
          <UserNav className="lg:hidden" />
        </div>
      </div>
    </nav>
  );
};

export default PlatformNavbar;
