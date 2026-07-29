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
import { useTranslation } from "@/i18n/client"

export function EditButton({
  disabled,
  projectId,
}: {
  disabled: boolean
  projectId: string
}) {
  const { t } = useTranslation()
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
        {t("editor.edit.button")}
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
            <DialogTitle className="text-lg">
              {t("editor.edit.title")}
            </DialogTitle>
            <DialogDescription className="mt-2">
              {t("editor.edit.description")}
            </DialogDescription>
            <Textarea
              aria-label={t("editor.edit.instruction")}
              className="min-h-28 mt-3"
              onChange={(event) => setValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder={t("editor.edit.placeholder")}
              value={value}
            />
            <DialogFooter className="mt-5">
              <Button onClick={() => setOpen(false)} variant="outline">
                {t("common.button.cancel")}
              </Button>
              <Button disabled={!canSubmit} type="submit">
                {t("common.button.generate")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
