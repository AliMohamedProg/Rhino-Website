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
    // If it's a local asset (starts with / and doesn't look like a backend path), return as is
    if (url.startsWith("/") && !url.startsWith("/api") && !url.startsWith("/Upload")) {
      return url;
    }

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")
    const cleanUrl = url.replace(/\\/g, "/")
    
    // If it's a raw filename (no slashes), it's in the uploads folder
    if (!cleanUrl.includes("/")) {
      finalUrl = `${baseUrl}/uploads/${cleanUrl}`
    } else {
      finalUrl = `${baseUrl}/${cleanUrl.startsWith("/") ? cleanUrl.slice(1) : cleanUrl}`
    }
  }

  return finalUrl;
}

export function parseColors(colorString: string | undefined | null) {
  if (!colorString) return [];
  
  const colorMap: Record<string, string> = {
    "Red": "#EF4444",
    "Blue": "#3B82F6",
    "Green": "#10B981",
    "Black": "#000000",
    "White": "#FFFFFF",
    "Gray": "#6B7280",
    "Grey": "#6B7280",
    "Brown": "#78350F",
    "Beige": "#F5F5DC",
    "Mahogany": "#4A1A1A",
    "Taupe": "#8B8589",
    "Cream": "#FFFDD0",
    "Oak": "#BB935E",
    "Walnut": "#773F1A",
  };

  return colorString.split(",").map(c => {
    const parts = c.trim().split(":");
    const name = parts[0].trim();
    let hex = parts[1]?.trim();
    
    if (!hex) {
      // Look up in map or use the name itself (Browser supports many color names)
      hex = colorMap[name] || name;
    }
    
    return { name, hex };
  }).filter(c => c.name.length > 0);
}

