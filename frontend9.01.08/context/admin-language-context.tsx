"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ar"

interface Translations {
  [key: string]: {
    en: string
    ar: string
  }
}

const adminTranslations: Translations = {
  // Sidebar
  "sidebar.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "sidebar.products": { en: "Products", ar: "المنتجات" },
  "sidebar.orders": { en: "Orders", ar: "الطلبات" },
  "sidebar.users": { en: "Users", ar: "المستخدمون" },
  "sidebar.categories": { en: "Categories", ar: "الفئات" },
  "sidebar.sliders": { en: "Sliders", ar: "الشرائح" },
  "sidebar.analytics": { en: "Analytics", ar: "التحليلات" },
  "sidebar.settings": { en: "Settings", ar: "الإعدادات" },
  "sidebar.reports": { en: "Reports", ar: "التقارير" },
  "sidebar.inventory": { en: "Inventory", ar: "المخزون" },
  "sidebar.coupons": { en: "Coupons", ar: "الكوبونات" },
  "sidebar.reviews": { en: "Reviews", ar: "التقييمات" },
  "sidebar.support": { en: "Support", ar: "الدعم" },

  // Dashboard
  "dashboard.title": { en: "Dashboard Overview", ar: "نظرة عامة على لوحة التحكم" },
  "dashboard.welcome": { en: "Welcome back", ar: "مرحباً بعودتك" },
  "dashboard.totalRevenue": { en: "Total Revenue", ar: "إجمالي الإيرادات" },
  "dashboard.totalOrders": { en: "Total Orders", ar: "إجمالي الطلبات" },
  "dashboard.totalProducts": { en: "Total Products", ar: "إجمالي المنتجات" },
  "dashboard.totalUsers": { en: "Total Users", ar: "إجمالي المستخدمين" },
  "dashboard.recentOrders": { en: "Recent Orders", ar: "الطلبات الأخيرة" },
  "dashboard.topProducts": { en: "Top Products", ar: "أفضل المنتجات" },
  "dashboard.salesChart": { en: "Sales Overview", ar: "نظرة عامة على المبيعات" },
  "dashboard.ordersChart": { en: "Orders Overview", ar: "نظرة عامة على الطلبات" },
  "dashboard.revenueChart": { en: "Revenue Overview", ar: "نظرة عامة على الإيرادات" },
  "dashboard.thisMonth": { en: "This Month", ar: "هذا الشهر" },
  "dashboard.lastMonth": { en: "Last Month", ar: "الشهر الماضي" },
  "dashboard.thisWeek": { en: "This Week", ar: "هذا الأسبوع" },
  "dashboard.today": { en: "Today", ar: "اليوم" },
  "dashboard.growth": { en: "Growth", ar: "النمو" },
  "dashboard.compared": { en: "Compared to last period", ar: "مقارنة بالفترة السابقة" },

  // Products
  "products.title": { en: "Products Management", ar: "إدارة المنتجات" },
  "products.addProduct": { en: "Add Product", ar: "إضافة منتج" },
  "products.editProduct": { en: "Edit Product", ar: "تعديل منتج" },
  "products.deleteProduct": { en: "Delete Product", ar: "حذف منتج" },
  "products.productName": { en: "Product Name", ar: "اسم المنتج" },
  "products.productNameAr": { en: "Product Name (Arabic)", ar: "اسم المنتج (عربي)" },
  "products.productNameEn": { en: "Product Name (English)", ar: "اسم المنتج (إنجليزي)" },
  "products.description": { en: "Description", ar: "الوصف" },
  "products.descriptionAr": { en: "Description (Arabic)", ar: "الوصف (عربي)" },
  "products.descriptionEn": { en: "Description (English)", ar: "الوصف (إنجليزي)" },
  "products.price": { en: "Price", ar: "السعر" },
  "products.originalPrice": { en: "Original Price", ar: "السعر الأصلي" },
  "products.salePrice": { en: "Sale Price", ar: "سعر البيع" },
  "products.stock": { en: "Stock", ar: "المخزون" },
  "products.category": { en: "Category", ar: "الفئة" },
  "products.status": { en: "Status", ar: "الحالة" },
  "products.active": { en: "Active", ar: "نشط" },
  "products.inactive": { en: "Inactive", ar: "غير نشط" },
  "products.draft": { en: "Draft", ar: "مسودة" },
  "products.images": { en: "Images", ar: "الصور" },
  "products.sku": { en: "SKU", ar: "رمز المنتج" },
  "products.weight": { en: "Weight", ar: "الوزن" },
  "products.dimensions": { en: "Dimensions", ar: "الأبعاد" },
  "products.featured": { en: "Featured", ar: "مميز" },
  "products.onSale": { en: "On Sale", ar: "عرض خاص" },
  "products.material": { en: "Material", ar: "الخامة" },

  // Orders
  "orders.title": { en: "Orders Management", ar: "إدارة الطلبات" },
  "orders.orderNumber": { en: "Order Number", ar: "رقم الطلب" },
  "orders.customer": { en: "Customer", ar: "العميل" },
  "orders.date": { en: "Date", ar: "التاريخ" },
  "orders.total": { en: "Total", ar: "الإجمالي" },
  "orders.status": { en: "Status", ar: "الحالة" },
  "orders.pending": { en: "Pending", ar: "قيد الانتظار" },
  "orders.processing": { en: "Processing", ar: "قيد المعالجة" },
  "orders.shipped": { en: "Shipped", ar: "تم الشحن" },
  "orders.delivered": { en: "Delivered", ar: "تم التوصيل" },
  "orders.cancelled": { en: "Cancelled", ar: "ملغي" },
  "orders.refunded": { en: "Refunded", ar: "مسترد" },
  "orders.viewDetails": { en: "View Details", ar: "عرض التفاصيل" },
  "orders.updateStatus": { en: "Update Status", ar: "تحديث الحالة" },
  "orders.shippingAddress": { en: "Shipping Address", ar: "عنوان الشحن" },
  "orders.billingAddress": { en: "Billing Address", ar: "عنوان الفاتورة" },
  "orders.paymentMethod": { en: "Payment Method", ar: "طريقة الدفع" },
  "orders.items": { en: "Items", ar: "العناصر" },
  "orders.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "orders.shipping": { en: "Shipping", ar: "الشحن" },
  "orders.tax": { en: "Tax", ar: "الضريبة" },
  "orders.discount": { en: "Discount", ar: "الخصم" },

  // Users
  "users.title": { en: "Users Management", ar: "إدارة المستخدمين" },
  "users.addUser": { en: "Add User", ar: "إضافة مستخدم" },
  "users.editUser": { en: "Edit User", ar: "تعديل مستخدم" },
  "users.deleteUser": { en: "Delete User", ar: "حذف مستخدم" },
  "users.name": { en: "Name", ar: "الاسم" },
  "users.email": { en: "Email", ar: "البريد الإلكتروني" },
  "users.phone": { en: "Phone", ar: "الهاتف" },
  "users.role": { en: "Role", ar: "الدور" },
  "users.admin": { en: "Admin", ar: "مدير" },
  "users.customer": { en: "Customer", ar: "عميل" },
  "users.manager": { en: "Manager", ar: "مشرف" },
  "users.status": { en: "Status", ar: "الحالة" },
  "users.active": { en: "Active", ar: "نشط" },
  "users.inactive": { en: "Inactive", ar: "غير نشط" },
  "users.blocked": { en: "Blocked", ar: "محظور" },
  "users.lastLogin": { en: "Last Login", ar: "آخر تسجيل دخول" },
  "users.joinDate": { en: "Join Date", ar: "تاريخ الانضمام" },
  "users.totalOrders": { en: "Total Orders", ar: "إجمالي الطلبات" },
  "users.totalSpent": { en: "Total Spent", ar: "إجمالي المشتريات" },

  // Categories
  "categories.title": { en: "Categories Management", ar: "إدارة الفئات" },
  "categories.addCategory": { en: "Add Category", ar: "إضافة فئة" },
  "categories.editCategory": { en: "Edit Category", ar: "تعديل فئة" },
  "categories.deleteCategory": { en: "Delete Category", ar: "حذف فئة" },
  "categories.categoryName": { en: "Category Name", ar: "اسم الفئة" },
  "categories.categoryNameAr": { en: "Category Name (Arabic)", ar: "اسم الفئة (عربي)" },
  "categories.categoryNameEn": { en: "Category Name (English)", ar: "اسم الفئة (إنجليزي)" },
  "categories.parent": { en: "Parent Category", ar: "الفئة الرئيسية" },
  "categories.description": { en: "Description", ar: "الوصف" },
  "categories.image": { en: "Image", ar: "الصورة" },
  "categories.products": { en: "Products", ar: "المنتجات" },
  "categories.status": { en: "Status", ar: "الحالة" },
  "categories.slug": { en: "Slug", ar: "الرابط" },

  // Settings
  "settings.title": { en: "Settings", ar: "الإعدادات" },
  "settings.general": { en: "General", ar: "عام" },
  "settings.store": { en: "Store Settings", ar: "إعدادات المتجر" },
  "settings.storeName": { en: "Store Name", ar: "اسم المتجر" },
  "settings.storeEmail": { en: "Store Email", ar: "بريد المتجر" },
  "settings.storePhone": { en: "Store Phone", ar: "هاتف المتجر" },
  "settings.storeAddress": { en: "Store Address", ar: "عنوان المتجر" },
  "settings.currency": { en: "Currency", ar: "العملة" },
  "settings.language": { en: "Language", ar: "اللغة" },
  "settings.theme": { en: "Theme", ar: "المظهر" },
  "settings.light": { en: "Light", ar: "فاتح" },
  "settings.dark": { en: "Dark", ar: "داكن" },
  "settings.system": { en: "System", ar: "تلقائي" },
  "settings.notifications": { en: "Notifications", ar: "الإشعارات" },
  "settings.email": { en: "Email Notifications", ar: "إشعارات البريد" },
  "settings.push": { en: "Push Notifications", ar: "الإشعارات الفورية" },
  "settings.shipping": { en: "Shipping", ar: "الشحن" },
  "settings.payment": { en: "Payment", ar: "الدفع" },
  "settings.taxes": { en: "Taxes", ar: "الضرائب" },

  // Analytics
  "analytics.title": { en: "Analytics", ar: "التحليلات" },
  "analytics.overview": { en: "Overview", ar: "نظرة عامة" },
  "analytics.sales": { en: "Sales Analytics", ar: "تحليلات المبيعات" },
  "analytics.traffic": { en: "Traffic Analytics", ar: "تحليلات الزيارات" },
  "analytics.conversion": { en: "Conversion Rate", ar: "معدل التحويل" },
  "analytics.averageOrder": { en: "Average Order Value", ar: "متوسط قيمة الطلب" },
  "analytics.topCategories": { en: "Top Categories", ar: "أفضل الفئات" },
  "analytics.topProducts": { en: "Top Products", ar: "أفضل المنتجات" },
  "analytics.customerAcquisition": { en: "Customer Acquisition", ar: "اكتساب العملاء" },
  "analytics.retention": { en: "Customer Retention", ar: "الاحتفاظ بالعملاء" },

  // Common
  "common.search": { en: "Search", ar: "بحث" },
  "common.searchPlaceholder": { en: "Search...", ar: "بحث..." },
  "common.filter": { en: "Filter", ar: "تصفية" },
  "common.sort": { en: "Sort", ar: "ترتيب" },
  "common.export": { en: "Export", ar: "تصدير" },
  "common.import": { en: "Import", ar: "استيراد" },
  "common.add": { en: "Add", ar: "إضافة" },
  "common.edit": { en: "Edit", ar: "تعديل" },
  "common.delete": { en: "حذف", ar: "حذف" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.confirm": { en: "Confirm", ar: "تأكيد" },
  "common.close": { en: "Close", ar: "إغلاق" },
  "common.yes": { en: "Yes", ar: "نعم" },
  "common.no": { en: "No", ar: "لا" },
  "common.loading": { en: "Loading...", ar: "جاري التحميل..." },
  "common.noData": { en: "No data available", ar: "لا توجد بيانات" },
  "common.actions": { en: "Actions", ar: "الإجراءات" },
  "common.view": { en: "View", ar: "عرض" },
  "common.viewAll": { en: "View All", ar: "عرض الكل" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.next": { en: "Next", ar: "التالي" },
  "common.previous": { en: "Previous", ar: "السابق" },
  "common.page": { en: "Page", ar: "صفحة" },
  "common.of": { en: "of", ar: "من" },
  "common.showing": { en: "Showing", ar: "عرض" },
  "common.entries": { en: "entries", ar: "عناصر" },
  "cart.quantity": { en: "Quantity", ar: "الكمية" },
  "common.all": { en: "All", ar: "الكل" },
  "common.none": { en: "None", ar: "لا شيء" },
  "common.select": { en: "Select", ar: "اختيار" },
  "common.selected": { en: "Selected", ar: "محدد" },
  "common.required": { en: "Required", ar: "مطلوب" },
  "common.optional": { en: "Optional", ar: "اختياري" },
  "common.success": { en: "Success", ar: "نجاح" },
  "common.error": { en: "Error", ar: "خطأ" },
  "common.warning": { en: "Warning", ar: "تحذير" },
  "common.info": { en: "Info", ar: "معلومات" },
  "common.logout": { en: "Logout", ar: "تسجيل الخروج" },
  "common.profile": { en: "Profile", ar: "الملف الشخصي" },
  "common.help": { en: "Help", ar: "مساعدة" },
  "common.egp": { en: "EGP", ar: "ج.م" },

  // Reports
  "reports.title": { en: "Reports", ar: "التقارير" },
  "reports.salesReport": { en: "Sales Report", ar: "تقرير المبيعات" },
  "reports.ordersReport": { en: "Orders Report", ar: "تقرير الطلبات" },
  "reports.customersReport": { en: "Customers Report", ar: "تقرير العملاء" },
  "reports.inventoryReport": { en: "Inventory Report", ar: "تقرير المخزون" },
  "reports.generate": { en: "Generate Report", ar: "إنشاء التقرير" },
  "reports.download": { en: "Download", ar: "تحميل" },
  "reports.dateRange": { en: "Date Range", ar: "نطاق التاريخ" },
  "reports.from": { en: "From", ar: "من" },
  "reports.to": { en: "To", ar: "إلى" },

  // Inventory
  "inventory.title": { en: "Inventory Management", ar: "إدارة المخزون" },
  "inventory.lowStock": { en: "Low Stock", ar: "مخزون منخفض" },
  "inventory.outOfStock": { en: "Out of Stock", ar: "نفذ المخزون" },
  "inventory.inStock": { en: "In Stock", ar: "متوفر" },
  "inventory.threshold": { en: "Low Stock Threshold", ar: "حد المخزون المنخفض" },
  "inventory.adjust": { en: "Adjust Stock", ar: "تعديل المخزون" },
  "inventory.history": { en: "Stock History", ar: "سجل المخزون" },

  // Coupons
  "coupons.title": { en: "Coupons Management", ar: "إدارة الكوبونات" },
  "coupons.addCoupon": { en: "Add Coupon", ar: "إضافة كوبون" },
  "coupons.code": { en: "Coupon Code", ar: "رمز الكوبون" },
  "coupons.discount": { en: "Discount", ar: "الخصم" },
  "coupons.type": { en: "Type", ar: "النوع" },
  "coupons.percentage": { en: "Percentage", ar: "نسبة مئوية" },
  "coupons.fixed": { en: "Fixed Amount", ar: "مبلغ ثابت" },
  "coupons.minOrder": { en: "Minimum Order", ar: "الحد الأدنى للطلب" },
  "coupons.maxUses": { en: "Maximum Uses", ar: "الحد الأقصى للاستخدام" },
  "coupons.validFrom": { en: "Valid From", ar: "صالح من" },
  "coupons.validUntil": { en: "Valid Until", ar: "صالح حتى" },
  "coupons.active": { en: "Active", ar: "نشط" },
  "coupons.expired": { en: "Expired", ar: "منتهي" },

  // Reviews
  "reviews.title": { en: "Reviews Management", ar: "إدارة التقييمات" },
  "reviews.product": { en: "Product", ar: "المنتج" },
  "reviews.customer": { en: "Customer", ar: "العميل" },
  "reviews.rating": { en: "Rating", ar: "التقييم" },
  "reviews.comment": { en: "Comment", ar: "التعليق" },
  "reviews.date": { en: "Date", ar: "التاريخ" },
  "reviews.approved": { en: "Approved", ar: "موافق عليه" },
  "reviews.pending": { en: "Pending", ar: "قيد المراجعة" },
  "reviews.rejected": { en: "Rejected", ar: "مرفوض" },
   "reviews.approve": { en: "Approve", ar: "موافقة" },
   "reviews.reject": { en: "Reject", ar: "رفض" },

   // Checkout
   "checkout.summary": { en: "Order Summary", ar: "ملخص الطلب" },
}

interface AdminLanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
  isRTL: boolean
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("admin-language") as Language
    if (savedLang === "en" || savedLang === "ar") {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("admin-language", language)
    document.documentElement.lang = language
    document.documentElement.dir = "ltr"
  }, [language])

  const t = (key: string): string => {
    const translation = adminTranslations[key]
    if (!translation) return key
    return translation[language] || translation["en"] || key
  }

  const dir: "ltr" | "rtl" = "ltr"
  const isRTL = false

  return (
    <AdminLanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext)
  if (!context) {
    throw new Error("useAdminLanguage must be used within an AdminLanguageProvider")
  }
  return context
}
