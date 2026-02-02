"use client"

import React, { useRef, useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  textEn: string
  textAr: string
}

interface Props {
  initialReviews: Review[]
}

export default function ReviewsCarousel({ initialReviews }: Props) {
  const { language, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const scroll = (delta: number) => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ left: delta, behavior: "smooth" })
  }

  const scrollToNext = () => {
    const el = containerRef.current
    if (!el) return
    const item = el.firstElementChild as HTMLElement | null
    if (!item) return
    const gap = parseInt(getComputedStyle(el).gap || "0", 10) || 0
    const delta = (item.offsetWidth + gap) * (isRTL ? -1 : 1)
    el.scrollBy({ left: delta, behavior: "smooth" })
  }

  const scrollToPrev = () => {
    const el = containerRef.current
    if (!el) return
    const item = el.firstElementChild as HTMLElement | null
    if (!item) return
    const gap = parseInt(getComputedStyle(el).gap || "0", 10) || 0
    const delta = (item.offsetWidth + gap) * (isRTL ? 1 : -1)
    el.scrollBy({ left: delta, behavior: "smooth" })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") scrollToNext()
    if (e.key === "ArrowLeft") scrollToPrev()
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault()
    const newReview: Review = {
      id: Date.now(),
      author: name || (language === "ar" ? "مستخدم" : "User"),
      rating,
      date: new Date().toISOString().split("T")[0],
      textEn: comment,
      textAr: comment,
    }
    setReviews([newReview, ...reviews])
    setName("")
    setRating(5)
    setComment("")
    setShowForm(false)
  }

  const averageRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
    const stars = Array.from({ length: 5 }).map((_, i) => {
      const index = i + 1
      const diff = Math.max(0, Math.min(1, rating - (index - 1)))
      const percent = Math.round(diff * 100)
      return (
        <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
          <Star size={size} className="text-muted-foreground" />
          {percent > 0 && (
            <span
              className="absolute left-0 top-0 overflow-hidden"
              style={{ width: `${percent}%`, height: size }}
              aria-hidden
            >
              <Star size={size} className="fill-yellow-400 text-yellow-400" />
            </span>
          )}
        </span>
      )
    })

    return <span className="flex items-center gap-1">{stars}</span>
  }

  return (
    <div className="space-y-4">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <StarRating rating={averageRating} size={16} />
          </div>
          <div className="text-sm text-muted-foreground">{reviews.length} {language === "ar" ? "تقييم" : "reviews"}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={scrollToPrev} aria-label={language === "ar" ? "السابق" : "Previous"}>
            <ChevronLeft size={16} />
          </Button>
          <Button size="sm" variant="outline" onClick={scrollToNext} aria-label={language === "ar" ? "التالي" : "Next"}>
            <ChevronRight size={16} />
          </Button>
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>{language === "ar" ? "أضف مراجعة" : "Add Review"}</Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddReview} className="border border-border rounded-lg p-4 space-y-3">
          <div className={cn("grid gap-2 md:grid-cols-3", isRTL && "text-right")}>
            <Input placeholder={language === "ar" ? "الاسم" : "Name"} value={name} onChange={(e) => setName(e.target.value)} />
            <select className="p-2 border border-border rounded dark:text-black" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={4.5}>4.5</option>
              <option value={4}>4</option>
              <option value={3.5}>3.5</option>
              <option value={3}>3</option>
              <option value={2.5}>2.5</option>
              <option value={2}>2</option>
              <option value={1.5}>1.5</option>
              <option value={1}>1</option>
              <option value={0.5}>0.5</option>
            </select>
            <div />
          </div>
          <Textarea placeholder={language === "ar" ? "اكتب تعليقك" : "Write your review"} value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit">{language === "ar" ? "إرسال" : "Submit"}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
          </div>
        </form>
      )}

      <div className="relative">
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex gap-4 pb-2"
          style={{ overflowX: "hidden", touchAction: "none" }}>
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="min-w-[280px] flex-shrink-0 border border-border rounded-lg p-4 bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{rev.author}</div>
                    <div className="flex items-center gap-0">
                      <StarRating rating={rev.rating} size={14} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{rev.date}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{language === "ar" ? rev.textAr : rev.textEn}</p>
            </article>
          ))}
        </div>
        {/* Side arrows for larger screens (also works on mobile) */}
        <div className="pointer-events-none">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto">
            <Button size="sm" variant="ghost" onClick={scrollToPrev} aria-label={language === "ar" ? "السابق" : "Previous"}>
              <ChevronLeft size={18} />
            </Button>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto">
            <Button size="sm" variant="ghost" onClick={scrollToNext} aria-label={language === "ar" ? "التالي" : "Next"}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
