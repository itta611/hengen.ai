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
  const [open, setOpen] = useState(false)

  async function handleCopy(action: () => Promise<void>) {
    try {
      await action()
      setOpen(false)
    } catch {
      toast.error("コピーに失敗しました")
    }
  }

  return (
    <ButtonGroup aria-label="コピー">
      <Button
        disabled={disabled}
        onClick={() => handleCopy(onCopyImage)}
        type="button"
        variant="outline"
      >
        コピー
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              aria-label="コピーオプション"
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
                className="flex-col items-start gap-0.5 p-2!"
              >
                <div className="text-foreground text-xs font-bold">
                  画像としてコピー
                </div>
                <div className="text-xs text-muted-foreground">
                  画像形式でコピーします。
                </div>
              </CommandItem>
              <CommandItem
                onSelect={() => handleCopy(onCopySvg)}
                className="flex-col items-start gap-0.5 p-2!"
              >
                <div className="flex items-center gap-1.5 text-foreground text-xs font-bold">
                  <span>SVG形式でコピー</span>
                  {isSvgPaidFeature && (
                    <Badge className="h-4 px-1.5 text-[10px]">有料プラン</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Powerpoint等で編集できる形式でコピーします。
                </div>
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
