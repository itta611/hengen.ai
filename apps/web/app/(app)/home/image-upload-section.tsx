"use client"

import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
} from "react"
import { toast } from "sonner"

import { InsufficientCreditDialog } from "@/components/prompt-input/insufficient-credit-dialog"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { useGenerateProjectFromImage } from "@/hooks/use-generate-project"
import { authClient } from "@/lib/auth-client"

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function ImageUploadSection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isInsufficientCreditsOpen, setInsufficientCreditsOpen] =
    useState(false)
  const { openAuthDialog } = useAuthDialog()
  const generateProjectFromImage = useGenerateProjectFromImage()
  const router = useRouter()
  const user = authClient.useSession().data?.user

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルのみアップロードできます。")
      return
    }

    if (!user) {
      openAuthDialog()
      return
    }

    setIsGenerating(true)

    try {
      const referenceImage = await fileToDataUrl(file)
      const projectId = await generateProjectFromImage(referenceImage)
      router.push(`/editor/${projectId}`)
    } catch (error) {
      setIsGenerating(false)

      if (error instanceof Error && error.message === "insufficient_credits") {
        setInsufficientCreditsOpen(true)
        return
      }

      toast.error("生成に失敗しました。")
    }
  }

  const uploadPastedImage = useEffectEvent(uploadImage)

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (
        isGenerating ||
        !sectionRef.current ||
        sectionRef.current.getClientRects().length === 0
      ) {
        return
      }

      const image = Array.from(event.clipboardData?.items ?? [])
        .find(
          (item) => item.kind === "file" && item.type.startsWith("image/")
        )
        ?.getAsFile()

      if (!image) return

      event.preventDefault()
      void uploadPastedImage(image)
    }

    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [isGenerating])

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""

    if (file) {
      void uploadImage(file)
    }
  }

  return (
    <div className="w-full" ref={sectionRef}>
      <input
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        disabled={isGenerating}
        onChange={handleImageChange}
        ref={inputRef}
        type="file"
      />
      <button
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-dashed p-3 transition active:scale-98 disabled:pointer-events-none disabled:opacity-50"
        disabled={isGenerating}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
          <PlusIcon className="size-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-0.5 text-left text-sm">
          <div className="font-bold text-primary">画像を追加</div>
          <div className="text-muted-foreground">
            PNG, JPG, WebP形式・貼り付け
          </div>
        </div>
      </button>
      <InsufficientCreditDialog
        isOpen={isInsufficientCreditsOpen}
        onOpenChange={setInsufficientCreditsOpen}
      />
    </div>
  )
}
