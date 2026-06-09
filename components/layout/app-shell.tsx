import { AppSidebar, AppSidebarProvider } from "./app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppSidebarProvider>
      <AppSidebar />
      <main className="flex h-svh min-h-0 flex-1 flex-col overflow-hidden p-2">
        <div className="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-hidden rounded-3xl border border-white/50 bg-content p-6">
          {children}
        </div>
      </main>
    </AppSidebarProvider>
  );
}
