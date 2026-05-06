"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { useBreadcrumbContext } from "./BreadcrumbContext";
import { ROUTE_LABELS } from "@/lib/breadcrumbs";

export function Breadcrumbs() {
	const pathname = usePathname();
	const { overrides } = useBreadcrumbContext();

	const segments = pathname.split("/").filter(Boolean);

	const crumbs = segments.map((segment, i) => {
		const href = "/" + segments.slice(0, i + 1).join("/");
		const label = overrides[segment] ?? ROUTE_LABELS[segment] ?? null;
		return label ? { label, href } : null;
	}).filter(Boolean) as { label: string; href: string }[];

	if (crumbs.length <= 1) return null; // no breadcrumbs needed on top-level pages

	return (
		<nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-1">
			{crumbs.map((crumb, i) => {
				const isLast = i === crumbs.length - 1;
				return (
					<span key={crumb.href} className="flex items-center gap-1">
						{i > 0 && <ChevronRightIcon className="h-3 w-3 text-muted-foreground/50 shrink-0" />}
						{isLast ? (
							<span className="text-xs text-foreground font-medium">
								{crumb.label}
							</span>
						) : (
							<Link
								href={crumb.href}
								className="text-xs text-muted-foreground hover:text-foreground transition-colors"
							>
								{crumb.label}
							</Link>
						)}
					</span>
				);
			})}
		</nav>
	);
}