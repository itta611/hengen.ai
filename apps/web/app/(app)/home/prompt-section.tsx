"use client"

import { useState } from "react"

import { PromptInputForm } from "@/components/prompt-input"
import { Suggestion } from "@/components/prompt-input/suggestion"
import { usePromptForm } from "@/hooks/use-prompt-form"

export function PromptSection({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [isInsufficientCreditsOpen, setInsufficientCreditsOpen] =
    useState(false)
  const controller = usePromptForm({
    initialPrompt,
    onInsufficientCredits: () => setInsufficientCreditsOpen(true),
  })

  return (
    <>
      <PromptInputForm
        controller={controller}
        isInsufficientCreditsOpen={isInsufficientCreditsOpen}
        setInsufficientCreditsOpen={setInsufficientCreditsOpen}
      />
      <Suggestion onSelect={controller.setPrompt} />
    </>
  )
}
