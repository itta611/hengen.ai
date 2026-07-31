"use client"

import type { EditorBox, ImageSize } from "@/atom/generate"
import { getBoxRect, getFirstLineCenterY } from "@/hooks/editor-bbox"
import {
  getFontFamilyCss,
  loadGoogleFont,
  normalizeFontFamily,
} from "@/lib/google-fonts"

function getTextWidth(
  context: CanvasRenderingContext2D,
  text: string,
  letterSpacing: number
) {
  return (
    context.measureText(text).width +
    Math.max(0, Array.from(text).length - 1) * letterSpacing
  )
}

function fillText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number
) {
  if (letterSpacing === 0) {
    context.fillText(text, x, y)
    return
  }

  const chars = Array.from(text)
  const width = getTextWidth(context, text, letterSpacing)
  const textAlign = context.textAlign
  let currentX =
    textAlign === "right"
      ? x - width
      : textAlign === "center"
        ? x - width / 2
        : x

  context.textAlign = "left"
  for (const char of chars) {
    context.fillText(char, currentX, y)
    currentX += context.measureText(char).width + letterSpacing
  }
  context.textAlign = textAlign
}

function getTextLines(
  context: CanvasRenderingContext2D,
  box: EditorBox,
  boxWidth: number
) {
  const letterSpacing = box.letterSpacing ?? 0

  return box.wrapText
    ? box.label.split("\n").flatMap((line) => {
        const wrappedLines: string[] = []
        let currentLine = ""

        for (const char of Array.from(line)) {
          const nextLine = currentLine + char

          if (
            currentLine &&
            getTextWidth(context, nextLine, letterSpacing) > boxWidth
          ) {
            wrappedLines.push(currentLine)
            currentLine = char
          } else {
            currentLine = nextLine
          }
        }

        return currentLine ? [...wrappedLines, currentLine] : wrappedLines
      })
    : box.label.split("\n")
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function getTextBaselineOffset(context: CanvasRenderingContext2D) {
  const metrics = context.measureText("M")
  const ascent =
    metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent
  const descent =
    metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent

  return (ascent - descent) / 2
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error("blob_unavailable"))
      }
    }, "image/png")
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function toHexColor(color: string) {
  const values = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number)

  if (!values || values.length !== 3) {
    return color.replace("#", "")
  }

  return values
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")
}

async function loadImage(src: string) {
  const image = new Image()
  image.decoding = "async"
  image.src = src
  await image.decode()
  return image
}

async function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export function useExport({
  boxes,
  imageSize,
  projectId,
  projectName,
}: {
  boxes: EditorBox[]
  imageSize: ImageSize | null
  projectId: string | undefined
  projectName: string
}) {
  async function exportPngBlob() {
    if (!projectId || !imageSize) {
      throw new Error("project_not_ready")
    }

    const image = await loadImage(`/api/projects/${projectId}/image`)
    const fontFamilies = await Promise.all(
      boxes.map((box) => loadGoogleFont(box.fontFamily))
    )
    const [width, height] = imageSize
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("canvas_unavailable")
    }

    context.drawImage(image, 0, 0, width, height)

    boxes.forEach((box, index) => {
      const rect = getBoxRect(box)
      const fontSize = box.fontSize
      const letterSpacing = box.letterSpacing ?? 0
      const lineheight = box.lineheight ?? 1.4
      const lineHeight = fontSize * lineheight
      const fontFamily = getFontFamilyCss(fontFamilies[index])

      context.font = `${box.bold ? 700 : 500} ${fontSize}px ${fontFamily}`

      const lines = getTextLines(context, box, rect.width)
      const align = box.align ?? "center"
      const x =
        align === "left"
          ? rect.left
          : align === "right"
            ? rect.left + rect.width
            : rect.left + rect.width / 2
      const firstLineY =
        getFirstLineCenterY(box, lines.length) + getTextBaselineOffset(context)

      context.fillStyle = box.color ?? "rgba(0,0,0,1)"
      context.textAlign = align
      context.textBaseline = "alphabetic"

      lines.forEach((line, index) => {
        fillText(
          context,
          line,
          x,
          firstLineY + index * lineHeight,
          letterSpacing
        )
      })
    })

    return canvasToBlob(canvas)
  }

  async function exportSvgText() {
    if (!projectId || !imageSize) {
      throw new Error("project_not_ready")
    }

    const [width, height] = imageSize
    const imageBlob = await fetch(`/api/projects/${projectId}/image`).then(
      (response) => response.blob()
    )
    const imageDataUrl = await blobToDataUrl(imageBlob)
    const fontFamilies = await Promise.all(
      boxes.map((box) => loadGoogleFont(box.fontFamily))
    )
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("canvas_unavailable")
    }

    const texts = boxes.map((box, index) => {
      const rect = getBoxRect(box)
      const fontSize = box.fontSize
      const lineheight = box.lineheight ?? 1.4
      const lineHeight = fontSize * lineheight
      const fontFamily = getFontFamilyCss(fontFamilies[index])
      const align = box.align ?? "center"
      const x =
        align === "left"
          ? rect.left
          : align === "right"
            ? rect.left + rect.width
            : rect.left + rect.width / 2
      const textAnchor =
        align === "left" ? "start" : align === "right" ? "end" : "middle"
      const letterSpacing = box.letterSpacing ?? 0
      const anchorOffset =
        align === "right"
          ? letterSpacing
          : align === "center"
            ? letterSpacing / 2
            : 0

      context.font = `${box.bold ? 700 : 500} ${fontSize}px ${fontFamily}`
      const lines = getTextLines(context, box, rect.width)
      const firstLineY =
        getFirstLineCenterY(box, lines.length) + getTextBaselineOffset(context)

      return `<text fill="${escapeXml(
        box.color ?? "rgba(0,0,0,1)"
      )}" font-family="${escapeXml(fontFamily)}" font-size="${fontSize}" font-weight="${box.bold ? 700 : 500}" letter-spacing="${letterSpacing}" text-anchor="${textAnchor}" xml:space="preserve">${lines
        .map(
          (line, index) =>
            `<tspan x="${x + anchorOffset}" y="${firstLineY + index * lineHeight}">${escapeXml(line)}</tspan>`
        )
        .join("")}</text>`
    })

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="${imageDataUrl}" width="${width}" height="${height}"/>${texts.join("")}</svg>`
  }

  return {
    copyPng: async () => {
      const blob = await exportPngBlob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ])
    },
    downloadPng: async () => {
      const blob = await exportPngBlob()
      downloadBlob(blob, `${projectName || "image"}.png`)
    },
    downloadSvg: async () => {
      const svg = await exportSvgText()
      downloadBlob(
        new Blob([svg], { type: "image/svg+xml" }),
        `${projectName || "image"}.svg`
      )
    },
    downloadPptx: async () => {
      if (!projectId || !imageSize) {
        throw new Error("project_not_ready")
      }

      const [{ default: PptxGenJS }, imageBlob, fontFamilies] =
        await Promise.all([
          import("pptxgenjs"),
          fetch(`/api/projects/${projectId}/image`).then((response) =>
            response.blob()
          ),
          Promise.all(boxes.map((box) => loadGoogleFont(box.fontFamily))),
        ])
      const [width, height] = imageSize
      const slideWidth = 10
      const slideHeight = (slideWidth * height) / width
      const inchesPerPixel = slideWidth / width
      const pointsPerPixel = inchesPerPixel * 72
      const imageDataUrl = await blobToDataUrl(imageBlob)
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("canvas_unavailable")
      }

      const pptx = new PptxGenJS()
      pptx.defineLayout({
        name: "HENGEN",
        width: slideWidth,
        height: slideHeight,
      })
      pptx.layout = "HENGEN"
      pptx.author = "Hengen"
      pptx.subject = projectName
      pptx.title = projectName

      const slide = pptx.addSlide()
      slide.addImage({
        data: imageDataUrl,
        x: 0,
        y: 0,
        w: slideWidth,
        h: slideHeight,
      })

      boxes.forEach((box, index) => {
        const rect = getBoxRect(box)
        const fontFamily = normalizeFontFamily(fontFamilies[index])
        const lineheight = box.lineheight ?? 1.4

        context.font = `${box.bold ? 700 : 500} ${box.fontSize}px ${getFontFamilyCss(fontFamily)}`
        const lines = getTextLines(context, box, rect.width)
        const blockHeight =
          box.fontSize +
          Math.max(0, lines.length - 1) * box.fontSize * lineheight
        const top = getFirstLineCenterY(box, lines.length) - box.fontSize / 2

        slide.addText(lines.join("\n"), {
          x: rect.left * inchesPerPixel,
          y: top * inchesPerPixel,
          w: rect.width * inchesPerPixel,
          h: blockHeight * inchesPerPixel,
          align: box.align ?? "center",
          bold: box.bold ?? false,
          breakLine: false,
          charSpacing: (box.letterSpacing ?? 0) * pointsPerPixel,
          color: toHexColor(box.color ?? "rgba(0,0,0,1)"),
          fontFace: fontFamily,
          fontSize: box.fontSize * pointsPerPixel,
          isTextBox: true,
          lineSpacing: box.fontSize * lineheight * pointsPerPixel,
          margin: 0,
          valign: "top",
          wrap: false,
        })
      })

      await pptx.writeFile({
        fileName: `${projectName || "image"}.pptx`,
      })
    },
  }
}
