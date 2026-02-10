"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
//

export function UserNav({ className }: { className?: string }) {
  const LogOut = async () => {
    toast("Logging out...");
    await authClient.signOut();
  };

  const { data: session } = authClient.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(className, " ")} asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 min-h-10 w-10 min-w-10">
            <AvatarImage
              className="h-10 min-h-10 w-10 min-w-10"
              src={session!.user.image ?? undefined}
              alt={session!.user.name.slice(0, 2)}
            />
            <AvatarFallback className="h-10 min-h-10 w-10 min-w-10 uppercase text-detail aspect-square">
              {session!.user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-p_ui capitalize">
              {session!.user.name.slice(0, 2)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-start h-10 flex gap-2 items-center justify-start text-detail text-destructive me-auto"
            >
              <LogOutIcon size={16} /> Log out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="ltr">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will have to log in again to access the BrainBots platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={LogOut}>Log out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
