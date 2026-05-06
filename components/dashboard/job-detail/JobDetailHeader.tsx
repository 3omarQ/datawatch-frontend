"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileTextIcon, Loader2Icon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { JobStatusBadge } from "@/components/dashboard/jobspage/JobStatusBadge";
import { JobStatusToggle } from "./JobStatusToggle";
import { DeleteButton } from "@/components/dashboard/shared/DeleteButton";
import { jobService } from "@/services/jobs.service";
import { Job } from "@/types/dashboard.types";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useBreadcrumbContext } from "../shared/BreadcrumbContext";

function RunButton({ jobId }: { jobId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await apiClient.post(`/jobs/${jobId}/run`);
      toast.success("Job started.");
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    } catch {
      toast.error("Failed to run job.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRun} disabled={isRunning}>
      {isRunning ? (
        <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <PlayIcon className="h-3.5 w-3.5" />
      )}
      Run
    </Button>
  );
}

function DeleteDescription({ job }: { job: Job }) {
  return (
    <>
      <p>This will permanently delete:</p>
      <ul className="list-disc list-inside mt-2 space-y-0.5">
        <li>{job._count.executions} executions and their logs</li>
        <li>All scraped results</li>
        <li>All related notifications</li>
        <li>Any scheduled runs will be cancelled</li>
      </ul>
      <p className="mt-2 font-medium text-destructive">This cannot be undone.</p>
    </>
  );
}

export function JobDetailHeader({ job }: { job: Job }) {
  const router = useRouter();
  const hasRuns = job._count.executions > 0;
  const { setLabel } = useBreadcrumbContext();
  useEffect(() => {
    // Replace the raw job ID segment with a human-readable label
    setLabel(job.id, job.datapoint.name);
  }, [job.id, job.datapoint.name, setLabel]);

  return (
    <PageHeader
      title="Job details"
      showBackButton
      backHref="/dashboard/jobs"
      breadcrumbs={[{ label: "Jobs", href: "/dashboard/jobs" }]}

      meta={
        <>
          <span className="text-sm font-semibold text-muted-foreground">
            {job.datapoint.name}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-sm text-muted-foreground truncate max-w-sm">
            {job.datapoint.targetUrl.url}
          </span>
          <JobStatusBadge status={job.status} />
        </>
      }
      actions={
        <>
          <JobStatusToggle job={job} />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={!hasRuns}
            onClick={() => router.push(`/dashboard/jobs/${job.id}/runs`)}
          >
            <FileTextIcon className="h-3.5 w-3.5" />
            Executions
            <Badge variant="secondary" className="ml-0.5 text-xs px-1.5 py-0">
              {job._count.executions}
            </Badge>
          </Button>
          <RunButton jobId={job.id} />
          <DeleteButton
            title="Delete job?"
            description={<DeleteDescription job={job} />}
            action={() => jobService.remove(job.id)}
            redirectTo="/dashboard/jobs"
            successMessage="Job deleted."
            errorMessage="Failed to delete job."
            invalidateKeys={[["jobs"], ["job", job.id]]}
          />
        </>
      }
    />
  );
}