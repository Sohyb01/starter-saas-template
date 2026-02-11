"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type UserSubscriptionRow = {
  plan: string;
  price: string;
  status: string;
  cancelled: string;
  renewsAt: string;
  endsAt: string;
  portalUrl?: string | null;
};

export const UserSubscriptionsColumns: ColumnDef<UserSubscriptionRow>[] = [
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("plan")}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("status")}</div>;
    },
  },
  {
    accessorKey: "cancelled",
    header: "Cancelled",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("cancelled")}</div>;
    },
  },
  {
    accessorKey: "renewsAt",
    header: "Renews at",
  },
  {
    accessorKey: "endsAt",
    header: "Ends at",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const portalUrl = row.original.portalUrl;
      if (!portalUrl) return <span className="text-muted-foreground">—</span>;
      return (
        <Button asChild variant="destructive" size="sm">
          <a href={portalUrl} target="_blank" rel="noreferrer">
            Cancel
          </a>
        </Button>
      );
    },
  },
];
