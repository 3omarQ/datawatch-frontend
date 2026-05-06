"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

type PageLoadingVariant = "table" | "detail" | "grid";

interface PageLoadingStateProps {
	variant?: PageLoadingVariant;
}

const SLOW_START_NOTE = (
	<p className="text-center text-xs text-muted-foreground mt-4">
		{"Sorry if this page is taking too long to load, i'm on Render's free tier, which takes around 30s to wake the database. Sorry i'm poor :')"}
	</p>
);

function TableLoadingSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-7 w-32" />
					<Skeleton className="h-4 w-20" />
				</div>
				<Skeleton className="h-9 w-28" />
			</div>
			{/* Filter bar */}
			<div className="flex gap-3">
				<Skeleton className="h-9 w-64" />
				<Skeleton className="h-9 w-36" />
			</div>
			{/* Table rows */}
			<div className="border border-border rounded-lg overflow-hidden">
				<div className="border border-border bg-muted/40 px-4 py-3">
					<div className="flex gap-8">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="border border-border last:border-0 px-4 py-3.5">
						<div className="flex gap-8 items-center">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-5 w-16 rounded-full" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function DetailLoadingSkeleton() {
	return (
		<div className="space-y-6 pb-16">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-8 w-56" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-20" />
				</div>
			</div>
			{/* Detail cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="border border-border rounded-lg p-4 space-y-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				))}
			</div>
		</div>
	);
}

function GridLoadingSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-7 w-32" />
					<div className="flex gap-4">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-20" />
					</div>
				</div>
				<Skeleton className="h-9 w-28" />
			</div>
			{/* Filter bar */}
			<div className="flex gap-3">
				<Skeleton className="h-9 w-64" />
				<Skeleton className="h-9 w-36" />
			</div>
			{/* Grid cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="border border-border rounded-lg p-4 space-y-3">
						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-5 rounded" />
							<Skeleton className="h-4 w-16" />
						</div>
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-4 w-full" />
						<div className="flex gap-4 pt-1">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-16" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function PageLoadingState({ variant = "table" }: PageLoadingStateProps) {
	const [showNote, setShowNote] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowNote(true);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	const skeleton =
		variant === "detail" ? <DetailLoadingSkeleton /> :
			variant === "grid" ? <GridLoadingSkeleton /> :
				<TableLoadingSkeleton />;

	return (
		<div>
			{skeleton}
			{showNote && SLOW_START_NOTE}
		</div>
	);
}