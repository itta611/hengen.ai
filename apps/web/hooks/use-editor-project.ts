"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { toast } from "sonner"

import {
  type EditorBox,
  editorBoxesAtom,
  editorSelectedBoxIndexAtom,
  editorSelectedBoxIndexesAtom,
} from "@/atom/generate"
import type { GeneratedImage } from "@/components/gallary"
import { resizeTextBox } from "@/hooks/editor-bbox"
import { apiClient } from "@/lib/api-client"
import { loadGoogleFont } from "@/lib/google-fonts"
import { useTranslation } from "@/i18n/client"

type ProjectBox = EditorBox & { lineHeight?: number }

type EditorProject = {
  analysis: { boxes: ProjectBox[]; summary: string }
  height: number
  id: string
  prompt: string
  status: "ready"
  title: string
  width: number
}

type EditorProjectStatus = {
  createdAt: string
  prompt: string
  status: "generating" | "analyzing" | "erasing" | "ready" | "error"
}

async function getProject(projectId: string) {
  const response = await apiClient.projects[":projectId"].$get({
    param: { projectId },
  })

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return (await response.json()) as EditorProject
}

async function getProjectStatus(projectId: string) {
  const response = await apiClient.projects[":projectId"].status.$get({
    param: { projectId },
  })

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return (await response.json()) as EditorProjectStatus
}

export function editorProjectQuery(projectId: string) {
  return {
    queryKey: ["editor-project", projectId] as const,
    queryFn: () => getProject(projectId),
    staleTime: 60 * 1000,
  }
}

export function editorProjectStatusQuery(projectId: string) {
  return {
    queryKey: ["editor-project-status", projectId] as const,
    queryFn: () => getProjectStatus(projectId),
  }
}

export function useEditorProjectData(projectId: string) {
  const statusQuery = useQuery({
    ...editorProjectStatusQuery(projectId),
    refetchInterval: (query) => {
      const status = query.state.data?.status

      return status && status !== "ready" && status !== "error" ? 5000 : false
    },
  })
  const projectQuery = useQuery({
    ...editorProjectQuery(projectId),
    enabled: statusQuery.data?.status === "ready",
  })

  return {
    isError: statusQuery.isError || projectQuery.isError,
    project: projectQuery.data,
    projectStatus: statusQuery.data,
  }
}

export function useEditorProject(projectId: string) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setBoxes = useSetAtom(editorBoxesAtom)
  const setSelectedIndex = useSetAtom(editorSelectedBoxIndexAtom)
  const setSelectedIndexes = useSetAtom(editorSelectedBoxIndexesAtom)
  const { isError, project, projectStatus } = useEditorProjectData(projectId)

  useEffect(() => {
    if (projectStatus?.status !== "error") {
      return
    }

    toast.error(t("common.generationError"), {
      id: `project-generation-error-${projectId}`,
    })
    queryClient.setQueriesData<GeneratedImage[]>(
      { queryKey: ["projects"] },
      (projects) => projects?.filter((project) => project.id !== projectId)
    )
  }, [projectStatus?.status, projectId, queryClient, t])

  useEffect(() => {
    let cancelled = false

    setSelectedIndex(null)
    setSelectedIndexes([])
    setBoxes([])

    if (!project || isError) {
      return
    }

    void Promise.all(
      project.analysis.boxes.map((box) => loadGoogleFont(box.fontFamily))
    ).then((fontFamilies) => {
      if (cancelled) {
        return
      }

      setBoxes(
        project.analysis.boxes.map(({ lineHeight, ...box }, index) => {
          const nextBox = {
            ...box,
            fontFamily: fontFamilies[index],
            lineheight:
              box.label.split("\n").length === 1
                ? 1
                : (box.lineheight ?? lineHeight),
          }

          return resizeTextBox(nextBox, box.label)
        })
      )
    })

    return () => {
      cancelled = true
    }
  }, [
    project,
    projectId,
    isError,
    setBoxes,
    setSelectedIndex,
    setSelectedIndexes,
  ])

  return { data: project, isError, projectStatus }
}
