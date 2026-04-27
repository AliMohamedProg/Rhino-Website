export interface Project {
  id: string;
  brandId: string;
  title: string;
  location: string;
  year: string;
  category: string;
  description: string;
  subtitle: string;
  mainImage: string;
  secondaryImages: string[];
  itemsUsed: {
    id: string;
    name: string;
    type: string;
    image: string;
  }[];
}

export interface Brand {
  id: string;
  name: string;
  logoText: string;
  description: string;
  projects: Project[];
}

export const BRANDS: Brand[] = [
  {
    id: "vanguard",
    name: "Vanguard Interiors",
    logoText: "VANGUARD",
    description: "A collective of visionary designers pushing the boundaries of contemporary spatial architecture.",
    projects: [
      {
        id: "serene-pavilion",
        brandId: "vanguard",
        title: "The Serene Pavilion",
        location: "Kyoto, Japan",
        year: "2024",
        category: "Residential",
        subtitle: "A Dialogue Between Earth & Light",
        description: "Located in the quiet outskirts of Kyoto, The Serene Pavilion is an exercise in restraint. The design philosophy centers on the Japanese concept of Ma—the celebration of space between things. We utilized a palette of raw materials including untreated white oak, hand-troweled lime plaster, and authentic tatami. Every element was curated to absorb light rather than reflect it, creating an atmosphere of deep tranquility that evolves throughout the day.",
        mainImage: "/project-1.jpg",
        secondaryImages: ["/project-1-2.jpg", "/project-1-3.jpg"],
        itemsUsed: [
          { id: "1", name: "Oak Minimalist Sofa", type: "Custom Artisan Edition", image: "/product-sofa.jpg" },
          { id: "2", name: "Hand-woven Linen Rug", type: "Organic Tones", image: "/product-rug.jpg" },
          { id: "3", name: "Brushed Brass Lantern", type: "Sculptural Lighting", image: "/product-lantern.jpg" },
          { id: "4", name: "Low Walnut Plinth", type: "Geometric Form", image: "/product-plinth.jpg" },
        ]
      }
    ]
  },
  {
    id: "lumina",
    name: "Lumina Studio",
    logoText: "Lumina",
    description: "Masters of light and atmosphere, crafting environments that respond to the human spirit.",
    projects: []
  },
  {
    id: "serein",
    name: "Serein Atelier",
    logoText: "S E R E I N",
    description: "Artisanal craftsmanship meeting modern minimalist sensibilities in every detail.",
    projects: []
  },
  {
    id: "nordic",
    name: "Nordic Weave",
    logoText: "NORDIC",
    description: "The essence of Scandinavian warmth combined with architectural precision.",
    projects: []
  },
  {
    id: "earth-stone",
    name: "Earth & Stone",
    logoText: "EARTH&STONE",
    description: "Raw textures and natural elements transformed into timeless interior statements.",
    projects: []
  }
];
