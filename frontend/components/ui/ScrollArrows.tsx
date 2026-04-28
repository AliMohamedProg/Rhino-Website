"use client"

import { useRef, useState, useEffect, useCallback, type RefObject } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface ScrollArrowsProps {
  scrollRef: RefObject<HTMLDivElement | null>
  /** Pixels to scroll per click – defaults to 340 */
  scrollAmount?: number
  /** Extra Tailwind classes on the wrapper */
  className?: string
}

/**
 * Premium left / right scroll-indicator arrows.
 * Arrows auto-hide when the user reaches the start / end of the container.
 */
export function ScrollArrows({
  scrollRef,
  scrollAmount = 340,
  className = "",
}: ScrollArrowsProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const { dir } = useLanguage()

  /* ── visibility check ─────────────────────────────── */
  const check = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    
    if (dir === "rtl") {
      // In RTL, scrollLeft is 0 at the rightmost and decreases as you scroll left
      const absoluteScrollLeft = Math.abs(scrollLeft)
      // canScrollRight means we can scroll towards the "right" direction of the container (which is the beginning in RTL)
      setCanScrollRight(absoluteScrollLeft > 2)
      // canScrollLeft means we can scroll towards the "left" direction of the container (which is the end in RTL)
      setCanScrollLeft(absoluteScrollLeft + clientWidth < scrollWidth - 2)
    } else {
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
    }
  }, [scrollRef, dir])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    check()
    el.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    // Observe child changes (dynamic content)
    const observer = new MutationObserver(check)
    observer.observe(el, { childList: true, subtree: true })
    return () => {
      el.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
      observer.disconnect()
    }
  }, [check, scrollRef])

  /* ── scroll handler ───────────────────────────────── */
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    
    const multiplier = direction === "left" ? -1 : 1
    // In RTL, to scroll "left", we actually need to increase the absolute scrollLeft
    const finalAmount = dir === "rtl" ? -multiplier * scrollAmount : multiplier * scrollAmount

    scrollRef.current.scrollBy({
      left: finalAmount,
      behavior: "smooth",
    })
  }

  /* ── shared button styles ─────────────────────────── */
  const btnBase =
    "absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center " +
    "w-11 h-11 rounded-full " +
    "bg-white/80 backdrop-blur-md border border-sand/60 " +
    "text-mahogany shadow-[0_4px_20px_rgba(123,63,50,0.12)] " +
    "transition-all duration-300 " +
    "hover:bg-white hover:shadow-[0_6px_28px_rgba(123,63,50,0.22)] hover:scale-105 " +
    "active:scale-95 " +
    "cursor-pointer"

  const hidden = "opacity-0 pointer-events-none"
  const visible = "opacity-100"

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Left arrow */}
      <button
        aria-label="Scroll left"
        type="button"
        onClick={() => scroll("left")}
        className={`${btnBase} left-2 md:-left-5 pointer-events-auto ${canScrollLeft ? visible : hidden}`}
      >
        {dir === "rtl" ? <ChevronRight className="w-5 h-5" strokeWidth={2.2} /> : <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />}
      </button>

      {/* Right arrow */}
      <button
        aria-label="Scroll right"
        type="button"
        onClick={() => scroll("right")}
        className={`${btnBase} right-2 md:-right-5 pointer-events-auto ${canScrollRight ? visible : hidden}`}
      >
        {dir === "rtl" ? <ChevronLeft className="w-5 h-5" strokeWidth={2.2} /> : <ChevronRight className="w-5 h-5" strokeWidth={2.2} />}
      </button>
    </div>
  )
}

/**
 * Hook that returns a ref + the component – handy one-liner usage:
 *   const { ref, Arrows } = useScrollArrows()
 */
export function useScrollArrows(scrollAmount = 340) {
  const ref = useRef<HTMLDivElement>(null)
  const Arrows = useCallback(
    () => <ScrollArrows scrollRef={ref} scrollAmount={scrollAmount} />,
    [ref, scrollAmount],
  )
  return { ref, Arrows }
}
