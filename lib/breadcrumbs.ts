// Maps static path segments to human-readable labels.
// Dynamic segments ([id], [runId]) are resolved via BreadcrumbContext at runtime.
export const ROUTE_LABELS: Record<string, string> = {
	dashboard: "Dashboard",
	jobs: "Jobs",
	runs: "Executions",
	datapoints: "Datapoints",
	targets: "Targets",
};