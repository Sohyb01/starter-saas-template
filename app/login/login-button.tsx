"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const LoginButton = () => {
  const signInWithGoogle = async () =>
    await authClient.signIn.social({
      callbackURL: "/dashboard",
      provider: "google",
    });

  return (
    <Button className="w-fit" onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
};

export default LoginButton;
