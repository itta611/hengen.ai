"use client"

import { ArrowUpIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEditProject } from "@/hooks/use-edit-project"

export function TextEditInput() {
  const [value, setValue] = useState("")
  const { projectId } = useParams<{ projectId: string }>()
  const { editProject, isEditing } = useEditProject()
  const instruction = value.trim()
  const canSubmit = instruction.length > 0 && !isEditing

  function submitEditInstruction() {
    if (!canSubmit) {
      return
    }

    setValue("")
    void editProject({ instruction, projectId })
  }

  return (
    <form
      className="absolute inset-x-0 bottom-26 z-10 flex justify-center px-4"
      onSubmit={(event) => {
        event.preventDefault()
        submitEditInstruction()
      }}
    >
      <div className="flex w-full max-w-120 items-end gap-2 rounded-xl border border-border/70 bg-background/95 shadow-lg/5 backdrop-blur">
        <div className="flex items-center h-full grow">
          <Textarea
            aria-label="編集内容"
            className="min-h-auto! flex-1 border-0 bg-transparent px-3.5 py-2 shadow-none ring-0! outline-none"
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="編集内容を入力.."
            value={value}
          />
        </div>
        <Button
          aria-label="編集内容を反映"
          disabled={!canSubmit}
          size="icon"
          type="submit"
          className="m-1.5"
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </form>
  )
}
