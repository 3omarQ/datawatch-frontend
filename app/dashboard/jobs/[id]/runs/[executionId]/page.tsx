"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect, useRef } from "react";
import { executionsService } from "@/services/executions.service";
import { Separator } from "@/components/ui/separator";
import { ExecutionHeader } from "@/components/runs/single-run-page/ExecutionHeader";
import { ExecutionLogs } from "@/components/runs/single-run-page/ExecutionLogs";
import { ExecutionResult } from "@/components/runs/single-run-page/ExecutionResult";
import { PageLoadingState } from "@/components/dashboard/shared/PageLoadingState";
import { PageErrorState } from "@/components/dashboard/shared/PageErrorState";
import { PageNotFoundState } from "@/components/dashboard/shared/PageNotFoundState";
import { useExecutionLogs } from "@/hooks/useExecutionLogs";

export default function ExecutionPage() {
	const { id: jobId, executionId } = useParams<{ id: string; executionId: string }>();

	const { data: execution, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["execution", jobId, executionId],
		queryFn: () => executionsService.getOne(jobId, executionId),
		refetchInterval: (query) =>
			query.state.data?.status === "RUNNING" ? 3000 : false,
	});

	const isLive = execution?.status === "RUNNING";
	const initialLogs = useMemo(() => execution?.logs ?? [], [execution?.logs]);
	const logs = useExecutionLogs(executionId, initialLogs);

	const wasLiveRef = useRef(false);
	const resultsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (wasLiveRef.current && execution?.status !== "RUNNING") {
			// give React enough time to render the results into the DOM
			setTimeout(() => {
				resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 300);
		}
		wasLiveRef.current = execution?.status === "RUNNING";
	}, [execution?.status]);

	if (isLoading) return <PageLoadingState variant="detail" />;
	if (isError) return <PageErrorState error={error} onRetry={refetch} />;
	if (!execution) {
		return (
			<PageNotFoundState
				entity="execution"
				backHref={`/dashboard/jobs/${jobId}/runs`}
				backLabel="Back to runs"
			/>
		);
	}

	return (
		<div className="space-y-6 pb-16">
			<ExecutionHeader execution={execution} />
			<Separator />
			<div ref={resultsRef} className="scroll-mt-24">
				<ExecutionResult results={execution.results} format={execution.job.outputFormat} />
			</div>
			<Separator />
			<ExecutionLogs logs={logs} isLive={isLive} />
		</div>
	);
}
