import { Cairo, Geist, Geist_Mono, Playfair_Display, Raleway } from "next/font/google"

export const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
export const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
export const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-cairo" })
export const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
export const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" })
