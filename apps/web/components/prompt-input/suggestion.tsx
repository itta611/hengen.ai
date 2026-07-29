import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import {
  BriefcaseBusinessIcon,
  DollarSignIcon,
  FileImageIcon,
} from "lucide-react"
import { useTranslation } from "@/i18n/client"

const SuggestionButton = ({
  className,
  ...props
}: ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "transition cursor-pointer text-sm text-muted-foreground h-10 gap-2 rounded-lg px-5 flex items-center bg-zinc-50 hover:bg-zinc-100 active:scale-98 dark:bg-zinc-800 dark:hover:bg-zinc-700",
        className
      )}
      {...props}
    />
  )
}

export function Suggestion({
  onSelect,
}: {
  onSelect: (content: string) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="mt-7">
      <div className="flex gap-2 sm:justify-center flex-wrap">
        <SuggestionButton
          onClick={() => onSelect(t("prompt.suggestions.pricingPrompt"))}
        >
          <DollarSignIcon className="w-4 h-4" />
          {t("prompt.suggestions.pricingTitle")}
        </SuggestionButton>
        <SuggestionButton
          onClick={() => onSelect(t("prompt.suggestions.workflowPrompt"))}
        >
          <BriefcaseBusinessIcon className="w-4 h-4" />
          {t("prompt.suggestions.workflowTitle")}
        </SuggestionButton>
        <SuggestionButton
          onClick={() => onSelect(t("prompt.suggestions.posterPrompt"))}
        >
          <FileImageIcon className="w-4 h-4" />
          {t("prompt.suggestions.posterTitle")}
        </SuggestionButton>
      </div>
    </div>
  )
}
