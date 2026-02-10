import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarGroupsLinks = ({
  expanded,
  groups,
}: {
  expanded: boolean;
  groups: {
    label: string;
    items: {
      title: string;
      url: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
    }[];
  }[];
}) => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  if (isPending || !session?.user) return null;

  return (
    <>
      {groups.map((group, idx) => (
        <div key={idx} className="flex flex-col gap-1 w-full">
          {expanded && <div className="sidebar-group-label">{group.label}</div>}
          {group.items.map((item) => {
            const isActive =
              pathname.split("/")[3] == item.url.split("/").pop()!;
            return (
              <Link
                key={item.title}
                href={`/dashboard/${session.user.role}/${item.url}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full flex items-center gap-2 justify-start transition-all duration-200
              ${
                expanded
                  ? "px-3 text-subtle font-normal text-start"
                  : "justify-center px-0 w-10"
              }
              ${
                isActive
                  ? "bg-foreground/10 font-bold text-foreground"
                  : "text-foreground/80 hover:bg-accent/40"
              }`}
                >
                  <item.icon size={20} />
                  {expanded && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default SidebarGroupsLinks;
