"use client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroBanner } from "@/components/home/hero-banner"
import { ProductCarousel } from "@/components/home/product-carousel"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"
import {ApiClient}  from "./ApiHelper/ApiClient"

export default  function HomePage() {
const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await ApiClient.get("api/auth/me"); // هينادي API أول ما الصفحة reload
        setUser(data);
        console.log("Logged in user:", data);
      } catch (err) {
        setUser(null);
        console.log("No user logged in", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <ProductCarousel />
        <CategoriesGrid />
        <ProductCarousel />
      </main>
      <Footer />
    </div>
  )
}


