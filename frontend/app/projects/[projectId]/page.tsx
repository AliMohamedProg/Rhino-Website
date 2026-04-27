"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BRANDS } from "@/lib/mock-alliances"
import { ShoppingBagIcon } from "lucide-react"

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  // Find project in all brands
  const project = BRANDS.flatMap(b => b.projects).find(p => p.id === projectId)
  const brand = BRANDS.find(b => b.projects.some(p => p.id === projectId))

  if (!project || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <h1 className="text-2xl font-serif text-mahogany">Project Not Found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EBE0] pt-32 pb-24 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-bold text-taupe uppercase mb-4 block">
              {project.category} · {project.location}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-mahogany uppercase tracking-tight">
              {project.title}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] tracking-[0.2em] font-bold text-taupe uppercase">
              Completed {project.year}
            </span>
          </div>
        </div>

        {/* Hero Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="md:col-span-2 aspect-[4/3] rounded-[2rem] overflow-hidden relative group">
            <img 
              src={project.mainImage} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000"
              }}
            />
            <div className="absolute bottom-6 left-6 text-white/50 text-[8px] tracking-[0.2em] font-bold uppercase">
              Main Living Sanctuary
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {project.secondaryImages.map((img, idx) => (
              <div key={idx} className="flex-1 rounded-[2rem] overflow-hidden relative group">
                <img 
                  src={img} 
                  alt={`${project.title} detail ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    const fallbacks = [
                      "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=600",
                      "https://images.unsplash.com/photo-1505693413171-293669746a57?auto=format&fit=crop&q=80&w=600"
                    ]
                    (e.target as HTMLImageElement).src = fallbacks[idx] || fallbacks[0]
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-serif text-mahogany italic leading-snug">
              {project.subtitle}
            </h2>
            <div className="w-12 h-0.5 bg-mahogany/20 mt-6" />
          </div>
          <div className="md:col-span-8">
            <div className="space-y-6 text-mahogany/80 leading-relaxed max-w-2xl">
              {project.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Items We Use Section */}
        <div>
          <div className="flex items-center justify-between mb-12 border-b border-mahogany/10 pb-8">
            <h2 className="text-3xl font-serif text-mahogany">Items We Use</h2>
            <Link href="/products" className="text-[10px] tracking-[0.2em] font-bold text-taupe uppercase border-b border-taupe/30 pb-1 hover:text-mahogany hover:border-mahogany transition-all">
              View Full Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {project.itemsUsed.map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                       (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400`
                    }}
                  />
                  <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-mahogany text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ShoppingBagIcon className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-mahogany uppercase tracking-wider mb-1">{item.name}</h4>
                  <p className="text-[10px] text-taupe italic">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
