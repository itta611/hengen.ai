"use client"

import { ChevronDownIcon, DownloadIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/i18n/client"
import { cn } from "@/lib/utils"

export function SaveButton({
  disabled,
  isEditableExportPaidFeature,
  onSavePng,
  onSavePptx,
  onSaveSvg,
}: {
  disabled: boolean
  isEditableExportPaidFeature: boolean
  onSavePng: () => Promise<void>
  onSavePptx: () => Promise<void>
  onSaveSvg: () => Promise<void>
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  async function handleSave(action: () => Promise<void>) {
    try {
      await action()
      setOpen(false)
    } catch {
      toast.error(t("editor.saveError"))
    }
  }

  const options = [
    {
      action: onSavePng,
      description: t("editor.save.pngDescription"),
      label: t("editor.save.png"),
      paid: false,
    },
    {
      action: onSaveSvg,
      description: t("editor.save.svgDescription"),
      label: t("editor.save.svg"),
      paid: isEditableExportPaidFeature,
    },
    {
      action: onSavePptx,
      description: t("editor.save.pptxDescription"),
      label: t("editor.save.pptx"),
      paid: isEditableExportPaidFeature,
    },
  ]

  return (
    <ButtonGroup aria-label={t("editor.saveImage")}>
      <Button
        disabled={disabled}
        onClick={() => handleSave(onSavePng)}
        type="button"
        className="border-r-0"
      >
        <DownloadIcon />
        {t("editor.saveImage")}
      </Button>
      <div
        className={cn("w-px bg-primary/80 my-px", { "opacity-50": disabled })}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              aria-label={t("editor.save.options")}
              className="w-7"
              disabled={disabled}
              size="icon"
              type="button"
            >
              <ChevronDownIcon />
            </Button>
          }
        />
        <PopoverContent className="w-75 p-0" align="end">
          <Command>
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  className="flex-col items-start gap-1 px-2.5! py-2!"
                  key={option.label}
                  onSelect={() => handleSave(option.action)}
                >
                  <div className="flex items-center gap-2.5 text-foreground text-xs font-bold">
                    <span>{option.label}</span>
                    {option.paid && (
                      <div className="h-4 inline-block px-1.5 text-[10px] bg-primary text-primary-foreground leading-4 rounded-[3px]">
                        {t("editor.save.paid")}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
