"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SortOption, TargetsFilterBar } from "@/components/dashboard/targetspage/TargetsFilterBar";
import { TargetsGrid } from "@/components/dashboard/targetspage/TargetsGrid";
import { TargetsPageHeader } from "@/components/dashboard/targetspage/TargetsPageHeader";
import { PageLoadingState } from "@/components/dashboard/shared/PageLoadingState";
import { PageErrorState } from "@/components/dashboard/shared/PageErrorState";
import { targetUrlService } from "@/services/targets.service";

export default function TargetsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");

  const { data: targets = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["target-urls"],
    queryFn: () => targetUrlService.getAll(),
  });

  const totalJobs = targets.reduce(
    (acc, t) => acc + t.datapoints.flatMap((d) => d.jobs).length,
    0
  );
  const totalDatapoints = targets.reduce(
    (acc, t) => acc + t._count.datapoints,
    0
  );

  const filteredTargets = useMemo(() => {
    let result = [...targets];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.url.toLowerCase().includes(q)
      );
    }
    if (sort === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return result;
  }, [search, sort, targets]);

  if (isLoading) return <PageLoadingState variant="grid" />;
  if (isError) return <PageErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <TargetsPageHeader totalJobs={totalJobs} totalDatapoints={totalDatapoints} />
      <TargetsFilterBar
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />
      <TargetsGrid
        targets={filteredTargets}
        totalTargets={targets.length}
        hasActiveFilters={Boolean(search.trim())}
        onClearFilters={() => setSearch("")}
      />
    </div>
  );
}