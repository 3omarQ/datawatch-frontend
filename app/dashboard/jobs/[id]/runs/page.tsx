"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { executionsService } from "@/services/executions.service";
import { jobService } from "@/services/jobs.service";
import { Separator } from "@/components/ui/separator";
import { ExecutionHistoryTable } from "@/components/runs/ExecutionHistoryTable";
import { LatestRunsComparison } from "@/components/runs/LatestRunsComparison";
import { RunsPageHeader } from "@/components/runs/RunsPageHeader";
import { PageLoadingState } from "@/components/dashboard/shared/PageLoadingState";
import { PageErrorState } from "@/components/dashboard/shared/PageErrorState";
import { PageNotFoundState } from "@/components/dashboard/shared/PageNotFoundState";

export default function RunsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: job,
    isLoading: jobLoading,
    isError: jobError,
    error: jobFetchError,
    refetch: refetchJob,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getById(id),
  });

  const {
    data: latestExecutions = [],
    isLoading: latestLoading,
    isError: latestError,
    error: latestFetchError,
    refetch: refetchLatest,
  } = useQuery({
    queryKey: ["executions-latest", id],
    queryFn: () => executionsService.getLatestDone(id),
  });

  const {
    data: allExecutions = [],
    isLoading: allLoading,
    isError: allError,
    error: allFetchError,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["executions-all", id],
    queryFn: () => executionsService.getAll(id),
  });

  if (jobLoading || latestLoading || allLoading) {
    return <PageLoadingState variant="table" />;
  }

  // Job-level error is fatal — without the job we can't render the page.
  if (jobError) {
    return <PageErrorState error={jobFetchError} onRetry={refetchJob} />;
  }

  if (!job) {
    return (
      <PageNotFoundState entity="job" backHref="/dashboard/jobs" backLabel="Back to jobs" />
    );
  }

  // Execution errors are secondary — the job loaded, so show the header and
  // surface retryable errors inline where the execution data would appear.
  const executionsErrored = latestError || allError;
  const executionsError = latestFetchError ?? allFetchError;
  const retryExecutions = () => {
    if (latestError) refetchLatest();
    if (allError) refetchAll();
  };

  return (
    <div className="space-y-6 pb-16">
      <RunsPageHeader job={job} />
      {executionsErrored ? (
        <PageErrorState error={executionsError} onRetry={retryExecutions} />
      ) : (
        <>
          <LatestRunsComparison
            executions={latestExecutions}
            format={job.outputFormat}
          />
          {latestExecutions.length >= 2 && <Separator />}
          <ExecutionHistoryTable executions={allExecutions} jobId={id} />
        </>
      )}
    </div>
  );
}