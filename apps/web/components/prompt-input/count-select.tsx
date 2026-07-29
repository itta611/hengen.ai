import { ChevronDown, Layers2Icon } from "lucide-react"
import { useTranslation } from "@/i18n/client"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function CountSelect({
  selectedCount,
  onCountChange,
}: {
  selectedCount: number
  onCountChange: (count: number) => void
}) {
  const { t } = useTranslation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="pr-2">
            <Layers2Icon />
            <span className="not-sm:hidden">
              {t("prompt.count", { count: selectedCount })}
            </span>
            <ChevronDown />
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("prompt.countLabel")}</DropdownMenuLabel>
          <div className="px-1.5 pb-1.5">
            <Tabs
              onValueChange={(value) => onCountChange(Number(value))}
              value={String(selectedCount)}
            >
              <TabsList className="w-full">
                <TabsTrigger value="1">1</TabsTrigger>
                <TabsTrigger value="2">2</TabsTrigger>
                <TabsTrigger value="3">3</TabsTrigger>
                <TabsTrigger value="4">4</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
