"use client";

import { useAuth } from "@/providers/auth.context-provider";
import { AuthService } from "@/services/auth.service";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const { updateAccessToken } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    AuthService.logout();
    updateAccessToken(null);
    router.push("/auth/login");
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="ml-auto px-3">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
};

export default Header;
