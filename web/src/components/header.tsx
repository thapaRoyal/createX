"use client";

import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="ml-auto px-3"></div>
    </header>
  );
};

export default Header;
