"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Job } from "@/types/dashboard.types";
import { JobDetailHeader } from "@/components/dashboard/job-detail/JobDetailHeader";
import { DatapointSection } from "@/components/dashboard/job-detail/DatapointSection";
import { ExtractionSection } from "@/components/dashboard/job-detail/ExtractionSection";
import { MetadataSection } from "@/components/dashboard/job-detail/JobMetadataSection";
import { NotificationsSection } from "@/components/dashboard/job-detail/NotificationsSection";
import { ScheduleSection } from "@/components/dashboard/job-detail/ScheduleSection";
import { TargetUrlSection } from "@/components/dashboard/job-detail/TargetURLSection";
import { PageLoadingState } from "@/components/dashboard/shared/PageLoadingState";
import { PageErrorState } from "@/components/dashboard/shared/PageErrorState";
import { PageNotFoundState } from "@/components/dashboard/shared/PageNotFoundState";
import apiClient from "@/lib/api-client";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading, isError, error, refetch } = useQuery<Job>({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/jobs/${id}`);
      return data;
    },
  });

  if (isLoading) return <PageLoadingState variant="detail" />;
  if (isError) return <PageErrorState error={error} onRetry={refetch} />;
  if (!job) return <PageNotFoundState entity="job" backHref="/dashboard/jobs" />;

  return (
    <div className="space-y-6 pb-16">
      <JobDetailHeader job={job} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TargetUrlSection job={job} />
        <DatapointSection job={job} />
        <ScheduleSection job={job} />
        <ExtractionSection job={job} />
        <NotificationsSection job={job} />
        <MetadataSection job={job} />
      </div>
    </div>
  );
}