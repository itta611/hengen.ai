"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ClipboardIcon,
  EllipsisIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/i18n/client"
import { apiClient } from "@/lib/api-client"

export type ProjectDropdownMenuProject = {
  id: string
  isStarred: boolean
  deletedAt: Date | string | null
  prompt: string
  status: string
  title: string
}

async function deleteProject(id: string) {
  const response = await apiClient.projects[":projectId"].$delete({
    param: { projectId: id },
  })

  if (!response.ok) {
    throw new Error("delete_failed")
  }

  return response.json()
}

async function restoreProject(id: string) {
  const response = await apiClient.projects[":projectId"].restore.$post({
    param: { projectId: id },
  })

  if (!response.ok) {
    throw new Error("restore_failed")
  }

  return response.json()
}

export function ProjectDropdownMenu({
  align = "start",
  onDelete,
  onRestore,
  onStarredChange,
  project,
}: {
  align?: "start" | "center" | "end"
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
  onStarredChange: (
    project: ProjectDropdownMenuProject,
    isStarred: boolean
  ) => void
  project: ProjectDropdownMenuProject
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (_data, id) => {
      onDelete?.(id)
      queryClient.invalidateQueries({ queryKey: ["projects", "starred"] })
      queryClient.invalidateQueries({ queryKey: ["projects", "trash"] })
      toast.success(t("gallery.deleteSuccess"))
    },
  })
  const restoreProjectMutation = useMutation({
    mutationFn: restoreProject,
    onSuccess: (_data, id) => {
      onRestore?.(id)
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["projects", "starred"] })
      toast.success(t("gallery.restoreSuccess"))
    },
  })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon-sm"
            variant="ghost"
            type="button"
            className="text-muted-foreground"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            <EllipsisIcon />
          </Button>
        }
      />
      <DropdownMenuContent align={align} className="w-52">
        <DropdownMenuItem
          disabled={project.prompt.trim().length === 0}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            navigator.clipboard.writeText(project.prompt)
          }}
        >
          <ClipboardIcon />
          {t("gallery.copyPrompt")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onStarredChange(project, !project.isStarred)
          }}
        >
          {project.isStarred ? <StarOffIcon /> : <StarIcon />}
          {project.isStarred ? t("gallery.removeStar") : t("gallery.addStar")}
        </DropdownMenuItem>
        {project.deletedAt ? (
          <DropdownMenuItem
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              restoreProjectMutation.mutate(project.id)
            }}
          >
            <Undo2Icon />
            {t("common.button.restore")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              deleteProjectMutation.mutate(project.id)
            }}
          >
            <Trash2Icon />
            {t("common.button.delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
