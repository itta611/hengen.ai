"use client"

import { useAtomValue, useSetAtom } from "jotai"
import { ArrowUpIcon } from "lucide-react"
import { useState } from "react"

import {
  editorBoxesAtom,
  editorSaveBoxesAtom,
  editorSelectedBoxIndexesAtom,
} from "@/atom/generate"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { resizeTextBox } from "@/hooks/editor-bbox"

export function TextEditInput() {
  const [value, setValue] = useState("")
  const setBoxes = useSetAtom(editorBoxesAtom)
  const selectedIndexes = useAtomValue(editorSelectedBoxIndexesAtom)
  const saveBoxes = useAtomValue(editorSaveBoxesAtom)
  const hasSelection = selectedIndexes.length > 0

  function updateSelectedText() {
    if (!hasSelection) {
      return
    }

    const selectedIndexSet = new Set(selectedIndexes)

    setBoxes((current) => {
      const next = current.map((box, index) =>
        selectedIndexSet.has(index) ? resizeTextBox(box, value) : box
      )

      saveBoxes?.(next)
      return next
    })
    setValue("")
  }

  return (
    <form
      className="absolute inset-x-0 bottom-26 z-10 flex justify-center px-4"
      onSubmit={(event) => {
        event.preventDefault()
        updateSelectedText()
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
          disabled={!hasSelection}
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
