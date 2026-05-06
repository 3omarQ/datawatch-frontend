import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { WandIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { CreateJobFormData } from "@/zod-schemas/createjob";
import { CreateJobSectionWrapper } from "./CreateJobSectionWrapper";
import { ElementPickerModal } from "./element-picker/ElementPickerModal";

interface JobBasicsSectionProps {
  form: UseFormReturn<CreateJobFormData>;
}

export function JobBasicsSection({ form }: JobBasicsSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const { register, watch, setValue, formState: { errors } } = form;

  const url = watch("url");
  const datapointPath = watch("datapointPath");
  const fieldNames = watch("fieldNames") ?? [];
  const paginationSelector = watch("paginationSelector");
  const maxPages = watch("maxPages");

  const hasSelection = Boolean(datapointPath);

  const handlePickerConfirm = (data: {
    selector: string;
    fieldNames: string[];
    paginationSelector?: string;
    maxPages?: number;
  }) => {
    setValue("datapointPath", data.selector, { shouldValidate: true });
    setValue("fieldNames", data.fieldNames);
    setValue("paginationSelector", data.paginationSelector ?? undefined);
    // Fall back to schema default (5) so an untouched maxPages doesn't drop the paginationSelector
    setValue("maxPages", data.paginationSelector ? (data.maxPages ?? 5) : undefined);
  };

  return (
    <>
      <CreateJobSectionWrapper
        step={1}
        title="Datapoint"
        description="What page do you want to monitor, and what data should be extracted?"
      >
        <div className="space-y-4">
          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="url">Target URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/products"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Datapoint name</Label>
            <Input
              id="name"
              placeholder="e.g. Amazon keyboard products list"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Selector */}
          <div className="space-y-2">
            <Label>Data selector</Label>

            {/* Single flat button — no nested interactive elements inside */}
            <button
              type="button"
              disabled={!url}
              onClick={() => setPickerOpen(true)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                hasSelection
                  ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                  : "border-dashed border-border hover:border-primary/40 hover:bg-muted/40",
                !url && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                hasSelection ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <WandIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                {hasSelection ? (
                  <>
                    <p className="text-sm font-medium text-foreground">Element selected</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{datapointPath}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      {url ? "Click to select an element" : "Enter a URL first"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {url
                        ? "Opens a visual picker — click any element on the page to track it."
                        : "The visual picker needs a URL to open."}
                    </p>
                  </>
                )}
              </div>
              {/* Plain span, not a Button — avoids the button-in-button violation */}
              {hasSelection && (
                <span className="shrink-0 text-xs text-muted-foreground border border-border rounded-md px-2 py-1 hover:bg-muted transition-colors">
                  Change
                </span>
              )}
            </button>

            {errors.datapointPath && (
              <p className="text-xs text-destructive">{errors.datapointPath.message}</p>
            )}

            {/* Field names */}
            {fieldNames.length > 0 && (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                <p className="text-[11px] font-medium text-foreground mb-1.5">Selected fields</p>
                <div className="flex flex-wrap gap-1.5">
                  {fieldNames.map((f, i) => (
                    <span
                      key={`${f}-${i}`}
                      className="text-[11px] rounded bg-background border border-border px-2 py-0.5 font-mono"
                    >
                      {f || `Field ${i + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {paginationSelector && (
              <div className="rounded-md border border-amber-200 bg-amber-50   px-3 py-2">
                <p className="text-[11px] font-medium text-amber-800  mb-1">
                  Pagination configured
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-amber-700 ">
                    {paginationSelector}
                  </span>
                  <span className="text-[11px] text-amber-600 ">
                    (Max {maxPages} pages)
                  </span>
                </div>
              </div>
            )}

            {/* Manual fallback — hidden by default */}
            <button
              type="button"
              onClick={() => setShowManual((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showManual
                ? <ChevronUpIcon className="h-3 w-3" />
                : <ChevronDownIcon className="h-3 w-3" />}
              {showManual ? "Hide manual input" : "Enter selector manually instead"}
            </button>

            {showManual && (
              <div className="space-y-1.5">
                <Input
                  id="datapointPath"
                  placeholder="e.g. div.product-list > .item  or  //div[@class='item']"
                  {...register("datapointPath")}
                />
                <p className="text-xs text-muted-foreground">
                  A CSS selector or XPath expression. Use this only if you already know the exact path.
                </p>
              </div>
            )}
          </div>
        </div>
      </CreateJobSectionWrapper>

      <ElementPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        url={url}
        onConfirm={handlePickerConfirm}
      />
    </>
  );
}