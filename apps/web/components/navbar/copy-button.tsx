"use client"

import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/i18n/client"

export function CopyButton({
  disabled,
  isSvgPaidFeature,
  onCopyImage,
  onCopySvg,
}: {
  disabled: boolean
  isSvgPaidFeature: boolean
  onCopyImage: () => Promise<void>
  onCopySvg: () => Promise<void>
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  async function handleCopy(action: () => Promise<void>) {
    try {
      await action()
      setOpen(false)
    } catch {
      toast.error(t("editor.copy.error"))
    }
  }

  return (
    <ButtonGroup aria-label={t("editor.copy.label")}>
      <Button
        disabled={disabled}
        onClick={() => handleCopy(onCopyImage)}
        type="button"
        variant="outline"
      >
        {t("editor.copy.label")}
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              aria-label={t("editor.copy.options")}
              className="w-7"
              disabled={disabled}
              size="icon"
              type="button"
              variant="outline"
            >
              <ChevronDownIcon />
            </Button>
          }
        />
        <PopoverContent className="w-75 p-0" align="end">
          <Command>
            <CommandList>
              <CommandItem
                onSelect={() => handleCopy(onCopyImage)}
                className="flex-col items-start gap-1 px-2.5! py-2!"
              >
                <div className="text-foreground text-xs font-bold">
                  {t("editor.copy.image")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("editor.copy.imageDescription")}
                </div>
              </CommandItem>
              <CommandItem
                onSelect={() => handleCopy(onCopySvg)}
                className="flex-col items-start gap-1 px-2.5! py-2!"
              >
                <div className="flex items-center gap-2.5 text-foreground text-xs font-bold">
                  <span>{t("editor.copy.svg")}</span>
                  {isSvgPaidFeature && (
                    <div className="h-4 inline-block px-1.5 text-[10px] bg-primary text-primary-foreground leading-4 rounded-[3px]">
                      {t("editor.copy.paid")}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("editor.copy.svgDescription")}
                </div>
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
