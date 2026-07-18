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

const cancellationReasons = [
  { label: "料金が高い", value: "too_expensive" },
  { label: "必要な機能がない", value: "missing_features" },
  { label: "他のサービスへ移行する", value: "switched_service" },
  { label: "利用する必要がなくなった", value: "unused" },
  { label: "操作が難しい", value: "too_complex" },
  { label: "品質に満足できない", value: "low_quality" },
  { label: "サポートに満足できない", value: "customer_service" },
  { label: "その他", value: "other" },
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
            <DialogTitle>プランを解約しますか？</DialogTitle>
          </DialogHeader>

          <fieldset className="space-y-3" disabled={isSubmitting}>
            <legend className="font-medium">
              解約する理由を選択してください
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
                  <span>{reason.label}</span>
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
              プランを解約する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
