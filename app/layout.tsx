import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/app-shell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "ИИ-проверка заданий — Ассистент Преподавателя",
  description: "Проверка письменных работ учеников с помощью ИИ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${onest.variable} h-full antialiased`}>
      <body className="h-svh overflow-hidden">
        <TooltipProvider>
          <StoreProvider>
            <AppShell>{children}</AppShell>
            <Toaster position="top-right" />
          </StoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
