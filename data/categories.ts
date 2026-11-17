import type { ProductCategory } from "@/types/product";

/**
 * DRAFT catalogue — reference examples only (see README §2).
 * Every entry stays `isPublished: false` until the client confirms what AZMIR actually supplies.
 * Do not add specifications, origins or attributes without client confirmation.
 */
export const categories: ProductCategory[] = [
  {
    id: "stone",
    slug: "stone",
    name: { bn: "পাথর — চিপস ও অ্যাগ্রিগেট", en: "Stone — Chips & Aggregate" },
    description: {
      bn: "নির্মাণ কাজে ব্যবহৃত বিভিন্ন ধরনের পাথরের চিপস ও অ্যাগ্রিগেট।",
      en: "Stone chips and aggregate for construction work.",
    },
    isPublished: false,
    sortOrder: 1,
    variants: [
      { id: "pakur-stone-chips", slug: "pakur-stone-chips", name: { bn: "পাকুড় স্টোন চিপস", en: "Pakur Stone Chips" }, isPublished: false, featured: true, sortOrder: 1 },
      { id: "meghalaya-stone-chips", slug: "meghalaya-stone-chips", name: { bn: "মেঘালয় স্টোন চিপস", en: "Meghalaya Stone Chips" }, isPublished: false, sortOrder: 2 },
      { id: "dubai-stone-chips", slug: "dubai-stone-chips", name: { bn: "দুবাই স্টোন চিপস", en: "Dubai Stone Chips" }, isPublished: false, sortOrder: 3 },
      { id: "maddhapara-stone-chips", slug: "maddhapara-stone-chips", name: { bn: "মধ্যপাড়া স্টোন চিপস", en: "Maddhapara Stone Chips" }, isPublished: false, sortOrder: 4 },
      { id: "bhutan-torsa-stone-chips", slug: "bhutan-torsa-stone-chips", name: { bn: "ভুটান তোর্সা স্টোন চিপস", en: "Bhutan Torsa Stone Chips" }, isPublished: false, sortOrder: 5 },
      { id: "boulder-stone", slug: "boulder-stone", name: { bn: "বোল্ডার স্টোন", en: "Boulder Stone" }, isPublished: false, sortOrder: 6 },
      { id: "singles-stone", slug: "singles-stone", name: { bn: "সিঙ্গেলস স্টোন", en: "Singles Stone" }, isPublished: false, sortOrder: 7 },
    ],
  },
  {
    id: "sand",
    slug: "sand",
    name: { bn: "বালু", en: "Sand" },
    description: {
      bn: "নির্মাণ ও ভরাট কাজের জন্য বিভিন্ন ধরনের বালু।",
      en: "Sand for construction and filling work.",
    },
    isPublished: false,
    sortOrder: 2,
    variants: [
      { id: "sylhet-fine-aggregate", slug: "sylhet-fine-aggregate", name: { bn: "ফাইন অ্যাগ্রিগেট (সিলেট বালু)", en: "Fine Aggregate (Sylhet Sand)" }, isPublished: false, featured: true, sortOrder: 1 },
      { id: "durgapur-fine-aggregate", slug: "durgapur-fine-aggregate", name: { bn: "ফাইন অ্যাগ্রিগেট (দুর্গাপুর বালু)", en: "Fine Aggregate (Durgapur Sand)" }, isPublished: false, sortOrder: 2 },
      { id: "panchagarh-fine-aggregate", slug: "panchagarh-fine-aggregate", name: { bn: "ফাইন অ্যাগ্রিগেট (পঞ্চগড় বালু)", en: "Fine Aggregate (Panchagarh Sand)" }, isPublished: false, sortOrder: 3 },
      { id: "filling-sand", slug: "filling-sand", name: { bn: "ভরাট বালু", en: "Filling Sand" }, isPublished: false, sortOrder: 4 },
    ],
  },
  {
    id: "bricks",
    slug: "bricks",
    name: { bn: "ইট", en: "Bricks" },
    description: {
      bn: "নির্মাণ কাজের জন্য ইট।",
      en: "Bricks for construction work.",
    },
    isPublished: false,
    sortOrder: 3,
    variants: [
      { id: "auto-bricks", slug: "auto-bricks", name: { bn: "অটো ইট", en: "Auto Bricks" }, isPublished: false, featured: true, sortOrder: 1 },
    ],
  },
];
