import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white pt-32 pb-16 px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-8">

        {/* Brand Col */}
        <div className="flex flex-col gap-8 max-w-xs">
          <div className="relative w-40 h-10">
            <Image
              src="/Logo.png"
              alt="RHINO"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-taupe leading-relaxed font-medium italic">
            "CRAFTED WITH PRECISION, DESIGNED FOR LEGACY."
          </p>
          <p className="text-[13px] text-taupe leading-relaxed">
            Every piece is a unique statement of luxury and minimalist design for your modern home and space.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-16 md:gap-32">

          {/* Shop */}
          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-mahogany uppercase">Shop</h4>
            <div className="flex flex-col gap-5 text-[12px] font-bold text-taupe tracking-widest">
              <a href="/products" className="hover:text-mahogany transition-colors">CATALOG</a>
              <a href="#" className="hover:text-mahogany transition-colors">SPECIAL OFFERS</a>
              <a href="/products" className="hover:text-mahogany transition-colors">FURNITURE</a>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5 text-[12px] font-bold text-taupe tracking-widest">
              <a href="#" className="hover:text-mahogany transition-colors">OUR STORY</a>
              <a href="https://wa.me/201070065192" className="hover:text-mahogany transition-colors">CONTACT</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[10px] font-bold text-taupe tracking-widest uppercase">
          © {new Date().getFullYear()} Rhino Furniture Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-taupe hover:bg-mahogany hover:text-white cursor-pointer transition-all duration-300 text-xs font-bold"><Instagram /></div>
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-taupe hover:bg-mahogany hover:text-white cursor-pointer transition-all duration-300 text-xs font-bold"><Facebook /></div>
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-taupe hover:bg-mahogany hover:text-white cursor-pointer transition-all duration-300 text-xs font-bold"><Twitter /></div>
        </div>
      </div>
    </footer>
  );
}
