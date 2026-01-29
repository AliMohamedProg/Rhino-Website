"use client";

import { useState } from "react";
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
import { Search, Star, MoreHorizontal, Check, X, Eye, Flag, Trash2 } from "lucide-react";

const reviews = [
  {
    id: "REV001",
    customer: { name: "Ahmed Hassan", avatar: "/placeholder-user.jpg", email: "ahmed@example.com" },
    product: { name: "Modern L-Shaped Sofa", image: "/l-shaped-sofa-living-room.jpg" },
    rating: 5,
    title: "Excellent quality!",
    content: "The sofa exceeded my expectations. Very comfortable and looks exactly like the pictures. Delivery was on time.",
    date: "2024-12-01",
    status: "approved",
    helpful: 12,
  },
  {
    id: "REV002",
    customer: { name: "Sara Ali", avatar: "/placeholder-user.jpg", email: "sara@example.com" },
    product: { name: "Kids Bedroom Set", image: "/kids-bedroom-furniture.jpg" },
    rating: 4,
    title: "Good but could be better",
    content: "Nice furniture set for my daughter's room. Assembly instructions could be clearer. Otherwise happy with the purchase.",
    date: "2024-11-28",
    status: "pending",
    helpful: 5,
  },
  {
    id: "REV003",
    customer: { name: "Mohammed Omar", avatar: "/placeholder-user.jpg", email: "mohammed@example.com" },
    product: { name: "Executive Office Desk", image: "/office-desk-with-drawers.jpg" },
    rating: 3,
    title: "Average quality",
    content: "The desk is okay but not as sturdy as I expected for the price. The drawers are a bit flimsy.",
    date: "2024-11-25",
    status: "approved",
    helpful: 8,
  },
  {
    id: "REV004",
    customer: { name: "Fatima Khalid", avatar: "/placeholder-user.jpg", email: "fatima@example.com" },
    product: { name: "Modern Bedroom Set", image: "/modern-bedroom-set.png" },
    rating: 5,
    title: "Beautiful furniture!",
    content: "Absolutely love this bedroom set. The quality is outstanding and it transformed my room completely.",
    date: "2024-11-22",
    status: "approved",
    helpful: 20,
  },
  {
    id: "REV005",
    customer: { name: "Youssef Ahmed", avatar: "/placeholder-user.jpg", email: "youssef@example.com" },
    product: { name: "Corner Sofa Set", image: "/modern-corner-sofa-detail.jpg" },
    rating: 2,
    title: "Disappointed",
    content: "Color was different from pictures. Support was helpful though and offered partial refund.",
    date: "2024-11-20",
    status: "flagged",
    helpful: 3,
  },
];

const reviewStats = {
  total: 1250,
  averageRating: 4.3,
  pending: 15,
  approved: 1200,
  flagged: 35,
};

export default function ReviewsPage() {
  const { t, isRTL } = useAdminLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || review.rating === Number(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{isRTL ? "موافق عليه" : "Approved"}</Badge>;
      case "pending":
        return <Badge variant="secondary">{isRTL ? "قيد الانتظار" : "Pending"}</Badge>;
      case "flagged":
        return <Badge variant="destructive">{isRTL ? "مُبلغ عنه" : "Flagged"}</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "إجمالي المراجعات" : "Total Reviews"}</p>
            <p className="text-2xl font-bold">{reviewStats.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "متوسط التقييم" : "Avg Rating"}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{reviewStats.averageRating}</p>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "قيد الانتظار" : "Pending"}</p>
            <p className="text-2xl font-bold text-yellow-600">{reviewStats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "موافق عليها" : "Approved"}</p>
            <p className="text-2xl font-bold text-green-600">{reviewStats.approved.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "مُبلغ عنها" : "Flagged"}</p>
            <p className="text-2xl font-bold text-red-600">{reviewStats.flagged}</p>
          </CardContent>
        </Card>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "الكل" : "All Status"}</SelectItem>
                <SelectItem value="pending">{isRTL ? "قيد الانتظار" : "Pending"}</SelectItem>
                <SelectItem value="approved">{isRTL ? "موافق عليه" : "Approved"}</SelectItem>
                <SelectItem value="flagged">{isRTL ? "مُبلغ عنه" : "Flagged"}</SelectItem>
              </SelectContent>
            </Select>
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
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.customer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{review.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{review.customer.name}</span>
                      {getStatusBadge(review.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.customer.email}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">• {review.date}</span>
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
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 me-2" />
                      {isRTL ? "عرض المنتج" : "View Product"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Check className="h-4 w-4 me-2" />
                      {isRTL ? "موافقة" : "Approve"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 me-2" />
                      {isRTL ? "إبلاغ" : "Flag"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 me-2" />
                      {isRTL ? "حذف" : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={review.product.image || "/placeholder.svg"} 
                    alt={review.product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <span className="text-sm font-medium">{review.product.name}</span>
                </div>
                <p className="font-medium">{review.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{review.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {review.helpful} {isRTL ? "شخص وجد هذا مفيداً" : "people found this helpful"}
                </p>
              </div>

              {review.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="gap-1">
                    <Check className="h-4 w-4" />
                    {isRTL ? "موافقة" : "Approve"}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    <X className="h-4 w-4" />
                    {isRTL ? "رفض" : "Reject"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
