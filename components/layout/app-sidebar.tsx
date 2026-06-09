"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavIcon, type NavIconName } from "@/components/layout/nav-icon";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Image
      src={assetPath("/logo_ap.svg")}
      alt="Ассистент Преподавателя"
      width={144}
      height={40}
      className="h-10 w-36"
      priority
    />
  );
}

interface NavItem {
  label: string;
  icon: NavIconName;
  href?: string;
  active?: boolean;
  suffix?: NavIconName;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Подготовка к уроку",
    items: [
      { label: "Рабочий стол", icon: "main" },
      { label: "ИИ-помощник", icon: "ai" },
      {
        label: "Библиотека заданий",
        icon: "materials",
        suffix: "plus",
      },
    ],
  },
  {
    label: "Проведение урока",
    items: [
      { label: "Расписание", icon: "calendar" },
      { label: "Мои ученики", icon: "smile" },
      {
        label: "Викторины",
        icon: "quiz",
        suffix: "arrowUpRight",
      },
    ],
  },
  {
    label: "Обзор результатов",
    items: [
      {
        label: "Анализ уроков",
        icon: "analysisVoice",
        suffix: "plus",
      },
      { label: "Статистика", icon: "statistics" },
      {
        label: "ИИ-проверка заданий",
        icon: "penBrand",
        href: "/assignments",
        active: true,
      },
      { label: "Рейтинги", icon: "ratings" },
      { label: "Результаты учеников", icon: "performance" },
    ],
  },
];

export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-svh w-full overflow-hidden bg-background">{children}</div>
    </SidebarProvider>
  );
}

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="h-svh w-[296px] shrink-0 gap-4 border-none bg-transparent p-6"
    >
      <SidebarHeader className="flex flex-row items-center justify-between p-0">
        <Logo />
        <Button variant="ghost" size="icon">
          <NavIcon name="calendarToggle" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="min-h-0 flex-1 gap-0 overflow-auto">
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.label} className="p-0">
            <SidebarGroupLabel className="h-9 px-0 text-sm text-muted-foreground">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      render={
                        item.href ? (
                          <Link href={item.href} />
                        ) : (
                          <button type="button" />
                        )
                      }
                      isActive={item.active}
                      className={cn(
                        "h-10 gap-2.5 rounded-lg p-2 text-base transition-colors [&_img]:size-5 [&_img]:transition-[filter]",
                        "hover:bg-transparent active:bg-transparent data-active:bg-transparent",
                        "hover:text-primary data-active:font-medium data-active:text-primary",
                        "hover:[&:not([data-active])_img]:nav-icon-purple",
                        !item.href && "cursor-default"
                      )}
                    >
                      <NavIcon name={item.icon} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.suffix ? <NavIcon name={item.suffix} /> : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto p-0">
        <div className="flex items-center gap-2">
          <Avatar className="size-10 rounded-lg">
            <AvatarImage src={assetPath("/images/profile.png")} />
            <AvatarFallback>ПЛ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-base font-medium">Павел Ларичев</span>
            <span className="text-xs text-muted-foreground">Роль</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
