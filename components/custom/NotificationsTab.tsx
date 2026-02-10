"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const NotificationsTab = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative rounded-full bg-transparent`}
        >
          <Bell className="h-4.5 w-4.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" className="w-88 px-0 p-0">
        <div className="max-h-120 overflow-y-scroll">
          <p className="text-muted-foreground p-4 text-subtle">
            You have no notifications.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsTab;
