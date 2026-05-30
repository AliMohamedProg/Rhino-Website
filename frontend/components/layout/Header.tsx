"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  UserIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "@/components/layout/LucideIcons";
import { useDesktopViewToggle } from "@/hooks/use-desktop-view-toggle";
import { useAuth } from "@/app/Context/auth-context";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { ApiClient } from "@/app/ApiHelper/ApiClient";
import { formatPrice } from "@/lib/products";
import { getImageUrl } from "@/lib/utils";

interface Category {
  id: string;
  name?: string;
  currentState?: number;
}

interface Style {
  id: string;
  name?: string;
  imageUrl?: string;
  currentState?: number;
}

interface Type {
  id: string;
  name?: string;
  currentState?: number;
}

interface SearchProduct {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  mainImage?: string;
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();
  const { itemCount } = useCart();
  const { isDesktopView, toggleDesktopView } = useDesktopViewToggle();
  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);

  const isAdmin =
    isAuthenticated &&
    (user?.role?.toLowerCase() === "admin");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const filteredSearchProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchProducts
      .filter((p) =>
        [p.name, p.description, p.sku]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [searchProducts, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiClient.get<any[]>("api/Category");
        if (!Array.isArray(data)) {
          setCategories([]);
          return;
        }

        const normalized = data
          .map((cat) => ({
            id: cat.id ?? cat.Id ?? "",
            nameEn: cat.nameEn ?? cat.NameEn ?? "",
            nameAr: cat.nameAr ?? cat.NameAr ?? "",
            currentState: cat.currentState ?? cat.CurrentState ?? 1,
          }))
          .filter((cat) => Boolean(cat.id) && cat.currentState > 0);

        setCategories(normalized);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    };

    const fetchStyles = async () => {
      try {
        const data = await ApiClient.get<any[]>("api/Styles");
        if (!Array.isArray(data)) {
          setStyles([]);
          return;
        }

        const normalized = data
          .map((s) => ({
            id: s.id ?? s.Id ?? "",
            nameEn: s.nameEn ?? s.NameEn ?? "",
            nameAr: s.nameAr ?? s.NameAr ?? "",
            imageUrl: s.imageUrl ?? s.ImageUrl ?? "",
            currentState: s.currentState ?? s.CurrentState ?? 1,
          }))
          .filter((s) => Boolean(s.id) && s.currentState > 0);

        setStyles(normalized);
      } catch (error) {
        console.error("Failed to fetch styles:", error);
        setStyles([]);
      }
    };

    const fetchTypes = async () => {
      try {
        const data = await ApiClient.types.getAll();
        if (!Array.isArray(data)) {
          setTypes([]);
          return;
        }

        const normalized = data
          .map((t) => ({
            id: t.id ?? "",
            name: t.name ?? "",
            currentState: t.currentState ?? 1,
          }))
          .filter((t) => Boolean(t.id) && t.currentState > 0);

        setTypes(normalized);
      } catch (error) {
        console.error("Failed to fetch types:", error);
        setTypes([]);
      }
    };

    fetchCategories();
    fetchStyles();
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchProductsForSearch = async () => {
      try {
        const data = await ApiClient.get<any[]>("api/Items");
        if (!Array.isArray(data)) {
          setSearchProducts([]);
          return;
        }

        const normalized = data
          .map((item) => ({
            id: (item.id ?? item.Id ?? "").toString(),
            name: item.name ?? item.Name ?? "",
            description: item.description ?? item.Description ?? "",
            sku: item.sku ?? item.SKU ?? "",
            price: Number(item.price ?? item.Price ?? 0),
            mainImage: item.mainImage ?? item.MainImage ?? item.image ?? item.Image ?? "",
          }))
          .filter((item) => Boolean(item.id) && item.name);

        setSearchProducts(normalized);
      } catch (error) {
        console.error("Failed to fetch search products:", error);
        setSearchProducts([]);
      }
    };

    fetchProductsForSearch();
  }, []);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
      ),
    [categories]
  );

  const sortedStyles = useMemo(
    () =>
      [...styles].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
      ),
    [styles]
  );

  const sortedTypes = useMemo(
    () =>
      [...types].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
      ),
    [types]
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-8 py-4 flex items-center justify-between transition-all duration-300 bg-white border-b border-[#7B3F32]/10 ${isScrolled || isMobileMenuOpen ? "shadow-sm" : ""}`}>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-mahogany"
          >
            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="relative w-32 h-8 md:w-36 md:h-10 transition-transform hover:scale-105">
              <Image
                src="/Logo.png"
                alt="RHINO"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-8 text-[10px] tracking-[0.15em] font-bold text-taupe flex-3">
          <Link href="/" className="hover:text-mahogany transition-all hover:scale-110">
            HOME
          </Link>

          {/* Styles Dropdown */}
          <div className="group relative cursor-pointer">
            <div className="flex items-center gap-1.5 text-mahogany transition-all pb-1 hover:scale-110">
              STYLES
              <ChevronDownIcon className="w-3 h-3 ml-0.5 transition-transform group-hover:rotate-180 stroke-[3]" />
            </div>

            {/* Styles Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pt-4">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-80 flex flex-col gap-4">
                {sortedStyles.length > 0 ? (
                  sortedStyles.map((style) => (
                    <Link
                      key={style.id}
                      href={`/style/${style.id}`}
                      className="group/item flex items-center gap-3 hover:text-mahogany transition-all text-taupe/60 text-[11px] font-bold tracking-[0.2em] rounded-xl py-1.5 px-2 hover:bg-[#7B3F32]/5"
                    >
                      {style.imageUrl && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-blush flex-shrink-0 border border-[#7B3F32]/10">
                          <img
                            src={getImageUrl(style.imageUrl)}
                            alt={style.name || ""}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          />
                        </div>
                      )}
                      <span>
                        {(style.name || "").toUpperCase()}
                      </span>
                    </Link>
                  ))
                ) : (
                  <span className="text-[10px] text-taupe/40 tracking-widest font-medium italic">Loading styles...</span>
                )}

                <div className="w-full h-px bg-gray-50 my-1"></div>

                <Link href="/products" className="hover:text-mahogany transition-colors block font-bold text-mahogany text-[11px] tracking-[0.2em]">
                  ALL PRODUCTS
                </Link>

                <div className="text-[8px] text-[#D1D1D1] leading-relaxed mt-4 normal-case tracking-normal font-medium max-w-[180px] italic">
                  CRAFTED WITH PRECISION, DESIGNED FOR LEGACY.
                </div>
              </div>
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="group relative cursor-pointer">
            <div className="flex items-center gap-1.5 hover:text-mahogany transition-all pb-1 hover:scale-110">
              CATEGORIES
              <ChevronDownIcon className="w-3 h-3 ml-0.5 transition-transform group-hover:rotate-180 stroke-[3]" />
            </div>

            {/* Categories Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pt-4">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-80 flex flex-col gap-5">
                {sortedCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="hover:text-mahogany transition-colors block text-taupe/60 text-[11px] font-bold tracking-[0.2em]"
                  >
                    {(category.name || "CATEGORY").toUpperCase()}
                  </Link>
                ))}

                <div className="w-full h-px bg-gray-50 my-1"></div>

                <Link href="/products" className="hover:text-mahogany transition-colors block font-bold text-mahogany text-[11px] tracking-[0.2em]">
                  ALL CATEGORIES
                </Link>
              </div>
            </div>
          </div>

          {/* Types Dropdown */}
          <div className="group relative cursor-pointer">
            <div className="flex items-center gap-1.5 hover:text-mahogany transition-all pb-1 hover:scale-110">
              TYPES
              <ChevronDownIcon className="w-3 h-3 ml-0.5 transition-transform group-hover:rotate-180 stroke-[3]" />
            </div>

            {/* Types Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pt-4">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-80 flex flex-col gap-5">
                {sortedTypes.map((type) => (
                  <Link
                    key={type.id}
                    href={`/products?typeId=${type.id}`}
                    className="hover:text-mahogany transition-colors block text-taupe/60 text-[11px] font-bold tracking-[0.2em]"
                  >
                    {(type.name || "TYPE").toUpperCase()}
                  </Link>
                ))}

                <div className="w-full h-px bg-gray-50 my-1"></div>

                <Link href="/products" className="hover:text-mahogany transition-colors block font-bold text-mahogany text-[11px] tracking-[0.2em]">
                  VIEW ALL TYPES
                </Link>
              </div>
            </div>
          </div>

          <Link href="/products" className="hover:text-mahogany transition-colors block font-bold text-mahogany text-[11px] tracking-[0.2em]">
            ALL PRODUCTS
          </Link>
          <Link href="/alliances" className="hover:text-mahogany transition-all hover:scale-110">
            WE ARE PART OF
          </Link>
          <Link href="/#our-story" className="hover:text-[#3D2B1F] transition-all hover:scale-110">
            OUR STORY
          </Link>
        </div>

        {/* Utilities */}
        <div className="flex items-center justify-end gap-4 md:gap-6 text-[#3D2B1F] flex-1">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center relative">
            {isSearchOpen ? (
              <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-56 bg-transparent border-b border-mahogany text-[10px] tracking-widest text-mahogany placeholder:text-taupe focus:outline-none px-2 py-1"
                  />
                  <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="ml-2 text-taupe hover:text-mahogany">
                    <XIcon className="w-4 h-4" />
                  </button>
                </form>

                {searchQuery.length > 0 && (
                  <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 flex flex-col gap-2 z-[110] border border-sand/30">
                    {filteredSearchProducts.length > 0 ? (
                      filteredSearchProducts.map(product => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-4 p-2 hover:bg-blush rounded-2xl transition-colors text-left"
                        >
                          <div className="w-12 h-12 bg-blush rounded-xl relative overflow-hidden shrink-0">
                            <Image src={getImageUrl(product.mainImage)} fill alt={product.name || ""} className="object-contain p-2" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[11px] font-bold text-mahogany truncate block hover:text-clip hover:overflow-visible">{product.name}</p>
                            <p className="text-[10px] text-taupe block font-medium tracking-wider">{formatPrice(product.price)} EGP</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-6 text-center text-[10px] text-taupe uppercase tracking-widest font-bold">No results found</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="hover:scale-125 transition-transform duration-300">
                <SearchIcon className="w-5 h-5 stroke-[1.5]" />
              </button>
            )}
          </div>

          {/* Auth-aware section */}
          {!loading && (
            isAuthenticated ? (
              <>
                {/* Admin Panel button */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mahogany text-white text-[9px] font-black tracking-[0.15em] uppercase hover:bg-[#5C2E1A] transition-all hover:scale-105 shadow-sm"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Profile icon */}
                <Link href="/profile" className="hover:scale-125 transition-transform duration-300" title={user?.userName ?? user?.email ?? "Profile"}>
                  <UserIcon className="w-5 h-5 stroke-[1.5]" />
                </Link>

                {/* Cart icon */}
                <Link href="/cart" className="relative hover:scale-125 transition-transform duration-300">
                  <ShoppingBagIcon className="w-5 h-5 stroke-[1.5]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-mahogany text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                {/* Login button */}
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full border border-mahogany text-mahogany text-[9px] font-black tracking-[0.15em] uppercase hover:bg-mahogany hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>

                {/* Sign Up button */}
                <Link
                  href="/register"
                  className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-mahogany text-white text-[9px] font-black tracking-[0.15em] uppercase hover:bg-[#5C2E1A] transition-all duration-300 hover:scale-105 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-white transition-all duration-500 md:hidden ${isMobileMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
        }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-sm tracking-[0.3em] font-bold text-mahogany">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-mahogany">HOME</Link>

          {/* Mobile Styles */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-mahogany">STYLES</span>
            <div className="flex flex-col items-center gap-2 text-[10px] text-taupe">
              {sortedStyles.map((style) => (
                <Link
                  key={style.id}
                  href={`/style/${style.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {(style.name || "").toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Categories */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-mahogany">CATEGORIES</span>
            <div className="flex flex-col items-center gap-2 text-[10px] text-taupe">
              {sortedCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {(category.name || "").toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Types */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-mahogany">TYPES</span>
            <div className="flex flex-col items-center gap-2 text-[10px] text-taupe">
              {sortedTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/products?typeId=${type.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {(type.name || "Type").toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-mahogany">CATALOG</Link>
          <Link href="/alliances" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-mahogany">WE ARE PART OF</Link>
          <Link href="/#our-story" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-mahogany">OUR STORY</Link>

          <div className="mt-10 w-40 h-px bg-sand/20"></div>

          <div className="relative w-[85%] max-w-[320px] mt-6 flex flex-col items-center">
            <form onSubmit={handleSearch} className="flex gap-4 bg-[#F8F8F8] px-6 py-4 rounded-full w-full shadow-inner">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[12px] tracking-widest w-full text-mahogany placeholder:text-taupe"
              />
              <button type="submit">
                <SearchIcon className="w-5 h-5 text-taupe hover:text-mahogany" />
              </button>
            </form>

            {searchQuery.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-[2rem] shadow-2xl p-3 flex flex-col z-[110] border border-sand/30">
                {filteredSearchProducts.length > 0 ? (
                  filteredSearchProducts.slice(0, 3).map(product => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => { setIsMobileMenuOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-4 p-3 hover:bg-blush rounded-2xl transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-blush rounded-xl relative overflow-hidden shrink-0">
                        <Image src={getImageUrl(product.mainImage)} fill alt={product.name} className="object-contain p-2" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-bold text-mahogany truncate block">{product.name}</p>
                        <p className="text-[10px] text-taupe block font-medium tracking-wider">{formatPrice(product.price)} EGP</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-[10px] text-taupe uppercase tracking-widest font-bold">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Mobile auth section */}
          {!loading && (
            <div className="flex flex-col items-center gap-4 mt-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-6 py-2 rounded-full bg-mahogany text-white text-[10px] font-black tracking-[0.15em] uppercase"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex gap-8">
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserIcon className="w-6 h-6 text-taupe" />
                    </Link>
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative">
                      <ShoppingBagIcon className="w-6 h-6 text-taupe" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 bg-mahogany text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-2 rounded-full border border-mahogany text-mahogany text-[10px] font-black tracking-[0.15em] uppercase"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-2 rounded-full bg-mahogany text-white text-[10px] font-black tracking-[0.15em] uppercase"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Desktop View Toggle for Mobile */}
          <div className="mt-8">
            <button
              onClick={toggleDesktopView}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.15em] uppercase transition-all border ${isDesktopView ? "bg-mahogany text-white border-mahogany" : "border-mahogany text-mahogany hover:bg-mahogany hover:text-white"}`}
            >
              {isDesktopView ? (
                <>
                  <SmartphoneIcon className="w-4 h-4" />
                  MOBILE VIEW
                </>
              ) : (
                <>
                  <MonitorIcon className="w-4 h-4" />
                  DESKTOP VIEW
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
