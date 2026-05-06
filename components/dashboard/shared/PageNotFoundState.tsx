import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageNotFoundStateProps {
	/** What kind of record is missing, e.g. "job", "datapoint", "execution". */
	entity?: string;
	/** Where the back link points. Defaults to ".." (parent route). */
	backHref?: string;
	/** Label for the back link button. */
	backLabel?: string;
}

export function PageNotFoundState({
	entity = "record",
	backHref = "..",
	backLabel,
}: PageNotFoundStateProps) {
	const label = backLabel ?? `Back to ${entity}s`;

	return (
		<div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
				<SearchXIcon className="h-6 w-6 text-muted-foreground" />
			</div>
			<div className="space-y-1 max-w-sm">
				<p className="text-sm font-medium text-foreground capitalize">
					{entity} not found
				</p>
				<p className="text-sm text-muted-foreground">
					This {entity} doesn&apos;t exist or may have been deleted.
				</p>
			</div>
			<Button variant="outline" size="sm" asChild>
				<Link href={backHref}>{label}</Link>
			</Button>
		</div>
	);
}