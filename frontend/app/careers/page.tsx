"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock } from "lucide-react"

export default function CareersPage() {
  const { language } = useLanguage()

  const jobs = [
    {
      title: { en: "Senior Software Engineer", ar: "مهندس برمجيات أول" },
      department: { en: "Technology", ar: "التكنولوجيا" },
      location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
      type: { en: "Full-time", ar: "دوام كامل" },
    },
    {
      title: { en: "Product Manager", ar: "مدير منتج" },
      department: { en: "Product", ar: "المنتج" },
      location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
      type: { en: "Full-time", ar: "دوام كامل" },
    },
    {
      title: { en: "Customer Service Representative", ar: "ممثل خدمة عملاء" },
      department: { en: "Operations", ar: "العمليات" },
      location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
      type: { en: "Full-time", ar: "دوام كامل" },
    },
    {
      title: { en: "Marketing Specialist", ar: "أخصائي تسويق" },
      department: { en: "Marketing", ar: "التسويق" },
      location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
      type: { en: "Full-time", ar: "دوام كامل" },
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" ? "انضم إلى فريقنا" : "Join Our Team"}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {language === "ar"
                ? "نبحث عن أشخاص موهوبين ومتحمسين للانضمام إلى فريقنا المتنامي"
                : "We're looking for talented and passionate people to join our growing team"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            {language === "ar" ? "الوظائف المتاحة" : "Open Positions"}
          </h2>

          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{job.title[language]}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {job.department[language]}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {job.location[language]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {job.type[language]}
                    </span>
                  </div>
                </div>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  {language === "ar" ? "قدم الآن" : "Apply Now"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
