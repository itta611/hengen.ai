import { PaperclipIcon } from "lucide-react"
import { useRef, type Dispatch, type SetStateAction } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const acceptedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
])

export type UploadedImage = {
  dataUrl?: string
  file: File
}

export function addImageFiles(
  files: File[],
  images: UploadedImage[],
  setImages: Dispatch<SetStateAction<UploadedImage[]>>
) {
  if (files.some((file) => !acceptedImageTypes.has(file.type))) {
    toast.error("JPEG、PNG、GIF、WebP形式の画像のみアップロードできます。")
    return
  }

  const fileKeys = new Set(
    images.map(({ file }) => `${file.name}-${file.size}-${file.lastModified}`)
  )
  const uploadedImages = files
    .filter((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`
      if (fileKeys.has(key)) return false
      fileKeys.add(key)
      return true
    })
    .map((file) => ({ file }))

  setImages((current) => [...current, ...uploadedImages])
  uploadedImages.forEach((image) => {
    const reader = new FileReader()
    reader.onload = () =>
      setImages((current) =>
        current.map((currentImage) =>
          currentImage === image
            ? { ...image, dataUrl: reader.result as string }
            : currentImage
        )
      )
    reader.readAsDataURL(image.file)
  })
}

export function FileUpload({
  images,
  setImages,
}: {
  images: UploadedImage[]
  setImages: Dispatch<SetStateAction<UploadedImage[]>>
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        multiple
        onChange={(event) => {
          addImageFiles(
            Array.from(event.currentTarget.files ?? []),
            images,
            setImages
          )
          event.currentTarget.value = ""
        }}
        ref={inputRef}
        type="file"
      />
      <Button
        onClick={() => inputRef.current?.click()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <PaperclipIcon />
      </Button>
    </>
  )
}
