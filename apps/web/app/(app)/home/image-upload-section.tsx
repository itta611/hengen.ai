"use client"

import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { InsufficientCreditDialog } from "@/components/prompt-input/insufficient-credit-dialog"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { useGenerateProject } from "@/hooks/use-generate-project"
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [isInsufficientCreditsOpen, setInsufficientCreditsOpen] =
    useState(false)
  const { openAuthDialog } = useAuthDialog()
  const generateProject = useGenerateProject()
  const router = useRouter()
  const user = authClient.useSession().data?.user

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""

    if (!file) return

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
      const projectId = await generateProject({
        aspectRatio: "auto",
        count: 1,
        prompt: "",
        referenceImages: [referenceImage],
        style: {},
      })
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

  return (
    <>
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
          <div className="text-muted-foreground">PNG, JPG, WebP形式</div>
        </div>
      </button>
      <InsufficientCreditDialog
        isOpen={isInsufficientCreditsOpen}
        onOpenChange={setInsufficientCreditsOpen}
      />
    </>
  )
}
