import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative w-48 h-48">
          <Image
            src="/images/logo-websait.png"
            alt="Wood Decor Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Spinner */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    </div>
  )
}
