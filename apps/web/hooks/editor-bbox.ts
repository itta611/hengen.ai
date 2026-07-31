"use client"

import Konva from "konva"

import type { EditorBox } from "@/atom/generate"
import { getFontFamilyCss } from "@/lib/google-fonts"

type TextStyle = {
  bold: boolean
  fontFamily: string
  fontSize: number
  lineheight: number
}

export function getBoxRect(box: EditorBox) {
  return getRect(box.bbox)
}

function getRect(points: { x?: number; y?: number }[]) {
  const xs = points.map((point) => point.x ?? 0)
  const ys = points.map((point) => point.y ?? 0)
  const left = Math.min(...xs)
  const top = Math.min(...ys)

  return {
    height: Math.max(...ys) - top,
    left,
    top,
    width: Math.max(...xs) - left,
  }
}

export function getFirstLineCenterY(box: EditorBox, lineCount: number) {
  const rect = box.verticalAlignBbox?.length
    ? getRect(box.verticalAlignBbox)
    : getBoxRect(box)
  const fontSize = box.fontSize
  const lineHeight = fontSize * (box.lineheight ?? 1.4)
  const blockHeight = fontSize + Math.max(0, lineCount - 1) * lineHeight

  if (box.verticalAlign === "top") {
    return rect.top + fontSize / 2
  }

  if (box.verticalAlign === "middle") {
    return rect.top + rect.height / 2 - blockHeight / 2 + fontSize / 2
  }

  return rect.top + rect.height - blockHeight + fontSize / 2
}

export function getTextOffsetY(box: EditorBox, lineCount: number) {
  const lineHeight = box.fontSize * (box.lineheight ?? 1.4)

  return (
    getFirstLineCenterY(box, lineCount) - lineHeight / 2 - getBoxRect(box).top
  )
}

function updateBboxRect(
  box: EditorBox,
  rect: { height: number; left: number; top: number; width: number }
): EditorBox {
  const current = getBoxRect(box)

  return {
    ...box,
    bbox: box.bbox.map((point) => ({
      ...point,
      x:
        rect.left +
        (current.width > 0
          ? (((point.x ?? current.left) - current.left) / current.width) *
            rect.width
          : 0),
      y:
        rect.top +
        (current.height > 0
          ? (((point.y ?? current.top) - current.top) / current.height) *
            rect.height
          : 0),
    })),
  }
}

function resizeBboxWidth(box: EditorBox, width: number): EditorBox {
  const rect = getBoxRect(box)
  const nextWidth = Math.max(1, Math.ceil(width))

  if (Math.ceil(rect.width) === nextWidth) {
    return box
  }

  const align = box.align ?? "center"
  const nextLeft =
    align === "left"
      ? rect.left
      : align === "right"
        ? rect.left + rect.width - nextWidth
        : rect.left + rect.width / 2 - nextWidth / 2

  return updateBboxRect(box, { ...rect, left: nextLeft, width: nextWidth })
}

function resizeBboxHeight(box: EditorBox, height: number): EditorBox {
  const rect = getBoxRect(box)
  const nextHeight = Math.max(1, Math.ceil(height))

  if (Math.ceil(rect.height) === nextHeight) {
    return box
  }

  return updateBboxRect(box, { ...rect, height: nextHeight })
}

function createTextMeasurer(style: TextStyle) {
  return new Konva.Text({
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontStyle: style.bold ? "700" : "500",
    lineHeight: style.lineheight,
    text: "Hg",
  })
}

export function getTextStyleBottomInset(style: TextStyle) {
  const measurer = createTextMeasurer(style)
  const metrics = measurer.measureSize("Hg")
  const lineHeight = style.fontSize * style.lineheight
  const ascent =
    metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent
  const descent =
    metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent
  const baseline = (ascent - descent) / 2 + lineHeight / 2

  return Math.max(0, baseline + metrics.actualBoundingBoxDescent - lineHeight)
}

export function getTextTrailingSpacing(box: EditorBox, label = box.label) {
  return label.split("\n").some((line) => line.length > 0)
    ? (box.letterSpacing ?? 0)
    : 0
}

export function createBoxTextNode(box: EditorBox, label = box.label) {
  const rect = getBoxRect(box)
  const letterSpacing = box.letterSpacing ?? 0
  const trailingSpacing = getTextTrailingSpacing(box, label)

  return new Konva.Text({
    align: box.align ?? "center",
    fill: box.color ?? "rgba(0,0,0,1)",
    fontFamily: getFontFamilyCss(box.fontFamily),
    fontSize: box.fontSize,
    fontStyle: box.bold ? "700" : "500",
    letterSpacing,
    lineHeight: box.lineheight ?? 1.4,
    text: label,
    width: box.wrapText ? rect.width + trailingSpacing : undefined,
    wrap: box.wrapText ? "char" : "none",
  })
}

export function getBoxTextWidth(box: EditorBox, label = box.label) {
  const width = createBoxTextNode(box, label).getTextWidth()

  return width - getTextTrailingSpacing(box, label)
}

export function resizeTextBox(box: EditorBox, label: string) {
  const nextBox = { ...box, label }
  const textNode = createBoxTextNode(nextBox, label)

  return resizeBboxHeight(
    nextBox.wrapText
      ? nextBox
      : resizeBboxWidth(nextBox, getBoxTextWidth(nextBox, label) + 1),
    textNode.height()
  )
}

export function moveTextBox(box: EditorBox, left: number, top: number) {
  const rect = getBoxRect(box)
  const x = left - rect.left
  const y = top - rect.top

  return updateBboxRect(
    box.verticalAlignBbox
      ? {
          ...box,
          verticalAlignBbox: box.verticalAlignBbox.map((point) => ({
            ...point,
            x: (point.x ?? 0) + x,
            y: (point.y ?? 0) + y,
          })),
        }
      : box,
    { ...rect, left, top }
  )
}

export function resizeWrappedTextBox(
  box: EditorBox,
  left: number,
  width: number
) {
  const rect = getBoxRect(box)
  const nextBox = updateBboxRect(
    { ...box, wrapText: true },
    {
      ...rect,
      left,
      width: Math.max(1, Math.ceil(width)),
    }
  )

  return resizeBboxHeight(nextBox, createBoxTextNode(nextBox).height())
}
