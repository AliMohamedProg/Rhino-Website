"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Star, MoreHorizontal, Trash2, Loader2 } from "lucide-react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [reviewsList, setReviewsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await ApiClient.get("api/admin/reviews/get-reviews")
      setReviewsList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch reviews:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    try {
      await ApiClient.post("api/admin/reviews/delete-review", id)
      setReviewsList(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error("Failed to delete review:", err)
      alert("Failed to delete review")
    }
  }

  const filteredReviews = reviewsList.filter((review) => {
    const customerName = review.customer?.name || review.userName || review.customerName || ""
    const productName = review.product?.name || review.productName || ""
    const reviewContent = review.review || review.text || review.comment || ""
    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reviewContent.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = ratingFilter === "all" || review.rating === Number(ratingFilter)
    return matchesSearch && matchesRating
  })

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-[#A6ACA2]/40"}`} />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />
        
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Reviews</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage and monitor customer reviews</p>
        </div>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b7d73]" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 border-[#7B3F32]/20 bg-white/50 focus-visible:ring-[#7B3F32]/20 rounded-xl h-11"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[150px] border-[#7B3F32]/20 bg-white/50 rounded-xl focus:ring-[#7B3F32]/20 h-11">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#7B3F32]/10 shadow-xl">
                <SelectItem value="all" className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">All Ratings</SelectItem>
                <SelectItem value="5" className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">5 Stars</SelectItem>
                <SelectItem value="4" className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">4 Stars</SelectItem>
                <SelectItem value="3" className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">3 Stars</SelectItem>
                <SelectItem value="2" className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">2 Stars</SelectItem>
                <SelectItem value="1" className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#7B3F32]" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No reviews found</p>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-sm shadow-sm rounded-3xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{(review.customer?.email || review.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm text-slate-900">
                          {review.customer?.email || review.email || "User"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {renderStars(review.rating)}
                        <span>• {review.createdDate}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-[#A6ACA2]/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl shadow-[#7B3F32]/10 border-[#7B3F32]/10">
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-lg cursor-pointer font-medium" onClick={() => handleDeleteReview(review.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={review.product?.image || review.productImage || "/placeholder.svg"}
                      alt={review.product?.nameEn || review.productName || "Product"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <span className="text-sm font-medium text-slate-900">
                      {review.product?.nameEn || review.productNameEn || review.product?.name || review.productName || "Product"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{review.review}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}