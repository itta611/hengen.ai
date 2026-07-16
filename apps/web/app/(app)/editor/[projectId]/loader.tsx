"use client"

import Rive from "@rive-app/react-canvas"
import { useEffect, useState } from "react"

import Beams from "@/components/Beams"
import Grainient from "@/components/Grainient"
import Silk from "@/components/Silk"

const generationCountdownSeconds = 4 * 60
const imageImportCountdownSeconds = 2 * 60

function getRemainingSeconds(
  countdownSeconds: number,
  createdAt: string | null,
  now: number
) {
  if (!createdAt) {
    return countdownSeconds
  }

  const createdTime = new Date(createdAt).getTime()

  if (Number.isNaN(createdTime)) {
    return countdownSeconds
  }

  const elapsedSeconds = Math.floor((now - createdTime) / 1000)

  return Math.max(0, countdownSeconds - elapsedSeconds)
}

function formatRemainingTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function LoadingPattern({ projectId }: { projectId: string }) {
  const patternIndex =
    Array.from(projectId).reduce(
      (hash, character) => hash + character.charCodeAt(0),
      0
    ) % 3

  if (patternIndex === 0) {
    return (
      <Beams
        beamHeight={18}
        beamNumber={10}
        beamWidth={2.2}
        lightColor="#A5B4FC"
        noiseIntensity={1.5}
        rotation={25}
        scale={0.18}
        speed={1.4}
      />
    )
  }

  if (patternIndex === 1) {
    return (
      <Silk
        color="#5B56A6"
        noiseIntensity={1.2}
        rotation={0.2}
        scale={1.1}
        speed={4}
      />
    )
  }

  return (
    <Grainient
      color1="#A5B4FC"
      color2="#6366F1"
      color3="#1E1B4B"
      contrast={1.2}
      grainAmount={0.08}
      timeSpeed={0.18}
      warpFrequency={4.5}
      warpSpeed={1.2}
      warpStrength={1.2}
    />
  )
}

export function EditorLoader({
  createdAt,
  projectId,
  prompt,
}: {
  createdAt: string | null
  projectId: string
  prompt: string | null
}) {
  const [now, setNow] = useState(() => Date.now())
  const countdownSeconds =
    prompt?.trim().length === 0
      ? imageImportCountdownSeconds
      : generationCountdownSeconds
  const remainingSeconds = getRemainingSeconds(countdownSeconds, createdAt, now)
  const remainingTime = formatRemainingTime(remainingSeconds)
  const loadingMessage =
    remainingSeconds === 0 ? "お待たせしています..." : "画像を生成しています"

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="flex overflow-hidden bg-background dark:bg-muted h-full w-full rounded-2xl justify-center">
      <div className="flex h-full w-full flex-col items-center justify-center md:w-1/2">
        <div className="flex items-center justify-center gap-4">
          <Rive className="size-10 dark:invert" src="/loading.riv" />
          <div className="font-bold text-5xl leading-none tabular-nums tracking-tight">
            {remainingTime}
          </div>
        </div>
        <div className="text-center text-base text-muted-foreground mt-4">
          {loadingMessage}
        </div>
      </div>
      <div className="hidden h-full w-1/2 overflow-hidden md:block">
        <LoadingPattern projectId={projectId} />
      </div>
    </div>
  )
}
