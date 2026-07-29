"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

type EditProjectInput = {
  instruction: string
  projectId: string
}

async function editProject({ instruction, projectId }: EditProjectInput) {
  const response = await apiClient.projects[":projectId"].edit.$post({
    param: { projectId },
    json: { instruction },
  })

  if (response.status === 402) {
    throw new Error("insufficient_credits")
  }

  if (!response.ok) {
    throw new Error("edit_failed")
  }

  return response.json()
}

export function useEditProject() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: editProject,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["credit-usage"] }),
  })

  return {
    isEditing: mutation.isPending,
    editProject: async (input: EditProjectInput) => {
      try {
        const data = await mutation.mutateAsync(input)

        await queryClient.invalidateQueries({ queryKey: ["projects"] })
        router.push(`/editor/${data.projectId}`)
      } catch (error) {
        toast.error(
          error instanceof Error && error.message === "insufficient_credits"
            ? "クレジットが不足しています。"
            : "編集に失敗しました。"
        )
      }
    },
  }
}
