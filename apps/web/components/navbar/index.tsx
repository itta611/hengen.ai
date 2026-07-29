"use client"

import { useAtomValue } from "jotai"
import { DownloadIcon, XIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { editorBoxesAtom } from "@/atom/generate"
import { usePricingDialog } from "@/components/pricing-dialog"
import { Button } from "@/components/ui/button"
import { useCurrentPlan } from "@/hooks/use-current-plan"
import { useEditorProjectData } from "@/hooks/use-editor-project"
import { useExport } from "@/hooks/use-export"
import { useTranslation } from "@/i18n/client"
import { CopyButton } from "./copy-button"
import { EditButton } from "./edit"

export function Navbar() {
  const { t } = useTranslation()
  const router = useRouter()
  const { projectId } = useParams<{ projectId: string }>()
  const boxes = useAtomValue(editorBoxesAtom)
  const { data: currentPlan } = useCurrentPlan()
  const pricingDialog = usePricingDialog()
  const { project } = useEditorProjectData(projectId)
  const imageSize = project
    ? ([project.width, project.height] as [number, number])
    : null
  const projectName = project?.title ?? ""
  const { copyPng, copySvg, downloadPng } = useExport({
    boxes,
    imageSize,
    projectId,
    projectName,
  })
  const disabled = !projectId || !imageSize

  async function handleDownloadPng() {
    try {
      await downloadPng()
    } catch {
      toast.error(t("editor.saveError"))
    }
  }

  return (
    <nav className="shrink-0 flex h-13 items-center bg-sidebar border-b border-border/70 pr-4 pl-2 gap-2">
      <Button
        aria-label={t("editor.home")}
        onClick={() => router.push("/home")}
        size="icon-lg"
        type="button"
        variant="ghost"
      >
        <XIcon />
      </Button>
      <div className="grow w-0 truncate">{projectName}</div>
      {currentPlan !== "free" ? (
        <EditButton disabled={disabled} projectId={projectId} />
      ) : null}
      <CopyButton
        disabled={disabled}
        isSvgPaidFeature={currentPlan === "free"}
        onCopyImage={async () => {
          await copyPng()
          toast(t("editor.copied"))
        }}
        onCopySvg={async () => {
          if (currentPlan === "free") {
            pricingDialog.open()
            return
          }

          await copySvg()
          toast(t("editor.copied"))
        }}
      />
      <Button disabled={disabled} onClick={handleDownloadPng} type="button">
        <DownloadIcon />
        {t("editor.saveImage")}
      </Button>
    </nav>
  )
}
