import { AppSidebar } from "@/components/ui/app-sidebar";
import { NavActions } from "@/components/ui/nav-actions";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />

              <NavActions />
            </div>
          </header>

          <main className="mx-auto px-3">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
