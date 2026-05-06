"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { FilterBar, SortOption, FilterOption } from "@/components/dashboard/shared/FilterBar";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { CreateJobButton } from "@/components/dashboard/shared/CreateJobButton";
import { PageLoadingState } from "@/components/dashboard/shared/PageLoadingState";
import { PageErrorState } from "@/components/dashboard/shared/PageErrorState";
import { datapointColumns } from "@/components/dashboard/datapointspage/columns";
import { datapointService } from "@/services/datapoints.service";

export default function DatapointsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState<SortOption>("latest");
  const [targetValue, setTargetValue] = useState<FilterOption | null>(() => {
    const t = searchParams.get("target");
    return t ? { id: t, label: t } : null;
  });

  const { data: datapoints = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["datapoints"],
    queryFn: () => datapointService.getAll(),
  });

  const targetOptions = useMemo<FilterOption[]>(() => {
    const seen = new Set<string>();
    return datapoints
      .filter((d) => {
        const key = d.targetUrl.baseUrl ?? d.targetUrl.url;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((d) => ({
        id: d.targetUrl.baseUrl ?? d.targetUrl.url,
        label: d.targetUrl.baseUrl ?? d.targetUrl.url,
      }));
  }, [datapoints]);

  const filtered = useMemo(() => {
    const result = targetValue
      ? datapoints.filter(
        (d) => (d.targetUrl.baseUrl ?? d.targetUrl.url) === targetValue.id
      )
      : [...datapoints];
    result.sort((a, b) => {
      if (sort === "alphabetical") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [datapoints, sort, targetValue]);

  const datapointEmptyState =
    datapoints.length === 0
      ? {
        title: "No datapoints yet.",
        description:
          "Build a job to define the first datapoint you want to extract and monitor.",
        action: <CreateJobButton size="sm" />,
      }
      : targetValue
        ? {
          title: "No datapoints for this target.",
          description: "Clear the target filter to see datapoints from all targets.",
          actionLabel: "Clear target filter",
          onAction: () => setTargetValue(null),
        }
        : {
          title: "No datapoints found.",
          description: "Try changing your filters or build a new job.",
          action: <CreateJobButton size="sm" />,
        };

  if (isLoading) return <PageLoadingState variant="table" />;
  if (isError) return <PageErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Datapoints"
        stats={[{ label: "datapoints", value: datapoints.length }]}
        actions={<CreateJobButton />}
      />
      <FilterBar
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
        searchPlaceholder="Search datapoints..."
        targetOptions={targetOptions}
        targetValue={targetValue}
        onTargetChange={setTargetValue}
      />
      <DataTable
        columns={datapointColumns}
        data={filtered}
        globalFilter={search}
        entityName="datapoint"
        onRowClick={(row) => router.push(`/dashboard/datapoints/${row.id}`)}
        emptyState={datapointEmptyState}
        filteredEmptyState={{
          title: "No datapoints match your search.",
          description: "Clear your search to see the available datapoints.",
          actionLabel: "Clear search",
          onAction: () => setSearch(""),
        }}
      />
    </div>
  );
}