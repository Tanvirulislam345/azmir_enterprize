import type { Project } from "@/types/project";
import { photos } from "./photos";

/**
 * The client's own list of the companies they have supplied (transcribed from their handwritten notebook), in the
 * client's order. Entries marked `// unclear` are best readings of hard-to-read handwriting: confirm their spelling
 * with the client and correct them here.
 * The photos are TEMPORARY: generic site photos cycled across projects until real project photos arrive.
 */
const STAND_IN_PHOTOS = [
  photos.bholaganj,
  photos.jaflong,
  photos.brickKiln,
  photos.tipperTruck,
  photos.brickMoulding,
];

const names: [id: string, en: string, bn: string][] = [
  ["mark-builders", "Mark Builders Ltd.", "মার্ক বিল্ডার্স লিঃ"],
  ["big-apple-builders", "Big Apple Builders", "বিগ এ্যাপল বিল্ডার্স"],
  ["mohammadia-steel-corporation", "Mohammadia Steel Corporation", "মোহাম্মদিয়া স্টীল কর্পোরেশন"],
  ["meghna-international-industries", "Meghna International Industries", "মেঘনা ইন্টারন্যাশনাল ইন্ডাস্ট্রিজ"],  // unclear
  ["atanu-balli-industries", "Atanu Balli Industries Ltd.", "অতনু বল্লী ইন্ডাস্ট্রিজ লিঃ"],  // unclear
  ["ekota-balli-industries", "Ekota Balli Industries Ltd.", "একতা বল্লী ইন্ডাস্ট্রিজ লিঃ"],  // unclear
  ["hi-dro-tech", "Hi Dro Tech", "হাই ড্রো টেক"],  // unclear
  ["sb-international", "S B International", "এস বি ইন্টারন্যাশনাল"],
  ["haben-construction", "Haben Construction", "হাবেন কনস্ট্রাকশন"],  // unclear
  ["rubina-traders", "M/S. Rubina Traders", "মেসার্স রুবিনা ট্রেডার্স"],
  ["kazi-traders", "Kazi Traders", "কাজী ট্রেডার্স"],
  ["madina-hi-enterprise", "M/S. Madina Hi Enterprise", "মেসার্স মদিনা হাই এন্টারপ্রাইজ"],  // unclear
  ["j-alam-corporation", "M/S. J. Alam Corporation", "মেসার্স জে. আলম কর্পোরেশন"],
  ["zam-zam-traders", "Zam Zam Traders", "জম জম ট্রেডার্স"],
  ["patwary-enterprise", "M/S. Patwary Enterprise", "মেসার্স পাটওয়ারী এন্টারপ্রাইজ"],
  ["tahmina-enterprise", "M/S. Tahmina Enterprise", "মেসার্স তাহমিনা এন্টারপ্রাইজ"],
  ["m-a-traders", "M. A Traders", "এম. এ ট্রেডার্স"],
  ["bappi-traders", "Bappi Traders", "বাপ্পি ট্রেডার্স"],
  ["kazi-enterprise", "Kazi Enterprise", "কাজী এন্টারপ্রাইজ"],
  ["kazi-construction", "Kazi Construction", "কাজী কনস্ট্রাকশন"],
  ["zaman-enterprise", "M/S. Zaman Enterprise", "মেসার্স জামান এন্টারপ্রাইজ"],
  ["alamgir-construction", "Alamgir Construction", "আলমগীর কনস্ট্রাকশন"],
  ["al-madina-trading", "Al Madina Trading", "আল মদিনা ট্রেডিং"],
  ["l-l-brothers", "L. L. Brothers", "এল. এল. ব্রাদার্স"],
  ["abir-enterprise", "M/S. Abir Enterprise", "মেসার্স আবির এন্টারপ্রাইজ"],
  ["taher-enterprise", "M/S. Taher Enterprise", "মেসার্স তাহের এন্টারপ্রাইজ"],
  ["way-front", "Way Front", "ওয়ে ফ্রন্ট"],  // unclear
  ["sanaullah-bricks", "Sanaullah Bricks", "সানাউল্লাহ ব্রিকস"],  // unclear
  ["suleman-bricks", "Suleman Bricks", "সুলেমান ব্রিকস"],  // unclear
];

export const projects: Project[] = names.map(([id, en, bn], index) => ({
  id,
  name: { en, bn },
  photo: STAND_IN_PHOTOS[index % STAND_IN_PHOTOS.length],
  isPublished: true,
  sortOrder: index + 1,
}));
