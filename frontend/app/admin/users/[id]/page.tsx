"use client";

import { useParams } from "next/navigation";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Mail, Phone, MapPin, Calendar, 
  ShoppingBag, Heart, Star, Ban, CheckCircle 
} from "lucide-react";
import { adminUsers } from "@/lib/admin-data";

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { t, isRTL } = useAdminLanguage();
  
  const user = adminUsers.find(u => u.id === id) || adminUsers[0];

  const userOrders = [
    { id: "ORD-001", date: "2024-12-01", items: 3, total: 2500, status: "delivered" },
    { id: "ORD-002", date: "2024-11-15", items: 2, total: 1800, status: "delivered" },
    { id: "ORD-003", date: "2024-10-28", items: 1, total: 950, status: "delivered" },
  ];

  const userWishlist = [
    { id: "1", name: "Modern L-Shaped Sofa", price: 2999 },
    { id: "2", name: "Executive Office Desk", price: 1499 },
    { id: "3", name: "Luxury Bedroom Set", price: 4500 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{isRTL ? "نشط" : "Active"}</Badge>;
      case "inactive":
        return <Badge variant="secondary">{isRTL ? "غير نشط" : "Inactive"}</Badge>;
      case "banned":
        return <Badge variant="destructive">{isRTL ? "محظور" : "Banned"}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isRTL ? "تفاصيل المستخدم" : "User Details"}</h1>
          <p className="text-muted-foreground">{user.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <div className="mt-1">{getStatusBadge(user.status)}</div>
              <p className="mt-2 text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || "+966 50 XXX XXXX"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.location || "Riyadh, Saudi Arabia"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{isRTL ? `انضم: ${user.joinDate}` : `Joined: ${user.joinDate}`}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {user.status === "banned" ? (
                <Button className="flex-1 bg-transparent" variant="outline">
                  <CheckCircle className="h-4 w-4 me-2" />
                  {isRTL ? "إلغاء الحظر" : "Unban User"}
                </Button>
              ) : (
                <Button className="flex-1" variant="destructive">
                  <Ban className="h-4 w-4 me-2" />
                  {isRTL ? "حظر المستخدم" : "Ban User"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{user.orders}</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? "الطلبات" : "Orders"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? "المفضلة" : "Wishlist"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? "المراجعات" : "Reviews"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{isRTL ? "إجمالي الإنفاق" : "Total Spent"}</p>
                <p className="text-2xl font-bold">SAR {user.totalSpent.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <Tabs defaultValue="orders">
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="orders">{isRTL ? "الطلبات" : "Orders"}</TabsTrigger>
                  <TabsTrigger value="wishlist">{isRTL ? "المفضلة" : "Wishlist"}</TabsTrigger>
                  <TabsTrigger value="addresses">{isRTL ? "العناوين" : "Addresses"}</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="orders" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isRTL ? "رقم الطلب" : "Order ID"}</TableHead>
                        <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
                        <TableHead>{isRTL ? "المنتجات" : "Items"}</TableHead>
                        <TableHead>{isRTL ? "المجموع" : "Total"}</TableHead>
                        <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>SAR {order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              {isRTL ? "تم التوصيل" : "Delivered"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="wishlist" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isRTL ? "المنتج" : "Product"}</TableHead>
                        <TableHead>{isRTL ? "السعر" : "Price"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userWishlist.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>SAR {item.price.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="addresses" className="mt-0">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{isRTL ? "العنوان الرئيسي" : "Primary Address"}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              123 Main Street, Al Olaya District<br />
                              Riyadh, 12345<br />
                              Saudi Arabia
                            </p>
                          </div>
                          <Badge>{isRTL ? "افتراضي" : "Default"}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="font-medium">{isRTL ? "عنوان العمل" : "Work Address"}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            456 Business Tower, King Fahd Road<br />
                            Riyadh, 12346<br />
                            Saudi Arabia
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
