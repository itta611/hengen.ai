import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n/client"

export function CopyButton({
  disabled,
  onCopyImage,
}: {
  disabled: boolean
  onCopyImage: () => Promise<void>
}) {
  const { t } = useTranslation()

  async function handleCopy() {
    try {
      await onCopyImage()
    } catch {
      toast.error(t("editor.copy.error"))
    }
  }

  return (
    <Button
      disabled={disabled}
      onClick={handleCopy}
      type="button"
      variant="outline"
    >
      {t("editor.copy.label")}
    </Button>
  )
}
