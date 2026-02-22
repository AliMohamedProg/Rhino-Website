import { Cairo, Geist, Geist_Mono } from "next/font/google"

export const geist = Geist({ subsets: ["latin"] })
export const geistMono = Geist_Mono({ subsets: ["latin"] })
export const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] })
