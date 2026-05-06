import { CRON_INTERVALS } from "@/lib/cron";
import { z } from "zod";

export const createJobSchema = z.object({
  // Section 1 - Basics
  name: z.string().min(1, "Give this datapoint a name so you can find it later."),
  url: z.string().url("That doesn't look like a valid URL — make sure it starts with https://."),
  datapointPath: z.string().min(1, "Select an element — use the visual picker or type a CSS selector."),
  fieldNames: z.array(z.string()).optional(),
  paginationSelector: z.string().optional(),
  maxPages: z.number().min(2).max(50).optional(),

  // Section 2 - Schedule
  scheduleType: z.enum(["once", "schedule"]),
  scheduleInterval: z.enum(CRON_INTERVALS).optional(),
  scheduleStart: z.enum(["now", "custom"]).optional(),
  scheduleStartDate: z.string().optional(),

  // Section 3 - Notifications
  notifyOnFinish: z.boolean(),
  notifyOnDiff: z.boolean(),
  notifyOnFail: z.boolean(),

  // Section 4 - Output
  extractorType: z.enum(["smart", "basic"]),
  outputFormat: z.enum(["json", "md", "txt", "csv"]),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;

export const CREATE_JOB_DEFAULTS: CreateJobFormData = {
  name: "",
  url: "",
  datapointPath: "",
  scheduleType: "once",
  scheduleInterval: "daily",
  scheduleStart: "now",
  scheduleStartDate: undefined,
  notifyOnFinish: true,
  notifyOnDiff: true,
  notifyOnFail: true,
  extractorType: "smart",
  fieldNames: [],
  outputFormat: "json",
  paginationSelector: undefined,
  maxPages: 5,
};