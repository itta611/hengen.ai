import { atom } from "jotai"

export type EditorAspectRatio = "auto" | "16:9" | "4:3" | "3:4" | "1:1"
export type ImageSize = [width: number, height: number]
export type EditorBox = {
  align?: "left" | "center" | "right"
  bbox: { x?: number; y?: number }[]
  bold?: boolean
  color?: string
  fontFamily?: string
  fontSize: number
  label: string
  letterSpacing?: number
  lineheight?: number
  wrapText?: boolean
}

export const editorBoxesAtom = atom<EditorBox[]>([])
export const editorSaveBoxesAtom = atom<((boxes: EditorBox[]) => void) | null>(
  null
)
export const editorSelectedBoxIndexAtom = atom<number | null>(null)
export const editorSelectedBoxIndexesAtom = atom<number[]>([])
