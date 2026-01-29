"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { products, categories, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Filter,
  Eye,
  Star,
  Truck,
} from "lucide-react"

// Map URL slugs to actual category IDs
const categoryMapping: Record<string, string[]> = {
  furniture: ["bedroom", "living", "dining"],
  decor: ["living", "outdoor"],
  kitchen: ["dining"],
  appliances: ["office"],
  electronics: ["office"],
  sports: ["outdoor"],
  gifts: ["bedroom", "living"],
  bedroom: ["bedroom"],
  living: ["living"],
  dining: ["dining"],
  office: ["office"],
  outdoor: ["outdoor"],
}

const categoryNames: Record<string, { en: string; ar: string }> = {
  furniture: { en: "Furniture", ar: "الأثاث" },
  decor: { en: "Home Décor", ar: "ديكورات منزلية" },
  kitchen: { en: "Kitchen & Bath", ar: "المطبخ والحمام" },
  appliances: { en: "Appliances", ar: "الأجهزة المنزلية" },
  electronics: { en: "Electronics", ar: "الإلكترونيات" },
  sports: { en: "Sports", ar: "الأدوات الرياضية" },
  gifts: { en: "Gifts", ar: "الهدايا" },
  bedroom: { en: "Bedroom", ar: "غرف النوم" },
  living: { en: "Living Room", ar: "غرف المعيشة" },
  dining: { en: "Dining Room", ar: "غرف الطعام" },
  office: { en: "Office", ar: "المكتب" },
  outdoor: { en: "Outdoor", ar: "الأثاث الخارجي" },
}

const brands = [
  { id: "brand1", name: { en: "Wood Craft", ar: "وود كرافت" } },
  { id: "brand2", name: { en: "Home Elite", ar: "هوم إليت" } },
  { id: "brand3", name: { en: "Modern Living", ar: "مودرن ليفينج" } },
  { id: "brand4", name: { en: "Comfort Plus", ar: "كومفورت بلس" } },
]

const materials = [
  { id: "wood", name: { en: "Wood", ar: "خشب" } },
  { id: "metal", name: { en: "Metal", ar: "معدن" } },
  { id: "fabric", name: { en: "Fabric", ar: "قماش" } },
  { id: "leather", name: { en: "Leather", ar: "جلد" } },
]

const colors = [
  { id: "white", name: { en: "White", ar: "أبيض" }, hex: "#ffffff" },
  { id: "black", name: { en: "Black", ar: "أسود" }, hex: "#000000" },
  { id: "gray", name: { en: "Gray", ar: "رمادي" }, hex: "#808080" },
  { id: "brown", name: { en: "Brown", ar: "بني" }, hex: "#8B4513" },
  { id: "beige", name: { en: "Beige", ar: "بيج" }, hex: "#F5F5DC" },
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { language, t, dir } = useLanguage()
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()

  // Filter states
  const [hideOutOfStock, setHideOutOfStock] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("50000")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [showMoreCategories, setShowMoreCategories] = useState(false)

  // Collapsible states
  const [availabilityOpen, setAvailabilityOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [brandOpen, setBrandOpen] = useState(false)
  const [materialOpen, setMaterialOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)

  const matchingCategories = categoryMapping[slug] || [slug]
  const categoryName = categoryNames[slug] || { en: slug, ar: slug }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => matchingCategories.includes(product.category))

    // Hide out of stock
    if (hideOutOfStock) {
      result = result.filter((p) => p.inStock)
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category))
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    return result
  }, [matchingCategories, hideOutOfStock, priceRange, selectedCategories, sortBy])

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    setMinPrice(value[0].toString())
    setMaxPrice(value[1].toString())
  }

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value)
    const num = Number.parseInt(value) || 0
    setPriceRange([num, priceRange[1]])
  }

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value)
    const num = Number.parseInt(value) || 50000
    setPriceRange([priceRange[0], num])
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
  }

  const resetFilters = () => {
    setHideOutOfStock(false)
    setPriceRange([0, 50000])
    setMinPrice("0")
    setMaxPrice("50000")
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedMaterials([])
    setSelectedColors([])
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const handleWishlistToggle = (product: (typeof products)[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      })
    }
  }

  const displayedCategories = showMoreCategories ? categories : categories.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-secondary transition-colors">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            {dir === "rtl" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            <span className="text-foreground">{categoryName[language]}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-card rounded-lg border border-border p-4 sticky top-4">
                {/* Filter Header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <Filter size={20} className="text-primary" />
                  <span className="font-semibold text-foreground">{language === "ar" ? "تصفية" : "Filter"}</span>
                </div>

                {/* Availability */}
                <Collapsible open={availabilityOpen} onOpenChange={setAvailabilityOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                    <span className="font-medium text-foreground">{language === "ar" ? "التوفر" : "Availability"}</span>
                    {availabilityOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={hideOutOfStock}
                        onCheckedChange={(checked) => setHideOutOfStock(checked as boolean)}
                      />
                      <span className="text-sm text-foreground">
                        {language === "ar" ? "إخفاء غير المتوفر" : "Hide Out Of Stock"}
                      </span>
                    </label>
                  </CollapsibleContent>
                </Collapsible>

                {/* Price */}
                <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                    <span className="font-medium text-foreground">{language === "ar" ? "السعر" : "Price"}</span>
                    {priceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-3 space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={50000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">
                          {language === "ar" ? "من" : "From"}
                        </label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={minPrice}
                            onChange={(e) => handleMinPriceChange(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">{language === "ar" ? "ج.م" : "EGP"}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">
                          {language === "ar" ? "إلى" : "To"}
                        </label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => handleMaxPriceChange(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">{language === "ar" ? "ج.م" : "EGP"}</span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Category */}
                <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                    <span className="font-medium text-foreground">{language === "ar" ? "الفئة" : "Category"}</span>
                    {categoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-3 space-y-2">
                    {displayedCategories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedCategories.includes(cat.id)}
                          onCheckedChange={() => handleCategoryToggle(cat.id)}
                        />
                        <span className="text-sm text-foreground">{cat.name[language]}</span>
                      </label>
                    ))}
                    {categories.length > 5 && (
                      <button
                        onClick={() => setShowMoreCategories(!showMoreCategories)}
                        className="text-sm text-secondary hover:underline mt-2"
                      >
                        {showMoreCategories
                          ? language === "ar"
                            ? "عرض أقل"
                            : "Show less"
                          : language === "ar"
                            ? `عرض ${categories.length - 5} المزيد`
                            : `Show ${categories.length - 5} more`}
                      </button>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Brand */}
                <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                    <span className="font-medium text-foreground">{language === "ar" ? "الماركة" : "Item Brand"}</span>
                    {brandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-3 space-y-2">
                    {brands.map((brand) => (
                      <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() =>
                            setSelectedBrands((prev) =>
                              prev.includes(brand.id) ? prev.filter((b) => b !== brand.id) : [...prev, brand.id],
                            )
                          }
                        />
                        <span className="text-sm text-foreground">{brand.name[language]}</span>
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Material */}
                <Collapsible open={materialOpen} onOpenChange={setMaterialOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                    <span className="font-medium text-foreground">{language === "ar" ? "الخامة" : "Material"}</span>
                    {materialOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-3 space-y-2">
                    {materials.map((material) => (
                      <label key={material.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedMaterials.includes(material.id)}
                          onCheckedChange={() =>
                            setSelectedMaterials((prev) =>
                              prev.includes(material.id)
                                ? prev.filter((m) => m !== material.id)
                                : [...prev, material.id],
                            )
                          }
                        />
                        <span className="text-sm text-foreground">{material.name[language]}</span>
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Color */}
                <Collapsible open={colorOpen} onOpenChange={setColorOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                    <span className="font-medium text-foreground">{language === "ar" ? "اللون" : "Color"}</span>
                    {colorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-3 space-y-2">
                    {colors.map((color) => (
                      <label key={color.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedColors.includes(color.id)}
                          onCheckedChange={() =>
                            setSelectedColors((prev) =>
                              prev.includes(color.id) ? prev.filter((c) => c !== color.id) : [...prev, color.id],
                            )
                          }
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm text-foreground">{color.name[language]}</span>
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Filter Actions */}
                <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                  <Button variant="outline" onClick={resetFilters} className="flex-1 bg-transparent">
                    {language === "ar" ? "إعادة تعيين" : "Reset"}
                  </Button>
                  <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    {language === "ar"
                      ? `عرض ${filteredProducts.length} نتيجة`
                      : `Show ${filteredProducts.length} Results`}
                  </Button>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">{categoryName[language]}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{language === "ar" ? "ترتيب حسب:" : "Sort by:"}</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">{language === "ar" ? "الأكثر شهرة" : "Featured"}</SelectItem>
                      <SelectItem value="price-low">
                        {language === "ar" ? "السعر: من الأقل" : "Price: Low to High"}
                      </SelectItem>
                      <SelectItem value="price-high">
                        {language === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}
                      </SelectItem>
                      <SelectItem value="rating">{language === "ar" ? "التقييم" : "Rating"}</SelectItem>
                      <SelectItem value="newest">{language === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="relative">
                        <Link href={`/product/${product.id}`}>
                          <div className="relative h-56">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name[language]}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        {/* Free Shipping Badge */}
                        <div className="absolute top-2 start-2">
                          <div className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded font-medium">
                            {language === "ar" ? "توصيل مجاني" : "Free Shipping"}
                          </div>
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleWishlistToggle(product)}
                          className={`absolute top-2 end-2 w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${
                            isInWishlist(product.id)
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-card text-muted-foreground hover:text-foreground border-border"
                          }`}
                        >
                          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>

                        {/* Quick Actions */}
                        <div className="absolute bottom-2 end-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/product/${product.id}`}
                            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/90 transition-colors"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>

                        {/* Stock Badge */}
                        <div className="absolute bottom-2 start-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              product.inStock ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                            }`}
                          >
                            {product.inStock ? t("products.inStock") : t("products.outOfStock")}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2 hover:text-secondary transition-colors min-h-[2.5rem]">
                            {product.name[language]}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">{language === "ar" ? "ج.م" : "EGP"}</span>
                          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                              <span className="text-sm text-green-600 font-medium">- {product.discount}%</span>
                            </>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-0.5">
                            <span className="text-sm font-medium text-foreground">{product.rating}</span>
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          </div>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>

                        {/* Free Shipping Info */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Truck size={14} />
                          <span>{language === "ar" ? "شحن مجاني" : "Free Shipping"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {language === "ar" ? "لا توجد منتجات" : "No products found"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {language === "ar" ? "جرب تغيير معايير التصفية" : "Try adjusting your filter criteria"}
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    {language === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
