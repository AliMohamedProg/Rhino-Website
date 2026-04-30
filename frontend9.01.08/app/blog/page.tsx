"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { Calendar, User } from "lucide-react"

export default function BlogPage() {
  const { language } = useLanguage()

  const posts = [
    {
      id: 1,
      title: { en: "10 Tips for Decorating Your Living Room", ar: "10 نصائح لتزيين غرفة المعيشة" },
      excerpt: {
        en: "Transform your living room into a cozy and stylish space with these expert tips...",
        ar: "حول غرفة معيشتك إلى مساحة مريحة وأنيقة مع هذه النصائح من الخبراء...",
      },
      image: "/modern-living-room.png",
      date: "2025-01-15",
      author: { en: "Sarah Ahmed", ar: "سارة أحمد" },
    },
    {
      id: 2,
      title: { en: "Choosing the Perfect Bedroom Furniture", ar: "اختيار أثاث غرفة النوم المثالي" },
      excerpt: {
        en: "A comprehensive guide to selecting bedroom furniture that combines comfort and style...",
        ar: "دليل شامل لاختيار أثاث غرفة النوم الذي يجمع بين الراحة والأناقة...",
      },
      image: "/bedroom-furniture-setup.jpg",
      date: "2025-01-10",
      author: { en: "Mohamed Hassan", ar: "محمد حسن" },
    },
    {
      id: 3,
      title: { en: "Small Space Solutions", ar: "حلول المساحات الصغيرة" },
      excerpt: {
        en: "Smart furniture ideas for maximizing small apartments and rooms...",
        ar: "أفكار أثاث ذكية للاستفادة القصوى من الشقق والغرف الصغيرة...",
      },
      image: "/small-apartment-furniture-solutions.jpg",
      date: "2025-01-05",
      author: { en: "Nour Ali", ar: "نور علي" },
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground text-center mb-12">
            {language === "ar" ? "المدونة" : "Blog"}
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title[language]}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {post.author[language]}
                    </span>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <h2 className="text-lg font-semibold text-foreground mb-2 hover:text-secondary transition-colors">
                      {post.title[language]}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt[language]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
