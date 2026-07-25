import { unstable_cache } from "next/cache"

type GoogleFontsMetadata = {
  familyMetadataList?: { family?: string }[]
}

const getGoogleFonts = unstable_cache(
  async () => {
    const response = await fetch("https://fonts.google.com/metadata/fonts")

    if (!response.ok) {
      throw new Error("google_fonts_unavailable")
    }

    const metadata = (await response.json()) as GoogleFontsMetadata

    return (metadata.familyMetadataList ?? []).flatMap(({ family }) =>
      family ? [family] : []
    )
  },
  ["google-fonts"],
  { revalidate: 86_400 }
)

export async function GET() {
  return Response.json({ fonts: await getGoogleFonts() })
}
