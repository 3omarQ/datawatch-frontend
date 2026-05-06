"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon, RocketIcon } from "lucide-react";
import {
  CREATE_JOB_DEFAULTS,
  CreateJobFormData,
  createJobSchema,
} from "@/zod-schemas/createjob";
import { CreateJobFormHeader } from "@/components/dashboard/create-job/CreateJobFormHeader";
import { JobBasicsSection } from "@/components/dashboard/create-job/JobBasicsSection";
import { JobNotificationSection } from "@/components/dashboard/create-job/JobNotifymeSection";
import { JobOutputSection } from "@/components/dashboard/create-job/JobOutputSection";
import { JobScheduleSection } from "@/components/dashboard/create-job/JobScheduleSection";
import { jobService } from "@/services/jobs.service";
import { AxiosError } from "axios";

const CRON_MAP: Record<string, string> = {
  every5min: "*/5 * * * *",
  hourly: "0 * * * *",
  daily: "0 0 * * *",
  weekly: "0 0 * * 0",
};

export default function CreateJobPage() {
  const router = useRouter();

  const form = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: CREATE_JOB_DEFAULTS,
    // Keep user input intact across re-renders and validation runs.
    shouldUnregister: false,
  });

  const { handleSubmit, formState: { isSubmitting, errors } } = form;

  // Surface top-level validation errors as a toast so the user knows
  // something is wrong even if the relevant field is scrolled out of view.
  const onInvalid = () => {
    toast.error("Check the form for errors before submitting.");
  };

  const onSubmit = async (data: CreateJobFormData) => {
    try {
      const targetUrl = await jobService.findOrCreateTargetUrl({ url: data.url });

      const datapoint = await jobService.createDatapoint({
        name: data.name,
        path: data.datapointPath,
        targetUrlId: targetUrl.id,
        fieldNames: data.fieldNames?.length ? data.fieldNames : undefined,
        ...(data.paginationSelector ? { paginationSelector: data.paginationSelector } : {}),
        ...(data.maxPages ? { maxPages: data.maxPages } : {}),
      });

      const job = await jobService.createJob({
        datapointId: datapoint.id,
        definition: "",
        cron:
          data.scheduleType === "schedule" && data.scheduleInterval
            ? CRON_MAP[data.scheduleInterval]
            : undefined,
        scheduleStart:
          data.scheduleType === "schedule" &&
            data.scheduleStart === "custom" &&
            data.scheduleStartDate
            ? new Date(data.scheduleStartDate).toISOString()
            : undefined,
        extractorType: data.extractorType,
        outputFormat: data.outputFormat,
        notifyOnFinish: data.notifyOnFinish ?? true,
        notifyOnDiff: data.notifyOnDiff ?? true,
        notifyOnFail: data.notifyOnFail ?? true,
      });

      toast.success("Job created successfully!");
      router.push(`/dashboard/jobs/${job.id}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to create job.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <CreateJobFormHeader />
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-8">
        <JobBasicsSection form={form} />
        <Separator />
        <JobScheduleSection form={form} />
        <Separator />
        <JobNotificationSection form={form} />
        <Separator />
        <JobOutputSection form={form} />

        {/* Global form error summary (only shows when there are errors after submit attempt) */}
        {Object.keys(errors).length > 0 && (
          <p className="text-xs text-destructive text-center">
            Some fields need attention — scroll up to review.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <RocketIcon className="h-4 w-4" />
            )}
            {isSubmitting ? "Building..." : "Build job"}
          </Button>
        </div>
      </form>
    </div>
  );
}