"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { FilterBar, SortOption } from "@/components/dashboard/shared/FilterBar";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { CreateJobButton } from "@/components/dashboard/shared/CreateJobButton";
import { PageLoadingState } from "@/components/dashboard/shared/PageLoadingState";
import { PageErrorState } from "@/components/dashboard/shared/PageErrorState";
import { jobColumns } from "@/components/dashboard/jobspage/columns";
import { jobService } from "@/services/jobs.service";
import { JobStatus } from "@/types/dashboard.types";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as JobStatus | null;
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState<SortOption>("latest");

  const { data: jobs = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobService.getAll(),
  });

  const clearStatus = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    router.push(`/dashboard/jobs?${params.toString()}`);
  };

  const filtered = useMemo(() => {
    const result = statusParam
      ? jobs.filter((j) => j.status === statusParam)
      : [...jobs];
    result.sort((a, b) => {
      if (sort === "alphabetical") {
        return a.datapoint.name.localeCompare(b.datapoint.name);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [jobs, sort, statusParam]);

  const jobEmptyState =
    jobs.length === 0
      ? {
        title: "No jobs yet.",
        description:
          "Build your first job to extract data from a target page and start tracking changes.",
        action: <CreateJobButton size="sm" />,
      }
      : statusParam
        ? {
          title: `No ${statusParam.toLowerCase()} jobs.`,
          description: "Clear the status filter to see all jobs in this workspace.",
          actionLabel: "Clear status filter",
          onAction: clearStatus,
        }
        : {
          title: "No jobs found.",
          description: "Try changing your filters or build a new job.",
          action: <CreateJobButton size="sm" />,
        };

  if (isLoading) return <PageLoadingState variant="table" />;
  if (isError) return <PageErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        stats={[{ label: "jobs", value: jobs.length }]}
        actions={<CreateJobButton />}
      />
      <FilterBar
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
        searchPlaceholder="Search jobs..."
        activeStatus={statusParam}
        onStatusClear={clearStatus}
      />
      <DataTable
        columns={jobColumns}
        data={filtered}
        globalFilter={search}
        entityName="job"
        onRowClick={(job) => router.push(`/dashboard/jobs/${job.id}`)}
        emptyState={jobEmptyState}
        filteredEmptyState={{
          title: "No jobs match your search.",
          description: "Clear your search to see the available jobs.",
          actionLabel: "Clear search",
          onAction: () => setSearch(""),
        }}
      />
    </div>
  );
}