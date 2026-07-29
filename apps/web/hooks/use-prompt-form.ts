"use client"

import { atom, useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect, useState, useSyncExternalStore } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import type { EditorAspectRatio } from "@/atom/generate"
import type { UploadedImage } from "@/components/prompt-input/file-upload"
import type { PromptStyle } from "@/components/prompt-input/style-select"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import {
  type GenerateProjectInput,
  useGenerateProject,
} from "@/hooks/use-generate-project"
import { authClient } from "@/lib/auth-client"
import { useTranslation } from "@/i18n/client"

const promptSettingsCookieName = "prompt-settings"
const promptSettingsMaxAge = 60 * 60 * 24 * 365
const promptImagesAtom = atom<UploadedImage[]>([])
const defaultPromptSettings = {
  aspectRatio: "auto" as EditorAspectRatio,
  count: 2 as GenerateProjectInput["count"],
  style: {} satisfies PromptStyle,
}

function subscribePromptSettingsCookie() {
  return () => {}
}

function getServerPromptSettingsCookieValue() {
  return ""
}

function getPromptSettingsCookieValue() {
  if (typeof document === "undefined") {
    return ""
  }

  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${promptSettingsCookieName}=`))
      ?.split("=")[1] ?? ""
  )
}

function parsePromptSettingsCookie(cookieValue: string) {
  if (!cookieValue) {
    return null
  }

  try {
    const settings = JSON.parse(decodeURIComponent(cookieValue)) as {
      aspectRatio?: EditorAspectRatio
      count?: GenerateProjectInput["count"]
      style?: PromptStyle
    }

    return settings
  } catch {
    return null
  }
}

function setPromptSettingsCookie(settings: {
  aspectRatio: EditorAspectRatio
  count: GenerateProjectInput["count"]
  style: PromptStyle
}) {
  document.cookie = `${promptSettingsCookieName}=${encodeURIComponent(
    JSON.stringify(settings)
  )}; max-age=${promptSettingsMaxAge}; path=/; samesite=lax`
}

export function usePromptForm({
  initialPrompt = "",
  onInsufficientCredits,
}: {
  initialPrompt?: string
  onInsufficientCredits?: () => void
} = {}) {
  const { t } = useTranslation()
  const generateProject = useGenerateProject()
  const { openAuthDialog } = useAuthDialog()
  const router = useRouter()
  const session = authClient.useSession()
  const user = session.data?.user
  const promptSettingsCookie = useSyncExternalStore(
    subscribePromptSettingsCookie,
    getPromptSettingsCookieValue,
    getServerPromptSettingsCookieValue
  )
  const promptSettings = parsePromptSettingsCookie(promptSettingsCookie)
  const form = useForm<{
    aspectRatio: EditorAspectRatio
    count: GenerateProjectInput["count"]
    prompt: string
  }>({
    defaultValues: {
      prompt: initialPrompt,
      aspectRatio: defaultPromptSettings.aspectRatio,
      count: defaultPromptSettings.count,
    },
  })
  const { setValue } = form
  const prompt = useWatch({ control: form.control, name: "prompt" })
  const aspect = useWatch({ control: form.control, name: "aspectRatio" })
  const count = useWatch({ control: form.control, name: "count" })
  const [styleOverride, setStyleOverride] = useState<PromptStyle | null>(null)
  const style =
    styleOverride ?? promptSettings?.style ?? defaultPromptSettings.style
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useAtom(promptImagesAtom)
  const canGenerate =
    !isGenerating &&
    images.every((image) => image.dataUrl) &&
    prompt.trim().length > 0

  async function handleGenerate(
    options: Omit<GenerateProjectInput, "referenceImages">
  ) {
    if (!user) {
      const prompt = options.prompt.trim()

      openAuthDialog({
        callbackURL: prompt
          ? `/home?prompt=${encodeURIComponent(prompt)}`
          : "/home",
      })
      return
    }

    setIsGenerating(true)

    try {
      const referenceImages = images
        .map((image) => image.dataUrl)
        .filter((dataUrl): dataUrl is string => Boolean(dataUrl))
      const projectId = await generateProject({
        ...options,
        referenceImages,
        style,
      })
      setImages([])
      router.push(`/editor/${projectId}`)
    } catch (error) {
      setIsGenerating(false)

      if (error instanceof Error && error.message === "insufficient_credits") {
        onInsufficientCredits?.()
        return
      }

      toast.error(t("common.generationError"))
    }
  }

  useEffect(() => {
    setValue(
      "aspectRatio",
      promptSettings?.aspectRatio ?? defaultPromptSettings.aspectRatio
    )
    setValue("count", promptSettings?.count ?? defaultPromptSettings.count)
  }, [promptSettings?.aspectRatio, promptSettings?.count, setValue])

  function updatePromptSettingsCookie(settings: {
    aspectRatio?: EditorAspectRatio
    count?: GenerateProjectInput["count"]
    style?: PromptStyle
  }) {
    setPromptSettingsCookie({
      aspectRatio: settings.aspectRatio ?? aspect,
      count: settings.count ?? count,
      style: settings.style ?? style,
    })
  }

  return {
    aspect,
    canGenerate,
    count,
    form,
    handleGenerate,
    images,
    isGenerating,
    setAspect: (aspect: EditorAspectRatio) => {
      setValue("aspectRatio", aspect)
      updatePromptSettingsCookie({ aspectRatio: aspect })
    },
    setCount: (count: number) => {
      const nextCount = count as GenerateProjectInput["count"]

      setValue("count", nextCount)
      updatePromptSettingsCookie({ count: nextCount })
    },
    setImages,
    setPrompt: (prompt: string) => setValue("prompt", prompt),
    setStyle: (style: PromptStyle) => {
      setStyleOverride(style)
      updatePromptSettingsCookie({ style })
    },
    style,
  }
}
