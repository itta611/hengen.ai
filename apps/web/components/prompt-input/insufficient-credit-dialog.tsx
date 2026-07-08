"use client"

import { usePricingDialog } from "@/components/pricing-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

function InsufficientCreditDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pricingDialog = usePricingDialog()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-8" showCloseButton={false}>
        <div className="space-y-4">
          <DialogTitle className="text-xl font-bold tracking-normal">
            クレジットが不足しています
          </DialogTitle>
          <DialogDescription>
            生成に必要なクレジットが足りません。プランをアップグレードしてクレジットを追加しましょう。
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
          アップグレードする
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export { InsufficientCreditDialog }
