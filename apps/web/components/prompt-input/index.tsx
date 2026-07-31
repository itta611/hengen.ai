"use client"

import { SparklesIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { type Dispatch, type SetStateAction, useState } from "react"
import { ImagePreview } from "@/components/image-preview"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePromptForm } from "@/hooks/use-prompt-form"
import { useTranslation } from "@/i18n/client"
import { cn } from "@/lib/utils"
import { AspectSelect } from "./aspect-select"
import { CountSelect } from "./count-select"
import { FileDropUpload } from "./file-drop-upload"
import { addImageFiles, FileUpload } from "./file-upload"
import { InsufficientCreditDialog } from "./insufficient-credit-dialog"
import { StyleSelect } from "./style-select"

type PromptInputController = ReturnType<typeof usePromptForm>

export function PromptInputForm({
  className,
  controller,
  isInsufficientCreditsOpen,
  setInsufficientCreditsOpen,
}: {
  className?: string
  controller: PromptInputController
  isInsufficientCreditsOpen?: boolean
  setInsufficientCreditsOpen?: Dispatch<SetStateAction<boolean>>
}) {
  const { t } = useTranslation()
  const [previewImage, setPreviewImage] = useState<{
    height: number
    src: string
    width: number
  } | null>(null)
  const {
    aspect,
    canGenerate,
    count,
    form,
    handleGenerate,
    images,
    isGenerating,
    setAspect,
    setCount,
    setImages,
    setStyle,
    style,
  } = controller
  const { handleSubmit, register } = form

  return (
    <>
      <FileDropUpload images={images} setImages={setImages} />
      <form
        onSubmit={handleSubmit(handleGenerate)}
        className={cn(
          "rounded-[20px] border-2 shadow-lg/5 border-primary p-2.5 bg-background dark:bg-zinc-900 relative z-20",
          className
        )}
      >
        <Textarea
          id="generation-prompt"
          {...register("prompt")}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              if (canGenerate) {
                event.currentTarget.form?.requestSubmit()
              }
            }
          }}
          onPaste={(event) => {
            const files = Array.from(event.clipboardData.files)
            if (files.length === 0) return
            event.preventDefault()
            addImageFiles(files, images, setImages, t("common.uploadTypeError"))
          }}
          className="min-h-15 resize-none rounded-none border-none px-2 pt-1 pb-2 shadow-none ring-0! outline-none leading-relaxed bg-transparent!"
          placeholder={t("prompt.placeholder")}
        />
        <div className="flex items-end justify-between">
          <div className="flex gap-px">
            <FileUpload images={images} setImages={setImages} />
            <AspectSelect selectedAspect={aspect} onAspectChange={setAspect} />
            <CountSelect selectedCount={count} onCountChange={setCount} />
            <StyleSelect style={style} onStyleChange={setStyle} />
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canGenerate}
                  className="border-0"
                >
                  <SparklesIcon data-icon="inline-end" />
                  {isGenerating ? t("prompt.generating") : t("prompt.generate")}
                </Button>
              }
            />
            <TooltipContent side="bottom">{t("prompt.credits")}</TooltipContent>
          </Tooltip>
        </div>
      </form>
      {images.length > 0 ? (
        <div className="mx-0.5 flex flex-wrap gap-2 rounded-b-2xl border-b border-l border-r bg-zinc-50 dark:bg-zinc-800 p-2 pt-6 relative -top-4 -mb-4 z-10">
          {images.map((image, index) => (
            <div
              className="flex max-w-52 items-center gap-2.5 rounded-lg bg-background dark:bg-white/5 p-1 pr-2.5 text-xs border"
              key={`${image.file.name}-${image.file.lastModified}-${index}`}
            >
              <button
                className="size-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0 disabled:cursor-default"
                disabled={!image.dataUrl}
                onClick={() =>
                  image.dataUrl &&
                  setPreviewImage({
                    height: window.innerHeight,
                    src: image.dataUrl,
                    width: window.innerWidth,
                  })
                }
                type="button"
              >
                {image.dataUrl ? (
                  <Image
                    alt=""
                    className="size-full object-cover border"
                    height={32}
                    src={image.dataUrl}
                    width={32}
                  />
                ) : (
                  <Skeleton className="size-full" />
                )}
              </button>
              <span className="truncate">{image.file.name}</span>
              <button
                aria-label={t("prompt.removeImage", { name: image.file.name })}
                className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() =>
                  setImages((current) =>
                    current.filter((_, imageIndex) => imageIndex !== index)
                  )
                }
                type="button"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {previewImage ? (
        <ImagePreview
          height={previewImage.height}
          onClose={() => setPreviewImage(null)}
          src={previewImage.src}
          width={previewImage.width}
        />
      ) : null}
      {isInsufficientCreditsOpen !== undefined && setInsufficientCreditsOpen ? (
        <InsufficientCreditDialog
          isOpen={isInsufficientCreditsOpen}
          onOpenChange={setInsufficientCreditsOpen}
        />
      ) : null}
    </>
  )
}

export function PromptInput({
  initialPrompt = "",
}: {
  initialPrompt?: string
}) {
  const controller = usePromptForm({ initialPrompt })

  return (
    <PromptInputForm
      controller={controller}
      className="max-w-[680px] mx-auto"
    />
  )
}
