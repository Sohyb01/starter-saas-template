"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MonitorPlay,
  ChevronLeft,
  ChevronRight,
  ContactIcon,
} from "lucide-react";
import { UserNav2 } from "./UserNav2";
import { authClient } from "@/lib/auth-client";
import SidebarGroupsLinks from "./SidebarGroupsLinks";

export const DashboardNavigationLinks = {
  admin: [
    {
      label: "Platform",
      items: [
        { title: "Home", url: "home", icon: ContactIcon },
        { title: "Test", url: "test", icon: MonitorPlay },
      ],
    },
  ],
  user: [
    {
      label: "Platform",
      items: [
        { title: "Home", url: "home", icon: ContactIcon },
        { title: "Test", url: "test", icon: MonitorPlay },
      ],
    },
  ],
};

const PlatformSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { data: session } = authClient.useSession();
  if (!session?.user) return null;

  return (
    <nav
      className={`hidden lg:flex flex-col justify-between bg-background border-e border-border transition-all duration-300 h-full
        ${expanded ? " w-70 p-4" : "w-16 p-3 items-center"}`}
    >
      <div className="flex flex-col gap-4 w-full">
        {/* Toggle button */}
        <Button
          variant={expanded ? "outline" : "ghost"}
          size="icon"
          onClick={() => setExpanded((prev) => !prev)}
          className="self-start"
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>

        {/* All groups */}
        <SidebarGroupsLinks
          expanded={expanded}
          groups={DashboardNavigationLinks[session.user.role]}
        />
      </div>

      {/* UserNav2 — handle collapsed mode */}
      <UserNav2 collapsed={!expanded} />
    </nav>
  );
};

export default PlatformSidebar;
