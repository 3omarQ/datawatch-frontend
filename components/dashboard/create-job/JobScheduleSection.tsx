"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BoltIcon, CalendarClockIcon } from "lucide-react";
import { CreateJobSectionWrapper } from "./CreateJobSectionWrapper";
import { CreateJobFormData } from "@/zod-schemas/createjob";
import { CRON_LABELS, CRON_MAP } from "@/lib/cron";

interface JobScheduleSectionProps {
  form: UseFormReturn<CreateJobFormData>;
}

// ─── Schedule card ────────────────────────────────────────────────────────────

interface ScheduleCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function ScheduleCard({
  selected,
  onSelect,
  icon,
  title,
  description,
  children,
}: ScheduleCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-lg border p-4 transition-all duration-150 space-y-2 cursor-pointer",
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 rounded-md p-1.5 transition-colors",
            selected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{title}</p>
            <div
              className={cn(
                "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                selected ? "border-primary" : "border-muted-foreground/40"
              )}
            >
              {selected && <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {selected && children && (
        <div
          className="pt-2 border-t border-border/50 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Schedule options (only shown when "schedule" card is selected) ────────────

function ScheduleOptions({ form }: { form: UseFormReturn<CreateJobFormData> }) {
  const { watch, setValue, control, register, formState: { errors } } = form;
  const scheduleStart = watch("scheduleStart");

  // Type narrowing: these errors only exist when scheduleType === "schedule"
  const scheduleErrors = errors as Record<string, { message?: string }>;

  return (
    <div className="space-y-3 pt-1">
      {/* Interval */}
      <div className="space-y-1.5">
        <Label className="text-xs">Run every</Label>
        <Controller
          control={control}
          name="scheduleInterval"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CRON_MAP).map(([key, cron]) => (
                  <SelectItem key={key} value={key}>
                    {CRON_LABELS[cron]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {scheduleErrors.scheduleInterval?.message && (
          <p className="text-xs text-destructive">
            {scheduleErrors.scheduleInterval.message}
          </p>
        )}
      </div>

      {/* Start */}
      <div className="space-y-1.5">
        <Label className="text-xs">Starting</Label>
        <div className="flex gap-2">
          {(["now", "custom"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("scheduleStart", opt)}
              className={cn(
                "flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                scheduleStart === opt
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {opt === "now" ? "Now" : "Custom time"}
            </button>
          ))}
        </div>
        {scheduleStart === "custom" && (
          <div className="space-y-1">
            <Input
              type="datetime-local"
              className="h-8 text-xs"
              {...register("scheduleStartDate")}
            />
            {scheduleErrors.scheduleStartDate?.message && (
              <p className="text-xs text-destructive">
                {scheduleErrors.scheduleStartDate.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composed section ─────────────────────────────────────────────────────────

export function JobScheduleSection({ form }: JobScheduleSectionProps) {
  const { watch, setValue } = form;
  const scheduleType = watch("scheduleType");

  return (
    <CreateJobSectionWrapper
      step={2}
      title="Execution schedule"
      description="Choose when and how often this job should run."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ScheduleCard
          selected={scheduleType === "once"}
          onSelect={() => setValue("scheduleType", "once")}
          icon={<BoltIcon className="h-4 w-4" />}
          title="Run only once"
          description="Executes immediately after creation. Great for one-off extractions or testing your setup."
        />
        <ScheduleCard
          selected={scheduleType === "schedule"}
          onSelect={() => setValue("scheduleType", "schedule")}
          icon={<CalendarClockIcon className="h-4 w-4" />}
          title="Schedule"
          description="Run automatically on a recurring interval. Perfect for monitoring prices, feeds, or any data that changes over time."
        >
          <ScheduleOptions form={form} />
        </ScheduleCard>
      </div>
    </CreateJobSectionWrapper>
  );
}