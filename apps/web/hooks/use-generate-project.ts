"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export type GenerateProjectInput = NonNullable<
  Parameters<typeof apiClient.projects.$post>[0]
>["json"]

async function createProject(input: GenerateProjectInput) {
  const response = await apiClient.projects.$post({
    json: input,
  })

  if (response.status === 402) {
    throw new Error("insufficient_credits")
  }

  if (!response.ok) {
    throw new Error("create_failed")
  }

  return response.json()
}

export function useGenerateProject() {
  const queryClient = useQueryClient()
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["credit-usage"] }),
  })

  return async function generateProject(input: GenerateProjectInput) {
    const data = await createProjectMutation.mutateAsync(input)
    const projectId = data.projectIds.at(-1)

    if (!projectId) {
      throw new Error("create_failed")
    }

    return projectId
  }
}

async function createProjectFromImage(referenceImage: string) {
  const response = await apiClient.projects["from-image"].$post({
    json: { referenceImage },
  })

  if (response.status === 402) {
    throw new Error("insufficient_credits")
  }

  if (!response.ok) {
    throw new Error("create_failed")
  }

  return response.json()
}

export function useGenerateProjectFromImage() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createProjectFromImage,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["credit-usage"] }),
  })

  return async function generateProjectFromImage(referenceImage: string) {
    const data = await mutation.mutateAsync(referenceImage)
    return data.projectId
  }
}
