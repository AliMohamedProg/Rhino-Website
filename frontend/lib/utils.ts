import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | undefined | null): string {
  if (!url) return "/placeholder.svg"
  
  // Handle relative paths and full URLs
  let finalUrl = url;
  if (!url.startsWith("http") && !url.startsWith("blob:") && !url.startsWith("data:")) {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")
    const cleanUrl = url.replace(/\\/g, "/")
    finalUrl = `${baseUrl}/${cleanUrl.startsWith("/") ? cleanUrl.slice(1) : cleanUrl}`
  }

  // FORCE HTTP FOR LOCALHOST (Prevents browser SSL blocks for self-signed certs)
  if (finalUrl.includes("https://localhost:7282")) {
    return finalUrl.replace("https://localhost:7282", "http://localhost:5213")
  }

  return finalUrl;
}
