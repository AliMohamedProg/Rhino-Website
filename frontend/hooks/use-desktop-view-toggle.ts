"use client"

import { useEffect, useState } from "react"

const DESKTOP_VIEW_WIDTH = 1200
const STORAGE_KEY = "rhino-desktop-view"

export function useDesktopViewToggle() {
  const [isDesktopView, setIsDesktopView] = useState(false)

  useEffect(() => {
    // Priority:
    // 1) Explicit user preference (localStorage)
    // 2) Auto-enable when a mobile device requests "desktop site"
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "true") {
      setIsDesktopView(true)
      setDesktopViewport()
    } else if (saved === "false") {
      setIsDesktopView(false)
      resetViewport()
    } else if (shouldAutoEnableDesktopViewport()) {
      setIsDesktopView(true)
      setDesktopViewport()
    }

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newValue = e.newValue === "true"
        setIsDesktopView(newValue)
        if (newValue) {
          setDesktopViewport()
        } else {
          resetViewport()
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    if (!isDesktopView) return

    // Keep the "desktop" viewport scale correct on rotate/resize.
    const handleResize = () => setDesktopViewport()
    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("orientationchange", handleResize, { passive: true })
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [isDesktopView])

  const enableDesktopView = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setIsDesktopView(true)
    setDesktopViewport()
  }

  const disableDesktopView = () => {
    localStorage.setItem(STORAGE_KEY, "false")
    setIsDesktopView(false)
    resetViewport()
  }

  const toggleDesktopView = () => {
    if (isDesktopView) {
      disableDesktopView()
    } else {
      enableDesktopView()
    }
  }

  return {
    isDesktopView,
    enableDesktopView,
    disableDesktopView,
    toggleDesktopView,
  }
}

function setDesktopViewport() {
  const meta = document.querySelector('meta[name="viewport"]')
  if (meta) {
    const scale = getDesktopViewportScale()
    meta.setAttribute(
      "content",
      `width=${DESKTOP_VIEW_WIDTH}, initial-scale=${scale}, viewport-fit=cover`
    )
  }
}

function resetViewport() {
  const meta = document.querySelector('meta[name="viewport"]')
  if (meta) {
    meta.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover")
  }
}

function getDesktopViewportScale(): string {
  if (typeof window === "undefined") return "1"
  const screenWidth = window.innerWidth || 0
  if (!screenWidth) return "1"

  // Fit the full desktop layout into the available phone width.
  // Clamped so we don't accidentally zoom in too much on larger devices.
  const raw = screenWidth / DESKTOP_VIEW_WIDTH
  const clamped = Math.min(1, Math.max(0.25, raw))
  return clamped.toFixed(3)
}

function shouldAutoEnableDesktopViewport(): boolean {
  if (typeof window === "undefined") return false

  // We only want this on touch devices.
  const isTouchDevice =
    navigator.maxTouchPoints > 0 ||
    ("ontouchstart" in window) ||
    window.matchMedia?.("(pointer: coarse)").matches === true

  if (!isTouchDevice) return false

  // Heuristic: when a mobile browser requests "desktop site", it often sends a desktop UA
  // even though the device is touch-capable (e.g. iPadOS Safari reports "Macintosh").
  const ua = navigator.userAgent || ""
  const looksLikeDesktopUA =
    /\b(Macintosh|Windows NT|X11; Linux x86_64)\b/i.test(ua)

  // If the UA already looks mobile, the user likely isn't requesting desktop site.
  const looksLikeMobileUA =
    /\b(Android|iPhone|iPad|iPod)\b/i.test(ua)

  // If it looks like desktop UA on a touch device, assume "Request Desktop Site".
  if (looksLikeDesktopUA && !looksLikeMobileUA) return true

  // Extra fallback: some browsers keep mobile tokens but still request desktop.
  // If the visual viewport is small but the UA indicates "Mobile" is absent,
  // we can still allow desktop viewport for better parity.
  const hasMobileToken = /\bMobile\b/i.test(ua)
  if (!hasMobileToken && looksLikeDesktopUA) return true

  return false
}
