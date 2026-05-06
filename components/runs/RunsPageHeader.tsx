import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Job } from "@/types/dashboard.types";

export function RunsPageHeader({ job }: { job: Job }) {
  return (
    <PageHeader
      title="Executions"
      backHref={`/dashboard/jobs/${job.id}`}
      breadcrumbs={[
        { label: "Jobs", href: "/dashboard/jobs" },
        { label: "Job details", href: `/dashboard/jobs/${job.id}` },
      ]}
      meta={
        <>
          <span className="text-sm font-semibold text-muted-foreground">
            {job.datapoint.name}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-sm text-muted-foreground truncate max-w-sm">
            {job.datapoint.targetUrl.name}
          </span>
        </>
      }
      showBackButton
    />
  );
}