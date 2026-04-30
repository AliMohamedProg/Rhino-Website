import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#FAF6F1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,74,46,0.12),_transparent_50%)]" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#A67C52]/15 blur-3xl animate-pulse" />
      <div className="absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-[#6B4226]/15 blur-3xl animate-pulse [animation-delay:500ms]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          <div className="absolute -inset-6 rounded-full border border-[#6B4226]/20 animate-ping" />
          <div className="absolute -inset-3 rounded-full border border-[#6B4226]/30 animate-pulse" />
          <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgba(107,66,38,0.2)] flex items-center justify-center">
            <Image
              src="/images/logo-websait.png"
              alt="Rhino Furniture"
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#6B4226] animate-bounce" />
          <span className="h-2 w-2 rounded-full bg-[#8B5E3C] animate-bounce [animation-delay:120ms]" />
          <span className="h-2 w-2 rounded-full bg-[#A67C52] animate-bounce [animation-delay:240ms]" />
        </div>

        <div className="text-center">
          <p className="text-[11px] tracking-[0.35em] font-semibold text-[#6B4226]/90">
            RHINO FURNITURE
          </p>
          <p className="mt-2 text-sm text-[#6B4226]/70">
            Crafting your space...
          </p>
        </div>
      </div>
    </div>
  )
}
