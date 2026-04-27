"use client"

import Link from "next/link"
import { BRANDS } from "@/lib/mock-alliances"

export default function AlliancesPage() {
  return (
    <div className="min-h-screen bg-[#F5EBE0] pt-32 pb-24 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto text-center">
        {/* Global Alliances Header */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.3em] font-bold text-mahogany uppercase mb-4 block">
            Global Alliances
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-mahogany mb-8">
            We Are Part Of
          </h1>
          <p className="text-sm md:text-base text-mahogany/70 max-w-2xl mx-auto leading-relaxed">
            A curated ecosystem of visionaries, artisans, and design houses committed to the philosophy of architectural calm and intentional living.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-mahogany/10 mb-24" />

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-20 gap-x-12">
          {BRANDS.map((brand) => (
            <Link 
              key={brand.id} 
              href={`/alliances/${brand.id}`}
              className="group flex flex-col items-center gap-8 transition-transform hover:scale-105"
            >
              {/* Brand Logo Text Placeholder/Style */}
              <div className="h-16 flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-mahogany/40 group-hover:text-mahogany transition-colors tracking-tighter">
                  {brand.logoText}
                </span>
              </div>
              
              <div className="text-center">
                <span className="text-[10px] tracking-[0.2em] font-bold text-mahogany uppercase group-hover:tracking-[0.3em] transition-all">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
