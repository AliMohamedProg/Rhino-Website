"use client";

import { useState } from "react";
import Image from "next/image";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Star, MoreHorizontal, Check, X, Eye, Flag, Trash2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ApiClient } from "@/app/ApiHelper/ApiClient";



export default function ReviewsPage() {
  const { t, isRTL } = useAdminLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.get("api/admin/reviews/get-reviews");
      setReviewsList(data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!confirm(isRTL
      ? "هل أنت متأكد من حذف هذه المراجعة؟"
      : "Are you sure you want to delete this review?"
    )) return;

    try {
      await ApiClient.post(
        "api/admin/reviews/delete-review",
        id
      );

      setReviewsList(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error("Failed to delete review:", err);
      alert(isRTL ? "فشل حذف المراجعة" : "Failed to delete review");
    }
  };

  const filteredReviews = reviewsList.filter((review) => {
    const customerName = review.customer?.name || review.userName || review.customerName || "";
    const productName = review.product?.name || review.productName || "";
    const reviewContent = review.review || review.text || review.comment || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reviewContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || review.rating === Number(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });


  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{isRTL ? "المراجعات" : "Reviews"}</h1>
        <p className="text-muted-foreground">
          {isRTL ? "إدارة ومراقبة مراجعات العملاء" : "Manage and monitor customer reviews"}
        </p>
      </div>



      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={isRTL ? "البحث في المراجعات..." : "Search reviews..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={isRTL ? "التقييم" : "Rating"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "كل التقييمات" : "All Ratings"}</SelectItem>
                <SelectItem value="5">5 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                <SelectItem value="4">4 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                <SelectItem value="3">3 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                <SelectItem value="2">2 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                <SelectItem value="1">1 {isRTL ? "نجمة" : "Star"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            {isRTL ? "لا توجد مراجعات" : "No reviews found"}
          </p>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{(review.customer?.email || review.email || review.userEmail || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">
                          {review.customer?.email || review.email || review.userEmail || (isRTL ? "مستخدم" : "User")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {renderStars(review.rating)}
                        <span>• {review.createdDate}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteReview(review.id)}>
                        <Trash2 className="h-4 w-4 me-2" />
                        {isRTL ? "حذف" : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={review.product?.image || review.productImage || "/placeholder.svg"}
                      alt={review.product?.name || review.productName || "Product"}
                      width={48}
                      height={48}
                      sizes="48px"
                      className="h-12 w-12 rounded object-cover"
                    />
                    <span className="text-sm font-medium">
                      {isRTL
                        ? (review.product?.nameAr || review.productNameAr || review.product?.name || review.productName || "منتج")
                        : (review.product?.nameEn || review.productNameEn || review.product?.name || review.productName || "Product")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{review.review}</p>

                </div>


              </CardContent>
            </Card>
          )))}
      </div>
    </div>
  );
}
