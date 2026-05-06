"use client";

import { useEffect } from "react";
import { JobExecution } from "@/types/dashboard.types";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { ExecutionStatusBadge } from "../ExecutionStatusBadge";
import { useBreadcrumbContext } from "@/components/dashboard/shared/BreadcrumbContext";

function formatDuration(start: string | null, end: string | null): string {
	if (!start || !end) return "—";
	const ms = new Date(end).getTime() - new Date(start).getTime();
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(1)}s`;
}

export function ExecutionHeader({ execution }: { execution: JobExecution }) {
	const { setLabel } = useBreadcrumbContext();

	useEffect(() => {
		const dateLabel = new Date(execution.createdAt).toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
		setLabel(execution.id, `Exec: ${dateLabel}`);
	}, [execution.id, execution.createdAt, setLabel]);

	return (
		<PageHeader
			title="Execution"
			showBackButton
			backHref={`/dashboard/jobs/${execution.jobId}/runs`}
			meta={
				<div className="flex items-center gap-3">
					<ExecutionStatusBadge status={execution.status} />
					<span className="text-xs text-muted-foreground">
						{new Date(execution.createdAt).toLocaleString()}
					</span>
					<span className="text-xs text-muted-foreground">
						{formatDuration(execution.startedAt, execution.finishedAt)}
					</span>
				</div>
			}
		/>
	);
}