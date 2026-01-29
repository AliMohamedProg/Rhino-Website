"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ar"

interface Translations {
  [key: string]: {
    en: string
    ar: string
  }
}

const translations: Translations = {
  // Header
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.furniture": { en: "Furniture", ar: "الأثاث" },
  "nav.decor": { en: "Home Décor", ar: "ديكورات منزلية" },
  "nav.kitchen": { en: "Kitchen & Bath", ar: "المطبخ والحمام" },
  "nav.appliances": { en: "Appliances", ar: "الأجهزة المنزلية" },
  "nav.electronics": { en: "Electronics", ar: "الإلكترونيات" },
  "nav.sports": { en: "Sports", ar: "الأدوات الرياضية" },
  "nav.gifts": { en: "Gifts", ar: "الهدايا" },
  "search.placeholder": { en: "Search for products...", ar: "ابحث عن المنتجات..." },
  "header.cart": { en: "Cart", ar: "السلة" },
  "header.account": { en: "Account", ar: "حسابي" },
  "header.wishlist": { en: "Wishlist", ar: "المفضلة" },

  // Hero
  "hero.title": { en: "New Year.. New Home", ar: "سنة جديدة .. بيت جديد" },
  "hero.subtitle": { en: "We Wish You Merry Christmas", ar: "نتمنى لكم عيد ميلاد سعيد" },
  "hero.cta": { en: "Shop Now", ar: "تسوق الآن" },

  // Products
  "products.featured": { en: "Featured Products", ar: "المنتجات الأكثر مبيعاً" },
  "products.deals": { en: "Don't Miss Deals on Best Sellers", ar: "ما تفوتش العروض على المنتجات الأكثر مبيعاً" },
  "products.viewMore": { en: "View More", ar: "مشاهدة المزيد" },
  "products.addToCart": { en: "Add to Cart", ar: "أضف للسلة" },
  "products.addToWishlist": { en: "Add to Wishlist", ar: "أضف للمفضلة" },
  "products.price": { en: "EGP", ar: "ج.م" },
  "products.was": { en: "Was", ar: "كان" },
  "products.off": { en: "OFF", ar: "خصم" },
  "products.new": { en: "New", ar: "جديد" },
  "products.inStock": { en: "In Stock", ar: "متوفر" },
  "products.outOfStock": { en: "Out of Stock", ar: "غير متوفر" },
  "products.description": { en: "Description", ar: "الوصف" },
  "products.specifications": { en: "Specifications", ar: "المواصفات" },
  "products.reviews": { en: "Reviews", ar: "التقييمات" },
  "products.related": { en: "Related Products", ar: "منتجات ذات صلة" },

  // Cart
  "cart.title": { en: "Shopping Cart", ar: "سلة التسوق" },
  "cart.empty": { en: "Your cart is empty", ar: "سلة التسوق فارغة" },
  "cart.continueShopping": { en: "Continue Shopping", ar: "متابعة التسوق" },
  "cart.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "cart.shipping": { en: "Shipping", ar: "الشحن" },
  "cart.total": { en: "Total", ar: "الإجمالي" },
  "cart.checkout": { en: "Proceed to Checkout", ar: "متابعة الدفع" },
  "cart.remove": { en: "Remove", ar: "إزالة" },
  "cart.quantity": { en: "Quantity", ar: "الكمية" },

  // Checkout
  "checkout.title": { en: "Checkout", ar: "إتمام الطلب" },
  "checkout.shipping": { en: "Shipping Information", ar: "معلومات الشحن" },
  "checkout.payment": { en: "Payment Method", ar: "طريقة الدفع" },
  "checkout.summary": { en: "Order Summary", ar: "ملخص الطلب" },
  "checkout.placeOrder": { en: "Place Order", ar: "تأكيد الطلب" },
  "checkout.firstName": { en: "First Name", ar: "الاسم الأول" },
  "checkout.lastName": { en: "Last Name", ar: "اسم العائلة" },
  "checkout.email": { en: "Email", ar: "البريد الإلكتروني" },
  "checkout.phone": { en: "Phone", ar: "رقم الهاتف" },
  "checkout.address": { en: "Address", ar: "العنوان" },
  "checkout.city": { en: "City", ar: "المدينة" },
  "checkout.cod": { en: "Cash on Delivery", ar: "الدفع عند الاستلام" },
  "checkout.card": { en: "Credit/Debit Card", ar: "بطاقة ائتمان" },

  // Profile
  "profile.title": { en: "My Account", ar: "حسابي" },
  "profile.orders": { en: "My Orders", ar: "طلباتي" },
  "profile.wishlist": { en: "My Wishlist", ar: "المفضلة" },
  "profile.settings": { en: "Settings", ar: "الإعدادات" },
  "profile.logout": { en: "Logout", ar: "تسجيل الخروج" },
  "profile.language": { en: "Language", ar: "اللغة" },
  "profile.theme": { en: "Theme", ar: "المظهر" },
  "profile.light": { en: "Light", ar: "فاتح" },
  "profile.dark": { en: "Dark", ar: "داكن" },

  // Footer
  "footer.about": { en: "About Us", ar: "عن وود ديكور" },
  "footer.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.faq": { en: "FAQ", ar: "الأسئلة الشائعة" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms & Conditions", ar: "الشروط والأحكام" },
  "footer.copyright": { en: "© 2025 Wood Decor. All rights reserved.", ar: "© 2025 وود ديكور. جميع الحقوق محفوظة." },

  // Categories
  "category.bedroom": { en: "Bedroom", ar: "غرف النوم" },
  "category.living": { en: "Living Room", ar: "غرف المعيشة" },
  "category.dining": { en: "Dining Room", ar: "غرف الطعام" },
  "category.office": { en: "Office", ar: "المكتب" },
  "category.outdoor": { en: "Outdoor", ar: "الأثاث الخارجي" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language] || translation["en"] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
