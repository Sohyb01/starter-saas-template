"use client";

import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { LayoutDashboardIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidatePathOnServer } from "@/app/actions";

export default function WebsiteUserNav({
  fallback,
  loading = null,
}: {
  fallback: ReactNode;
  loading?: ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const collapsed = false;

  if (isPending) return loading;
  if (!session?.user) return fallback;

  const LogOut = async () => {
    toast("Logging out...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
          revalidatePathOnServer("/");
        },
      },
    });
    router.replace("/");
  };

  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`group flex w-full mt-auto rounded-xl cursor-pointer duration-300 bg-accent
          ${collapsed ? "justify-center p-2" : "items-center gap-2 p-2 max-w-66 hover:bg-accent/50 "}`}
        >
          <Avatar
            className={`aspect-square min-h-10 min-w-10 max-h-10 max-w-10 w-10 h-10 hover:opacity-80 hover:scale-110 duration-200`}
          >
            <AvatarImage
              className={`aspect-square min-h-10 min-w-10 max-h-10 max-w-10 w-10 h-10`}
              src={session.user.image ?? undefined}
              alt={session.user.name.slice(0, 2)}
            />
            <AvatarFallback
              className={`uppercase text-detail min-h-10 min-w-10 max-h-10 max-w-10 w-10 h-10`}
            >
              {session.user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <>
              <div className="text-detail -space-y-0.5">
                <p className="capitalize break-all line-clamp-1">
                  {session.user.name}
                </p>
                <span className="text-muted-foreground break-all line-clamp-1">
                  {session.user.email}
                </span>
              </div>
            </>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-start flex gap-2 items-center justify-start text-detail me-auto"
        >
          <LayoutDashboardIcon size={16} /> Go to Dashboard
        </Button>
        <AlertDialog>
          <AlertDialogTrigger className="w-full" asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-start flex gap-2 items-center justify-start text-detail text-destructive me-auto"
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
