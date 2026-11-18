import type { Project } from "@/types/project";
import { photos } from "./photos";

/**
 * PLACEHOLDER project names for the home "Selected projects" section.
 * These are not real clients — replace them with names the client has confirmed before launch.
 * The photos are TEMPORARY too: generic site photos cycled across projects until real project photos arrive.
 */
const STAND_IN_PHOTOS = [photos.bholaganj, photos.jaflong, photos.brickKiln, photos.tipperTruck, photos.brickMoulding];

const names: [id: string, en: string, bn: string][] = [
  ["mark-builders", "Mark Builders Limited", "মার্ক বিল্ডার্স লিমিটেড"],
  ["skyline-developers", "Skyline Developers Ltd.", "স্কাইলাইন ডেভেলপার্স লিমিটেড"],
  ["green-valley-constructions", "Green Valley Constructions", "গ্রিন ভ্যালি কনস্ট্রাকশনস"],
  ["delta-housing", "Delta Housing Ltd.", "ডেল্টা হাউজিং লিমিটেড"],
  ["riverside-properties", "Riverside Properties", "রিভারসাইড প্রপার্টিজ"],
  ["unity-engineering", "Unity Engineering & Construction", "ইউনিটি ইঞ্জিনিয়ারিং অ্যান্ড কনস্ট্রাকশন"],
  ["metro-build", "Metro Build Solutions", "মেট্রো বিল্ড সলিউশনস"],
  ["crescent-real-estate", "Crescent Real Estate Ltd.", "ক্রিসেন্ট রিয়েল এস্টেট লিমিটেড"],
  ["north-star-builders", "North Star Builders", "নর্থ স্টার বিল্ডার্স"],
  ["harbor-view-developments", "Harbor View Developments", "হারবার ভিউ ডেভেলপমেন্টস"],
];

export const projects: Project[] = names.map(([id, en, bn], index) => ({
  id,
  name: { en, bn },
  photo: STAND_IN_PHOTOS[index % STAND_IN_PHOTOS.length],
  isPublished: true,
  sortOrder: index + 1,
}));
