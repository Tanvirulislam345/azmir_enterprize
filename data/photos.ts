import type { Photo } from "@/types/photo";

/**
 * TEMPORARY openly licensed photos from Wikimedia Commons (resized/cropped, WebP).
 * They show stone and brick work in Bangladesh in general — not AZMIR's own sites or products.
 * Credits are intentionally not displayed (client decision), but CC BY-SA requires attribution:
 * before launch, replace these with client-owned photos or show `credit` again. (README §3)
 */
export const photos = {
  bholaganj: {
    id: "bholaganj",
    src: "/images/hero/bholaganj-river-stones.webp",
    width: 2400,
    height: 1488,
    alt: {
      bn: "সিলেটের ভোলাগঞ্জে নদীর পাড়ে বিভিন্ন আকারের পাথর",
      en: "River stones of many sizes on the bank at Bholaganj, Sylhet",
    },
    caption: { bn: "ভোলাগঞ্জ, সিলেট", en: "Bholaganj, Sylhet" },
    credit: {
      author: "Rahirafsan",
      license: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bholaganj_Sada_Pathor.jpg",
    },
  },
  brickKiln: {
    id: "brick-kiln",
    src: "/images/hero/brick-kiln.webp",
    width: 2400,
    height: 1711,
    alt: {
      bn: "ইটের সারির মাঝে কয়লার স্তূপে কাজ করছেন একজন শ্রমিক",
      en: "A worker among coal heaps and stacked bricks at a brick kiln",
    },
    caption: { bn: "ইটভাটা, বাংলাদেশ", en: "Brick kiln, Bangladesh" },
    credit: {
      author: "Kalbondi2k22",
      license: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Brick_kiln_labourer.jpg",
    },
  },
  jaflong: {
    id: "jaflong",
    src: "/images/hero/jaflong-stone-processing.webp",
    width: 2400,
    height: 1596,
    alt: {
      bn: "জাফলংয়ে নদীর তীরে শ্রমিকরা পাথর ও বালু প্রক্রিয়াজাত করছেন",
      en: "Workers processing stone and sand on the riverbank at Jaflong",
    },
    caption: { bn: "জাফলং, সিলেট", en: "Jaflong, Sylhet" },
    credit: {
      author: "Moheen Reeyad",
      license: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Stone_crushing_at_Jaflong_(1).jpg",
    },
  },
  brickMoulding: {
    id: "brick-moulding",
    src: "/images/hero/brick-moulding.webp",
    width: 2400,
    height: 1600,
    alt: {
      bn: "ইটভাটায় দুজন শ্রমিক হাতে কাঁচা ইট তৈরি করছেন",
      en: "Two workers moulding raw bricks by hand at a brickfield",
    },
    caption: { bn: "ইটভাটা, বাংলাদেশ", en: "Brickfield, Bangladesh" },
    credit: {
      author: "Frameofashik",
      license: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Brick_Kiln_Workers_11.jpg",
    },
  },
  tipperTruck: {
    id: "tipper-truck",
    src: "/images/hero/tipper-truck.webp",
    width: 2000,
    height: 1333,
    alt: {
      bn: "বাংলাদেশের মহাসড়কে চলমান একটি সাদা টিপার ট্রাক",
      en: "A white tipper truck on a highway in Bangladesh",
    },
    caption: { bn: "টিপার ট্রাক, বাংলাদেশ", en: "Tipper truck, Bangladesh" },
    credit: {
      author: "Shadman Samee",
      license: "CC BY-SA 2.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Hino_700_tipper,_Bangladesh._(33218725853).jpg",
    },
  },
} satisfies Record<string, Photo>;

export const heroSlides: Photo[] = [
  photos.bholaganj,
  photos.brickKiln,
  photos.jaflong,
  photos.brickMoulding,
];

/** Hero backdrop for each category page; unknown categories fall back to the river stones. */
const categoryHeroPhotos: Record<string, Photo> = {
  stone: photos.bholaganj,
  sand: photos.jaflong,
  bricks: photos.brickKiln,
  // TEMPORARY stand-ins until real bitumen, coal and iron photos arrive.
  bitumen: photos.tipperTruck,
  coal: photos.brickKiln,
  iron: photos.tipperTruck,
};

export const getCategoryHeroPhoto = (categoryId: string): Photo => categoryHeroPhotos[categoryId] ?? photos.bholaganj;
