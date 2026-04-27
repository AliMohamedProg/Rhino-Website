"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BRANDS } from "@/lib/mock-alliances"
import { ArrowRightIcon } from "lucide-react"

export default function BrandProjectsPage() {
  const params = useParams()
  const brandId = params.brandId as string
  const brand = BRANDS.find((b) => b.id === brandId)

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <h1 className="text-2xl font-serif text-mahogany">Brand Not Found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-12 flex items-center gap-2 text-[10px] tracking-widest font-bold text-taupe uppercase">
          <Link href="/alliances" className="hover:text-mahogany transition-colors">WE ARE PART OF</Link>
          <span>/</span>
          <span className="text-mahogany">{brand.name}</span>
        </div>

        {/* Brand Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-serif text-mahogany mb-6">{brand.name}</h1>
          <p className="text-base text-mahogany/70 max-w-2xl leading-relaxed">
            {brand.description}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {brand.projects.length > 0 ? (
            brand.projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] mb-6">
                  <div className="absolute inset-0 bg-mahogany/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={project.mainImage} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000"
                    }}
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4">
                      <span className="text-[10px] tracking-[0.2em] font-bold text-white uppercase block mb-1">
                        {project.location}
                      </span>
                      <h3 className="text-2xl font-serif text-white">{project.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] font-bold text-taupe uppercase">{project.category}</span>
                    <p className="text-xs text-mahogany/60 mt-1">{project.year}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-mahogany/20 flex items-center justify-center group-hover:bg-mahogany group-hover:border-mahogany transition-all duration-300">
                    <ArrowRightIcon className="w-4 h-4 text-mahogany group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-mahogany/20 rounded-[2rem]">
              <p className="text-taupe uppercase tracking-widest font-bold">No projects featured yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
