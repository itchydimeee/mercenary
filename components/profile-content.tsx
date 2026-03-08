"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProfileContentProps {
  user: {
    name: string;
    email: string;
    profile_picture: string;
  };
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <main className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-6 text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.profile_picture} alt={user.name} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <Separator />

        <Button variant="outline" onClick={handleLogout} className="w-full">
          Sign Out
        </Button>
      </div>
    </main>
  );
}
