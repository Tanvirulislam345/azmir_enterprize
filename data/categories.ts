import type { ProductCategory } from "@/types/product";

/**
 * DRAFT catalogue — reference examples only (see README §2).
 * Every entry stays `isPublished: true` until the client confirms what AZMIR actually supplies.
 * Do not add specifications, origins or attributes without client confirmation.
 */
export const categories: ProductCategory[] = [
  {
    id: "stone",
    slug: "stone",
    image: "/images/stones/pakur-stone.jpg",
    name: { bn: "পাথর — চিপস ও অ্যাগ্রিগেট", en: "Stone — Chips & Aggregate" },
    description: {
      bn: "নির্মাণ কাজে ব্যবহৃত বিভিন্ন ধরনের পাথরের চিপস ও অ্যাগ্রিগেট।",
      en: "Stone chips and aggregate for construction work.",
    },
    isPublished: true,
    sortOrder: 1,
    variants: [
      { id: "pakur-stone-chips", slug: "pakur-stone-chips", image: "/images/stones/pakur-stone.jpg", name: { bn: "পাকুড় স্টোন চিপস", en: "Pakur Stone Chips" }, isPublished: true, featured: true, sortOrder: 1 },
      { id: "meghalaya-stone-chips", slug: "meghalaya-stone-chips", image: "/images/stones/meghalaya-stone.jpg", name: { bn: "মেঘালয় স্টোন চিপস", en: "Meghalaya Stone Chips" }, isPublished: true, sortOrder: 2 },
      { id: "dubai-stone-chips", slug: "dubai-stone-chips", image: "/images/stones/dubai-stone.jpg", name: { bn: "দুবাই স্টোন চিপস", en: "Dubai Stone Chips" }, isPublished: true, sortOrder: 3 },
      { id: "maddhapara-stone-chips", slug: "maddhapara-stone-chips", image: "/images/stones/maddhapara-stone.jpg", name: { bn: "মধ্যপাড়া স্টোন চিপস", en: "Maddhapara Stone Chips" }, isPublished: true, sortOrder: 4 },
      { id: "bhutan-torsa-stone-chips", slug: "bhutan-torsa-stone-chips", image: "/images/stones/bhutan-torsa-stone.jpg", name: { bn: "ভুটান তোর্সা স্টোন চিপস", en: "Bhutan Torsa Stone Chips" }, isPublished: true, sortOrder: 5 },
      { id: "boulder-stone", slug: "boulder-stone", image: "/images/stones/boulder-stone.jpg", name: { bn: "বোল্ডার স্টোন", en: "Boulder Stone" }, isPublished: true, sortOrder: 6 },
      { id: "singles-stone", slug: "singles-stone", image: "/images/stones/singles-stone.jpg", name: { bn: "সিঙ্গেলস স্টোন", en: "Singles Stone" }, isPublished: true, sortOrder: 7 },
    ],
  },
  {
    id: "sand",
    slug: "sand",
    image: "/images/sands/fine-aggregate-sylhet-sand.jpg",
    name: { bn: "বালু", en: "Sand" },
    description: {
      bn: "নির্মাণ ও ভরাট কাজের জন্য বিভিন্ন ধরনের বালু।",
      en: "Sand for construction and filling work.",
    },
    isPublished: true,
    sortOrder: 2,
    variants: [
      { id: "sylhet-fine-aggregate", slug: "sylhet-fine-aggregate", image: "/images/sands/fine-aggregate-sylhet-sand.jpg", name: { bn: "ফাইন অ্যাগ্রিগেট (সিলেট বালু)", en: "Fine Aggregate (Sylhet Sand)" }, isPublished: true, featured: true, sortOrder: 1 },
      { id: "durgapur-fine-aggregate", slug: "durgapur-fine-aggregate", image: "/images/sands/fine-aggregate-durgapur-sand.jpg", name: { bn: "ফাইন অ্যাগ্রিগেট (দুর্গাপুর বালু)", en: "Fine Aggregate (Durgapur Sand)" }, isPublished: true, sortOrder: 2 },
      { id: "panchagarh-fine-aggregate", slug: "panchagarh-fine-aggregate", image: "/images/sands/fine-aggregate-panchagarh-sand.jpg", name: { bn: "ফাইন অ্যাগ্রিগেট (পঞ্চগড় বালু)", en: "Fine Aggregate (Panchagarh Sand)" }, isPublished: true, sortOrder: 3 },
      { id: "filling-sand", slug: "filling-sand", image: "/images/sands/fine-aggregate-filling-sand.jpg", name: { bn: "ভরাট বালু", en: "Filling Sand" }, isPublished: true, sortOrder: 4 },
    ],
  },
  {
    id: "bricks",
    slug: "bricks",
    image: "/images/bricks/auto-bricks.jpg",
    name: { bn: "ইট", en: "Bricks" },
    description: {
      bn: "নির্মাণ কাজের জন্য ইট।",
      en: "Bricks for construction work.",
    },
    isPublished: true,
    sortOrder: 3,
    variants: [
      { id: "auto-bricks", slug: "auto-bricks", image: "/images/bricks/auto-bricks.jpg", name: { bn: "অটো ইট", en: "Auto Bricks" }, isPublished: true, featured: true, sortOrder: 1 },
    ],
  },
];
