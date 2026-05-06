import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageErrorStateProps {
  /** The error object or a plain message string. Falls back to a generic message. */
  error?: Error | unknown;
  /** Called when the user clicks "Try again". Wire this to TanStack Query's `refetch`. */
  onRetry?: () => void;
}

function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}

export function PageErrorState({ error, onRetry }: PageErrorStateProps) {
  const message = getErrorMessage(error);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-1 max-w-sm">
        <p className="text-sm font-medium text-foreground">Failed to load</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}