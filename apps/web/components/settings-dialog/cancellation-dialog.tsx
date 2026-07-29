"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/i18n/client"

const cancellationReasons = [
  { key: "tooExpensive", value: "too_expensive" },
  { key: "missingFeatures", value: "missing_features" },
  { key: "switchedService", value: "switched_service" },
  { key: "unused", value: "unused" },
  { key: "tooComplex", value: "too_complex" },
  { key: "lowQuality", value: "low_quality" },
  { key: "customerService", value: "customer_service" },
  { key: "other", value: "other" },
] as const

export type CancellationFeedback = (typeof cancellationReasons)[number]["value"]

export function CancellationDialog({
  isSubmitting,
  onConfirm,
  onOpenChange,
  open,
}: {
  isSubmitting: boolean
  onConfirm: (feedback: CancellationFeedback) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { t } = useTranslation()
  const [feedback, setFeedback] = useState<CancellationFeedback | null>(null)

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) {
          onOpenChange(nextOpen)
        }
      }}
      open={open}
    >
      <DialogContent
        className="z-[61] max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg"
        forceRenderOverlay
      >
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            if (feedback) {
              onConfirm(feedback)
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("settings.cancellation.title")}</DialogTitle>
          </DialogHeader>

          <fieldset className="space-y-3" disabled={isSubmitting}>
            <legend className="font-medium">
              {t("settings.cancellation.description")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {cancellationReasons.map((reason) => (
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition-colors hover:border-primary/40 hover:bg-primary/10 has-checked:border-primary/40 has-checked:bg-primary/10"
                  key={reason.value}
                >
                  <input
                    checked={feedback === reason.value}
                    className="size-4 accent-primary"
                    name="cancellation-reason"
                    onChange={() => setFeedback(reason.value)}
                    required
                    type="radio"
                    value={reason.value}
                  />
                  <span>
                    {t(`settings.cancellation.reasons.${reason.key}`)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <DialogFooter>
            <Button
              disabled={!feedback || isSubmitting}
              type="submit"
              variant="destructive"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {t("settings.cancellation.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
