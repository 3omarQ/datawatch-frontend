import { Log } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const levelStyles: Record<Log["level"], string> = {
  INFO: "text-blue-600",
  WARN: "text-amber-600",
  ERROR: "text-red-600",
  DEBUG: "text-muted-foreground",
};
interface Props {
  logs: Log[];
  isLive: boolean; // execution is still RUNNING
}

export function ExecutionLogs({ logs, isLive }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLive) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length, isLive]);

  if (logs.length === 0)
    return <div className="text-sm text-muted-foreground">No logs.</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-foreground">Logs</h2>
        {isLive && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div className="rounded-md border border-border bg-muted divide-y divide-border/60 max-h-[400px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 px-4 py-2">
            <span className={cn("text-xs font-mono font-semibold w-10 shrink-0", levelStyles[log.level])}>
              {log.level}
            </span>
            <span className="text-xs font-mono text-foreground flex-1 break-words">
              {log.message}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(log.date).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
