"use client";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface StatItem {
  label: string;
  value: number;
}

interface PageHeaderProps {
  title: string;
  // detail page props
  showBackButton?: boolean;
  backHref?: string;           // explicit back destination
  breadcrumbs?: BreadcrumbItem[]; // e.g. [{label:"Jobs",href:"/dashboard/jobs"}, ...]
  meta?: React.ReactNode;
  // list page props
  stats?: StatItem[];
  actionLabel?: string;
  actionHref?: string;
  // shared
  actions?: React.ReactNode;
}

function BackButton({ href }: { href?: string }) {
  const router = useRouter();
  const handleClick = () => (href ? router.push(href) : router.back());
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
      onClick={handleClick}
    >
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  );
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRightIcon className="h-3 w-3 shrink-0" />}
          <Link
            href={item.href}
            className="hover:text-foreground transition-colors truncate max-w-[160px]"
          >
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

function Stats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="flex items-center gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{stat.value}</span>{" "}
          {stat.label}
        </div>
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  showBackButton,
  backHref,
  breadcrumbs,
  meta,
  stats,
  actionLabel,
  actionHref,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {showBackButton && <BackButton href={backHref} />}

      <div className="flex flex-col flex-1 gap-0.5 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        <span className="font-semibold tracking-tight text-xl text-foreground">
          {title}
        </span>
        {meta && (
          <div className="flex items-center gap-2 flex-wrap">{meta}</div>
        )}
        {stats && <Stats stats={stats} />}
      </div>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="gap-1.5">
            <PlusIcon className="h-3.5 w-3.5" />
            {actionLabel}
          </Button>
        </Link>
      )}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}