"use client"

import { createContext, useContext, ReactNode } from "react"

interface AdminLanguageContextType {
  language: "en" | "ar"
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

const translations: Record<string, { en: string; ar: string }> = {
  "common.loading": { en: "Loading...", ar: "جاري التحميل..." },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.edit": { en: "Edit", ar: "تعديل" },
  "common.egp": { en: "EGP", ar: "ج.م" },
  "orders.items": { en: "Items", ar: "العناصر" },
  "cart.quantity": { en: "Quantity", ar: "الكمية" },
  "checkout.summary": { en: "Summary", ar: "الملخص" },
  "orders.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "orders.shipping": { en: "Shipping", ar: "الشحن" },
  "orders.tax": { en: "Tax", ar: "الضريبة" },
  "orders.discount": { en: "Discount", ar: "الخصم" },
  "orders.total": { en: "Total", ar: "الإجمالي" },
  "orders.updateStatus": { en: "Update Status", ar: "تحديث الحالة" },
  "orders.customer": { en: "Customer", ar: "العميل" },
  "orders.shippingAddress": { en: "Shipping Address", ar: "عنوان الشحن" },
  "orders.paymentMethod": { en: "Payment Method", ar: "طريقة الدفع" },
  "products.deleteProduct": { en: "Delete Product", ar: "حذف المنتج" },
  "products.images": { en: "Images", ar: "الصور" },
  "products.description": { en: "Description", ar: "الوصف" },
  "products.status": { en: "Status", ar: "الحالة" },
  "products.featured": { en: "Featured", ar: "مميز" },
  "products.onSale": { en: "On Sale", ar: "في العرض" },
  "products.originalPrice": { en: "Original Price", ar: "السعر الأصلي" },
  "products.stock": { en: "Stock", ar: "المخزون" },
  "products.category": { en: "Category", ar: "الفئة" },
  "products.price": { en: "Price", ar: "السعر" },
}

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const language = "en" 
  const dir = "ltr"
  
  const t = (key: string) => {
    const translation = translations[key]
    return translation ? translation[language] : key
  }

  return (
    <AdminLanguageContext.Provider value={{ language, t, dir }}>
      {children}
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext)
  if (!context) {
    // Return a default object if used outside provider to prevent crashes
    return {
      language: "en" as const,
      t: (key: string) => {
        const translation = translations[key]
        return translation ? translation["en"] : key
      },
      dir: "ltr" as const
    }
  }
  return context
}
