"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useEditProject } from "@/hooks/use-edit-project"

export function EditButton({
  disabled,
  projectId,
}: {
  disabled: boolean
  projectId: string
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { editProject, isEditing } = useEditProject()
  const instruction = value.trim()
  const canSubmit = instruction.length > 0 && !isEditing && !disabled

  function submitEditInstruction() {
    if (!canSubmit) {
      return
    }

    setValue("")
    setOpen(false)
    void editProject({ instruction, projectId })
  }

  return (
    <>
      <Button
        disabled={disabled || isEditing}
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
      >
        編集
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form
            className="grid"
            onSubmit={(event) => {
              event.preventDefault()
              submitEditInstruction()
            }}
          >
            <DialogTitle className="text-lg">画像を編集</DialogTitle>
            <DialogDescription className="mt-2">
              画像を再生成します。
            </DialogDescription>
            <Textarea
              aria-label="編集内容"
              className="min-h-28 mt-3"
              onChange={(event) => setValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="編集内容を入力"
              value={value}
            />
            <DialogFooter className="mt-5">
              <Button onClick={() => setOpen(false)} variant="outline">
                キャンセル
              </Button>
              <Button disabled={!canSubmit} type="submit">
                生成
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
