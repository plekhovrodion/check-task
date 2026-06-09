import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItemData[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  navigation?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  actions,
  navigation,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <span key={item.label} className="contents">
                {index > 0 && (
                  <BreadcrumbSeparator className="text-muted-foreground">
                    /
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink render={<Link href={item.href} />}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {(title || actions || navigation) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
                {navigation}
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
    </div>
  );
}
