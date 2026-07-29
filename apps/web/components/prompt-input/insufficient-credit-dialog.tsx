"use client"

import { usePricingDialog } from "@/components/pricing-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/i18n/client"

function InsufficientCreditDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const pricingDialog = usePricingDialog()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-8" showCloseButton={false}>
        <div className="space-y-4">
          <DialogTitle className="text-xl font-bold tracking-normal">
            {t("prompt.insufficientTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("prompt.insufficientDescription")}
          </DialogDescription>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            onOpenChange(false)
            pricingDialog.open()
          }}
          size="lg"
          type="button"
        >
          {t("prompt.upgrade")}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export { InsufficientCreditDialog }
