import type { LocalizedText } from "@/types/i18n";
import type {
  ProductAttribute,
  ProductCategory,
  ProductOptionGroup,
  ProductVariant,
} from "@/types/product";

/**
 * AZMIR's catalogue (see README §2). Product lists come from the client. Stone sizes, bitumen grade and packing
 * were given by the client; the descriptions, sources and uses for stone, sand and bitumen are drafts that the
 * client still has to confirm. Do not add prices, stock or quality guarantees.
 *
 * Adding a category is a data-only change: add an entry here with a unique `id`/`slug`,
 * pick a `layout` and `icon`, and optionally a hero photo in `data/photos.ts` (`getCategoryHeroPhoto`).
 * Navigation, catalogue, home page, sitemap and the transportation page pick it up automatically.
 *
 * TEMPORARY stand-in images  replace with real product photos before launch:
 * - Indian L/C Stone → meghalaya-stone.jpg, Stone Chips → maddhapara-stone.jpg,
 *   Deshi Butu → bholaganj-river-stones.webp, Bojri → jaflong-stone-processing.webp
 * - Sand: the four sand photos are shared across the eight sources; Jaflong and Bholaganj use the hero photos
 * - Deshi Bricks → brick-moulding.webp, Block Bricks → brick-kiln.webp
 * - Coal (category and every variant) → brick-kiln.webp
 * - Iron (category and every variant) → tipper-truck.webp
 * - Bitumen (category and every variant) → tipper-truck.webp
 */
const STAND_IN = {
  coal: "/images/hero/brick-kiln.webp",
  iron: "/images/hero/tipper-truck.webp",
  bitumen: "/images/hero/tipper-truck.webp",
} as const;

// ---------------------------------------------------------------------------------------------------------------
// Bilingual building blocks. Values are written once in English digits and mirrored in Bangla digits.

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBanglaDigits = (text: string) =>
  text.replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]);

/** "20" → { en: "20 mm", bn: "২০ মিমি" }; also takes ranges such as "6–12". */
const mm = (size: string): LocalizedText => ({
  en: `${size} mm`,
  bn: `${toBanglaDigits(size)} মিমি`,
});
/** "3/4" → { en: '3/4"', bn: '৩/৪"' }; also takes ranges such as '6"–12'. */
const inch = (size: string): LocalizedText => ({
  en: `${size}"`,
  bn: `${toBanglaDigits(size)}"`,
});
const kgDrum = (kg: number): LocalizedText => ({
  en: `${kg} kg drum`,
  bn: `${toBanglaDigits(String(kg))} কেজি ড্রাম`,
});

const attribute = (
  label: LocalizedText,
  value: LocalizedText,
): ProductAttribute => ({ label, value });

const LABEL = {
  sizes: { en: "Available sizes", bn: "প্রাপ্য সাইজ" },
  grade: { en: "Grade", bn: "গ্রেড" },
  packing: { en: "Packing", bn: "প্যাকিং" },
  origin: { en: "Origin", bn: "উৎস" },
  source: { en: "Source", bn: "উৎস" },
  type: { en: "Type", bn: "ধরন" },
  use: { en: "Common use", bn: "সাধারণ ব্যবহার" },
  sizeGuide: { en: "Size guide", bn: "সাইজ নির্দেশিকা" },
  soldBy: { en: "Sold by", bn: "বিক্রির একক" },
} satisfies Record<string, LocalizedText>;

const SOLD_BY_CFT = attribute(LABEL.soldBy, {
  en: "CFT or by the truckload",
  bn: "সিএফটি বা ট্রাক হিসেবে",
});
const SOLD_BY_DRUM = attribute(LABEL.soldBy, {
  en: "By the drum",
  bn: "ড্রাম হিসেবে",
});

// ---------------------------------------------------------------------------------------------------------------
// Stone

/** Standard sizes for machine-crushed stone. */
const CRUSHED_SIZES: ProductOptionGroup = {
  label: LABEL.sizes,
  values: [inch("3/4"), mm("22"), mm("20"), mm("16"), mm("12"), mm("6")],
};

const CRUSHED_TYPE = attribute(LABEL.type, {
  en: "Crushed (machine-broken)",
  bn: "ভাঙা (মেশিনে ভাঙা)",
});
const CRUSHED_SIZE_GUIDE = attribute(LABEL.sizeGuide, {
  en: '3/4" and 20–22 mm for slabs, beams and columns; 12–16 mm for thinner casting; 6 mm for floor topping and finishing.',
  bn: 'ছাদ, বিম ও কলামের জন্য ৩/৪" ও ২০–২২ মিমি; পাতলা ঢালাইয়ের জন্য ১২–১৬ মিমি; ফ্লোর টপিং ও ফিনিশিংয়ের জন্য ৬ মিমি।',
});
const LOCAL_ORIGIN = attribute(LABEL.origin, {
  en: "Bangladesh (Sylhet region)",
  bn: "বাংলাদেশ (সিলেট অঞ্চল)",
});

type CrushedStone = Pick<
  ProductVariant,
  | "id"
  | "image"
  | "name"
  | "shortDescription"
  | "description"
  | "sortOrder"
  | "featured"
> & {
  origin: LocalizedText;
  use: LocalizedText;
};

/** A crushed stone: every one comes in the standard sizes and shares the size guide. */
const crushedStone = ({
  origin,
  use,
  ...variant
}: CrushedStone): ProductVariant => ({
  ...variant,
  slug: variant.id,
  options: [CRUSHED_SIZES],
  attributes: [
    attribute(LABEL.origin, origin),
    CRUSHED_TYPE,
    attribute(LABEL.use, use),
    CRUSHED_SIZE_GUIDE,
    SOLD_BY_CFT,
  ],
  isPublished: true,
});

const RCC_USE: LocalizedText = {
  en: "RCC casting: roof slabs, beams, columns and foundations",
  bn: "আরসিসি ঢালাই: ছাদ, বিম, কলাম ও ফাউন্ডেশন",
};

// ---------------------------------------------------------------------------------------------------------------
// Sand

type SandGrade = "coarse" | "medium";

const SAND_GRADE: Record<
  SandGrade,
  { type: LocalizedText; use: LocalizedText; useFor: LocalizedText }
> = {
  coarse: {
    type: { en: "Coarse river sand", bn: "মোটা দানার নদীর বালু" },
    use: { en: "Concrete casting and RCC work", bn: "ঢালাই ও আরসিসি কাজ" },
    useFor: {
      en: "concrete casting and RCC work",
      bn: "ঢালাই ও আরসিসি কাজের জন্য",
    },
  },
  medium: {
    type: { en: "Medium river sand", bn: "মাঝারি দানার নদীর বালু" },
    use: {
      en: "Brickwork, plaster and general construction",
      bn: "ইটের গাঁথুনি, প্লাস্টার ও সাধারণ নির্মাণ",
    },
    useFor: {
      en: "brickwork, plaster and general construction",
      bn: "ইটের গাঁথুনি, প্লাস্টার ও সাধারণ নির্মাণ কাজের জন্য",
    },
  },
};

type Sand = Pick<ProductVariant, "image" | "sortOrder" | "featured"> & {
  /** Slug stem, e.g. "bholaganj" → "bholaganj-sand". */
  key: string;
  /** Place name, e.g. { en: "Bholaganj", bn: "ভোলাগঞ্জ" }. */
  place: LocalizedText;
  /** Where it comes from, when more specific than the place name, e.g. "Bholaganj, Sylhet". */
  source?: LocalizedText;
  grade: SandGrade;
};

/** A sand named after its source, with grade, use and selling unit. */
const sand = ({
  key,
  place,
  source = place,
  grade,
  ...variant
}: Sand): ProductVariant => {
  const { type, use, useFor } = SAND_GRADE[grade];
  return {
    ...variant,
    id: `${key}-sand`,
    slug: `${key}-sand`,
    name: { en: `${place.en} Sand`, bn: `${place.bn} বালু` },
    shortDescription: {
      en: `${type.en} from ${source.en}, for ${useFor.en}.`,
      bn: `${source.bn}-এর ${type.bn}, ${useFor.bn}।`,
    },
    description: {
      en: `${place.en} sand is ${type.en.toLowerCase()} sourced from ${source.en}. It is well suited to ${useFor.en}, and we deliver it by truck straight to your site.`,
      bn: `${place.bn} বালু ${source.bn} থেকে সংগ্রহ করা ${type.bn}। এটি ${useFor.bn} উপযোগী, এবং আমরা ট্রাকে সরাসরি আপনার সাইটে পৌঁছে দিই।`,
    },
    attributes: [
      attribute(LABEL.source, source),
      attribute(LABEL.type, type),
      attribute(LABEL.use, use),
      SOLD_BY_CFT,
    ],
    isPublished: true,
  };
};

const SAND_IMAGE = {
  sylhet: "/images/sands/fine-aggregate-sylhet-sand.jpg",
  durgapur: "/images/sands/fine-aggregate-durgapur-sand.jpg",
  panchagarh: "/images/sands/fine-aggregate-panchagarh-sand.jpg",
  filling: "/images/sands/fine-aggregate-filling-sand.jpg",
} as const;

// ---------------------------------------------------------------------------------------------------------------
// Bitumen

const BITUMEN_OPTIONS: ProductOptionGroup[] = [
  { label: LABEL.grade, values: [{ en: "60/70", bn: "৬০/৭০" }] },
  { label: LABEL.packing, values: [kgDrum(150), kgDrum(180)] },
];

const BITUMEN_USE = attribute(LABEL.use, {
  en: "Road carpeting, paving and waterproofing",
  bn: "রাস্তার কার্পেটিং, পেভিং ও ওয়াটারপ্রুফিং",
});

type PavingBitumen = Pick<
  ProductVariant,
  "id" | "name" | "sortOrder" | "featured"
> & { origin: LocalizedText };

/** A penetration-grade 60/70 bitumen in 150 kg and 180 kg drums. */
const pavingBitumen = ({
  origin,
  ...variant
}: PavingBitumen): ProductVariant => ({
  ...variant,
  slug: variant.id,
  image: STAND_IN.bitumen,
  shortDescription: {
    en: "Penetration grade 60/70 bitumen in 150 kg and 180 kg drums.",
    bn: "১৫০ কেজি ও ১৮০ কেজি ড্রামে পেনিট্রেশন গ্রেড ৬০/৭০ বিটুমিন।",
  },
  description: {
    en: `${variant.name.en} is penetration grade 60/70 bitumen from ${origin.en}, the grade most used for road carpeting in Bangladesh. It comes in 150 kg and 180 kg drums.`,
    bn: `${variant.name.bn} ${origin.bn}-এর পেনিট্রেশন গ্রেড ৬০/৭০ বিটুমিন, যা বাংলাদেশে রাস্তার কার্পেটিংয়ে সবচেয়ে বেশি ব্যবহৃত গ্রেড। এটি ১৫০ কেজি ও ১৮০ কেজি ড্রামে পাওয়া যায়।`,
  },
  options: BITUMEN_OPTIONS,
  // The sentence reads "from the UAE"; the table cell drops the article.
  attributes: [
    attribute(LABEL.origin, { ...origin, en: origin.en.replace(/^the /, "") }),
    BITUMEN_USE,
    SOLD_BY_DRUM,
  ],
  isPublished: true,
});

// ---------------------------------------------------------------------------------------------------------------

export const categories: ProductCategory[] = [
  {
    id: "stone",
    slug: "stone",
    layout: "mosaic",
    icon: "stone",
    image: "/images/stones/pakur-stone.jpg",
    name: { bn: "পাথর চিপস", en: "Stone Chips" },
    shortName: { bn: "পাথর", en: "Stone" },
    description: {
      bn: 'ভারতীয়, দুবাই, ভুটান ও দেশি পাথর: ৩/৪" থেকে ৬ মিমি পর্যন্ত বিভিন্ন সাইজের ভাঙা পাথর, সাথে বোল্ডার, বুটু, সিঙ্গেল ও বজরী।',
      en: 'Indian, Dubai, Bhutan and local stone: crushed stone from 3/4" down to 6 mm, plus boulder, butu, single and bojri.',
    },
    isPublished: true,
    sortOrder: 1,
    variants: [
      crushedStone({
        id: "indian-pakur-stone",
        image: "/images/stones/pakur-stone.jpg",
        name: { bn: "ইন্ডিয়ান পাকুড় পাথর", en: "Indian Pakur Stone" },
        shortDescription: {
          en: "Hard black crushed stone from Pakur, India, in standard sizes.",
          bn: "ভারতের পাকুড়ের শক্ত কালো ভাঙা পাথর, বিভিন্ন স্ট্যান্ডার্ড সাইজে।",
        },
        description: {
          en: "Pakur stone is a dense black stone widely used in Bangladesh for RCC work. We supply it crushed and graded to the size your mix calls for.",
          bn: "পাকুড় পাথর একটি ঘন কালো পাথর, যা বাংলাদেশে আরসিসি কাজে ব্যাপকভাবে ব্যবহৃত হয়। আপনার মিশ্রণের প্রয়োজন অনুযায়ী সাইজে ভাঙা ও বাছাই করে আমরা সরবরাহ করি।",
        },
        origin: { en: "Pakur, India", bn: "পাকুড়, ভারত" },
        use: RCC_USE,
        featured: true,
        sortOrder: 1,
      }),
      crushedStone({
        id: "dubai-stone",
        image: "/images/stones/dubai-stone.jpg",
        name: { bn: "দুবাই পাথর", en: "Dubai Stone" },
        shortDescription: {
          en: "Imported crushed stone from the UAE, graded by size.",
          bn: "সংযুক্ত আরব আমিরাত থেকে আমদানিকৃত ভাঙা পাথর, সাইজ অনুযায়ী বাছাই করা।",
        },
        description: {
          en: "Dubai stone is imported crushed stone with a clean, even grading. It is a popular choice for RCC and general concrete work.",
          bn: "দুবাই পাথর পরিষ্কার ও সমান গ্রেডিংয়ের আমদানিকৃত ভাঙা পাথর। আরসিসি ও সাধারণ ঢালাই কাজে এটি বেশ জনপ্রিয়।",
        },
        origin: { en: "UAE (Dubai)", bn: "সংযুক্ত আরব আমিরাত (দুবাই)" },
        use: {
          en: "RCC and general concrete work",
          bn: "আরসিসি ও সাধারণ ঢালাই কাজ",
        },
        sortOrder: 2,
      }),
      crushedStone({
        id: "bhutan-stone",
        image: "/images/stones/bhutan-torsa-stone.jpg",
        name: { bn: "ভুটান পাথর", en: "Bhutan Stone" },
        shortDescription: {
          en: "River stone from Bhutan, crushed to standard sizes.",
          bn: "ভুটানের নদীর পাথর, স্ট্যান্ডার্ড সাইজে ভাঙা।",
        },
        description: {
          en: "Bhutan stone is hard river stone brought in from Bhutan and crushed to standard sizes for casting and road work.",
          bn: "ভুটান পাথর ভুটান থেকে আনা শক্ত নদীর পাথর, যা ঢালাই ও রাস্তার কাজের জন্য স্ট্যান্ডার্ড সাইজে ভাঙা হয়।",
        },
        origin: { en: "Bhutan", bn: "ভুটান" },
        use: {
          en: "RCC casting and road work",
          bn: "আরসিসি ঢালাই ও রাস্তার কাজ",
        },
        sortOrder: 3,
      }),
      crushedStone({
        id: "indian-lc-stone",
        image: "/images/stones/meghalaya-stone.jpg",
        name: { bn: "ইন্ডিয়ান এলসি পাথর", en: "Indian L/C Stone" },
        shortDescription: {
          en: "Indian stone imported under letter of credit, crushed to standard sizes.",
          bn: "এলসির মাধ্যমে আমদানিকৃত ভারতীয় পাথর, স্ট্যান্ডার্ড সাইজে ভাঙা।",
        },
        description: {
          en: "L/C stone is Indian stone imported under a letter of credit through the land ports. It is crushed and graded to the standard sizes for concrete work.",
          bn: "এলসি পাথর হলো স্থলবন্দর দিয়ে এলসির মাধ্যমে আমদানিকৃত ভারতীয় পাথর। ঢালাই কাজের জন্য এটি স্ট্যান্ডার্ড সাইজে ভাঙা ও বাছাই করা হয়।",
        },
        origin: {
          en: "India (imported under L/C)",
          bn: "ভারত (এলসির মাধ্যমে আমদানিকৃত)",
        },
        use: RCC_USE,
        sortOrder: 4,
      }),
      crushedStone({
        id: "stone-chips",
        image: "/images/stones/maddhapara-stone.jpg",
        name: { bn: "পাথর চিপস", en: "Stone Chips" },
        shortDescription: {
          en: "Everyday crushed stone chips for general concrete work.",
          bn: "সাধারণ ঢালাই কাজের জন্য ভাঙা পাথরের চিপস।",
        },
        description: {
          en: "Crushed stone chips for general concrete, floor casting and road work, graded to the standard sizes.",
          bn: "সাধারণ ঢালাই, ফ্লোর ঢালাই ও রাস্তার কাজের জন্য স্ট্যান্ডার্ড সাইজে বাছাই করা ভাঙা পাথরের চিপস।",
        },
        origin: { en: "Local and imported", bn: "দেশি ও আমদানিকৃত" },
        use: {
          en: "General concrete, floor casting and road work",
          bn: "সাধারণ ঢালাই, ফ্লোর ঢালাই ও রাস্তার কাজ",
        },
        sortOrder: 5,
      }),
      {
        id: "deshi-boulder",
        slug: "deshi-boulder",
        image: "/images/stones/boulder-stone.jpg",
        name: { bn: "দেশি বোল্ডার", en: "Deshi Boulder" },
        shortDescription: {
          en: "Large uncrushed local stone for foundations, protection work and crushing.",
          bn: "ফাউন্ডেশন, প্রতিরক্ষা কাজ ও ভাঙার জন্য বড় আকারের দেশি পাথর।",
        },
        description: {
          en: "Deshi boulder is large, uncrushed stone from the rivers of the Sylhet region. It is used whole for foundations and river bank protection, or crushed into chips.",
          bn: "দেশি বোল্ডার সিলেট অঞ্চলের নদী থেকে আসা বড়, না-ভাঙা পাথর। এটি ফাউন্ডেশন ও নদীতীর রক্ষার কাজে আস্ত ব্যবহার করা হয়, অথবা ভেঙে চিপস তৈরি করা হয়।",
        },
        options: [{ label: LABEL.sizes, values: [inch('6"–12')] }],
        attributes: [
          LOCAL_ORIGIN,
          attribute(LABEL.type, {
            en: "Uncrushed boulder",
            bn: "না-ভাঙা বোল্ডার",
          }),
          attribute(LABEL.use, {
            en: "Foundation filling, river bank protection and crushing into chips",
            bn: "ফাউন্ডেশন ভরাট, নদীতীর রক্ষা ও ভেঙে চিপস তৈরি",
          }),
          SOLD_BY_CFT,
        ],
        isPublished: true,
        sortOrder: 6,
      },
      {
        id: "deshi-butu",
        slug: "deshi-butu",
        image: "/images/hero/bholaganj-river-stones.webp",
        name: { bn: "দেশি বুটু", en: "Deshi Butu" },
        shortDescription: {
          en: "Natural rounded river stone from local rivers.",
          bn: "দেশি নদীর প্রাকৃতিক গোল পাথর।",
        },
        description: {
          en: "Butu is natural, rounded river stone collected from local rivers and supplied in mixed natural sizes.",
          bn: "বুটু হলো দেশি নদী থেকে সংগ্রহ করা প্রাকৃতিক গোল পাথর, যা প্রাকৃতিক মিশ্র সাইজে সরবরাহ করা হয়।",
        },
        options: [
          {
            label: LABEL.sizes,
            values: [{ en: "Mixed natural sizes", bn: "প্রাকৃতিক মিশ্র সাইজ" }],
          },
        ],
        attributes: [
          LOCAL_ORIGIN,
          attribute(LABEL.type, {
            en: "Natural round stone",
            bn: "প্রাকৃতিক গোল পাথর",
          }),
          attribute(LABEL.use, {
            en: "Foundation and filling work, drainage and landscaping",
            bn: "ফাউন্ডেশন ও ভরাট কাজ, ড্রেনেজ ও ল্যান্ডস্কেপিং",
          }),
          SOLD_BY_CFT,
        ],
        isPublished: true,
        sortOrder: 7,
      },
      {
        id: "single-stone",
        slug: "single-stone",
        image: "/images/stones/singles-stone.jpg",
        name: { bn: "সিঙ্গেল পাথর", en: "Single Stone" },
        shortDescription: {
          en: 'Broken local stone between 3/4" and 1.5".',
          bn: '৩/৪" থেকে ১.৫" সাইজের ভাঙা দেশি পাথর।',
        },
        description: {
          en: 'Single stone is local stone broken to between 3/4" and 1.5", used in foundation concrete and road base work.',
          bn: 'সিঙ্গেল পাথর ৩/৪" থেকে ১.৫" সাইজে ভাঙা দেশি পাথর, যা ফাউন্ডেশন ঢালাই ও রাস্তার বেস তৈরিতে ব্যবহৃত হয়।',
        },
        options: [{ label: LABEL.sizes, values: [inch('3/4"–1.5')] }],
        attributes: [
          LOCAL_ORIGIN,
          attribute(LABEL.type, {
            en: "Broken single stone",
            bn: "ভাঙা সিঙ্গেল পাথর",
          }),
          attribute(LABEL.use, {
            en: "Foundation concrete and road base",
            bn: "ফাউন্ডেশন ঢালাই ও রাস্তার বেস",
          }),
          SOLD_BY_CFT,
        ],
        isPublished: true,
        sortOrder: 8,
      },
      {
        id: "bojri",
        slug: "bojri",
        image: "/images/hero/jaflong-stone-processing.webp",
        name: { bn: "বজরী", en: "Bojri (Gravel)" },
        shortDescription: {
          en: "Small gravel for lean concrete, floor casting and drainage.",
          bn: "লিন ঢালাই, ফ্লোর ঢালাই ও ড্রেনেজের জন্য ছোট নুড়ি পাথর।",
        },
        description: {
          en: "Bojri is small gravel between 6 and 12 mm, used in lean concrete, floor casting and drainage layers.",
          bn: "বজরী ৬ থেকে ১২ মিমি সাইজের ছোট নুড়ি পাথর, যা লিন ঢালাই, ফ্লোর ঢালাই ও ড্রেনেজ স্তরে ব্যবহৃত হয়।",
        },
        options: [{ label: LABEL.sizes, values: [mm("6–12")] }],
        attributes: [
          LOCAL_ORIGIN,
          attribute(LABEL.type, { en: "Gravel", bn: "নুড়ি পাথর" }),
          attribute(LABEL.use, {
            en: "Lean concrete, floor casting and drainage layers",
            bn: "লিন ঢালাই, ফ্লোর ঢালাই ও ড্রেনেজ স্তর",
          }),
          SOLD_BY_CFT,
        ],
        isPublished: true,
        sortOrder: 9,
      },
    ],
  },
  {
    id: "sand",
    slug: "sand",
    layout: "panels",
    icon: "sand",
    image: SAND_IMAGE.sylhet,
    name: { bn: "বালু", en: "Sand" },
    shortName: { bn: "বালু", en: "Sand" },
    description: {
      bn: "সিলেট ও অন্যান্য উৎসের নদীর বালু: ঢালাই, গাঁথুনি, প্লাস্টার ও ভরাট কাজের জন্য।",
      en: "River sand from Sylhet and other sources, for concrete, brickwork, plaster and filling.",
    },
    isPublished: true,
    sortOrder: 2,
    variants: [
      sand({
        key: "fazilpur",
        place: { en: "Fazilpur", bn: "ফাজিলপুর" },
        grade: "medium",
        image: SAND_IMAGE.panchagarh,
        featured: true,
        sortOrder: 1,
      }),
      sand({
        key: "durgapur",
        place: { en: "Durgapur", bn: "দুর্গাপুর" },
        source: { en: "Durgapur, Netrokona", bn: "দুর্গাপুর, নেত্রকোনা" },
        grade: "coarse",
        image: SAND_IMAGE.durgapur,
        sortOrder: 2,
      }),
      sand({
        key: "sunamganj",
        place: { en: "Sunamganj", bn: "সুনামগঞ্জ" },
        grade: "coarse",
        image: SAND_IMAGE.sylhet,
        sortOrder: 3,
      }),
      sand({
        key: "chhatak",
        place: { en: "Chhatak", bn: "ছাতক" },
        source: { en: "Chhatak, Sunamganj", bn: "ছাতক, সুনামগঞ্জ" },
        grade: "coarse",
        image: SAND_IMAGE.filling,
        sortOrder: 4,
      }),
      sand({
        key: "sharighat",
        place: { en: "Sharighat", bn: "সারিঘাট" },
        source: { en: "Sharighat, Sylhet", bn: "সারিঘাট, সিলেট" },
        grade: "coarse",
        image: SAND_IMAGE.sylhet,
        sortOrder: 5,
      }),
      sand({
        key: "perighat",
        place: { en: "Perighat", bn: "ফেরিঘাট" },
        grade: "medium",
        image: SAND_IMAGE.panchagarh,
        sortOrder: 6,
      }),
      sand({
        key: "jaflong",
        place: { en: "Jaflong", bn: "জাফলং" },
        source: { en: "Jaflong, Sylhet", bn: "জাফলং, সিলেট" },
        grade: "coarse",
        image: "/images/hero/jaflong-stone-processing.webp",
        sortOrder: 7,
      }),
      sand({
        key: "bholaganj",
        place: { en: "Bholaganj", bn: "ভোলাগঞ্জ" },
        source: { en: "Bholaganj, Sylhet", bn: "ভোলাগঞ্জ, সিলেট" },
        grade: "coarse",
        image: "/images/hero/bholaganj-river-stones.webp",
        sortOrder: 8,
      }),
    ],
  },
  {
    id: "bitumen",
    slug: "bitumen",
    layout: "showcase",
    icon: "bitumen",
    image: STAND_IN.bitumen,
    name: { bn: "বিটুমিন", en: "Bitumen" },
    shortName: { bn: "বিটুমিন", en: "Bitumen" },
    description: {
      bn: "১৫০ কেজি ও ১৮০ কেজি ড্রামে ৬০/৭০ গ্রেডের বিটুমিন, সাথে লিকুইড বিটুমিন।",
      en: "Grade 60/70 bitumen in 150 kg and 180 kg drums, plus liquid bitumen.",
    },
    isPublished: true,
    sortOrder: 3,
    variants: [
      pavingBitumen({
        id: "irani-bitumen",
        name: { bn: "ইরানি বিটুমিন", en: "Irani Bitumen" },
        origin: { en: "Iran", bn: "ইরান" },
        featured: true,
        sortOrder: 1,
      }),
      pavingBitumen({
        id: "dubai-bitumen",
        name: { bn: "দুবাই বিটুমিন", en: "Dubai Bitumen" },
        origin: { en: "the UAE (Dubai)", bn: "সংযুক্ত আরব আমিরাত (দুবাই)" },
        sortOrder: 2,
      }),
      pavingBitumen({
        id: "basundhara-bitumen",
        name: { bn: "বসুন্ধরা বিটুমিন", en: "Basundhara Bitumen" },
        origin: { en: "Bangladesh (Basundhara)", bn: "বাংলাদেশ (বসুন্ধরা)" },
        sortOrder: 3,
      }),
      pavingBitumen({
        id: "bangla-bitumen",
        name: { bn: "বাংলা বিটুমিন", en: "Bangla Bitumen" },
        origin: { en: "Bangladesh", bn: "বাংলাদেশ" },
        sortOrder: 4,
      }),
      {
        id: "liquid-bitumen",
        slug: "liquid-bitumen",
        image: STAND_IN.bitumen,
        name: { bn: "লিকুইড বিটুমিন", en: "Liquid Bitumen" },
        shortDescription: {
          en: "Cutback bitumen for prime and tack coats, in drums.",
          bn: "প্রাইম কোট ও ট্যাক কোটের জন্য কাটব্যাক বিটুমিন, ড্রামে।",
        },
        description: {
          en: "Liquid bitumen is cutback bitumen sprayed as a prime coat or tack coat before carpeting, so the new layer bonds to the road base.",
          bn: "লিকুইড বিটুমিন হলো কাটব্যাক বিটুমিন, যা কার্পেটিংয়ের আগে প্রাইম কোট বা ট্যাক কোট হিসেবে ছিটানো হয়, যাতে নতুন স্তর রাস্তার বেসের সাথে ভালোভাবে আটকে থাকে।",
        },
        options: [
          { label: LABEL.packing, values: [{ en: "Drum", bn: "ড্রাম" }] },
        ],
        attributes: [
          attribute(LABEL.type, {
            en: "Cutback (liquid) bitumen",
            bn: "কাটব্যাক (তরল) বিটুমিন",
          }),
          attribute(LABEL.use, {
            en: "Prime coat and tack coat before carpeting",
            bn: "কার্পেটিংয়ের আগে প্রাইম কোট ও ট্যাক কোট",
          }),
          SOLD_BY_DRUM,
        ],
        isPublished: true,
        sortOrder: 5,
      },
    ],
  },
  {
    id: "coal",
    slug: "coal",
    compact: true,
    layout: "panels",
    icon: "coal",
    image: STAND_IN.coal,
    name: { bn: "কয়লা", en: "Coal" },
    shortName: { bn: "কয়লা", en: "Coal" },
    description: {
      bn: "বিভিন্ন উৎস ও মানের কয়লা।",
      en: "Coal of different origins and grades.",
    },
    isPublished: true,
    sortOrder: 4,
    variants: [
      {
        id: "bangla-coal",
        slug: "bangla-coal",
        image: STAND_IN.coal,
        name: { bn: "বাংলা কয়লা", en: "Bangla Coal" },
        isPublished: true,
        featured: true,
        sortOrder: 1,
      },
      {
        id: "indonesian-coal",
        slug: "indonesian-coal",
        image: STAND_IN.coal,
        name: { bn: "ইন্দোনেশিয়ান কয়লা", en: "Indonesian Coal" },
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: "indian-super-coal",
        slug: "indian-super-coal",
        image: STAND_IN.coal,
        name: { bn: "ইন্ডিয়ান সুপার কয়লা", en: "Indian Super Coal" },
        isPublished: true,
        sortOrder: 3,
      },
      {
        id: "high-super-coal",
        slug: "high-super-coal",
        image: STAND_IN.coal,
        name: { bn: "হাই সুপার কয়লা", en: "High Super Coal" },
        isPublished: true,
        sortOrder: 4,
      },
    ],
  },
  {
    id: "iron",
    slug: "iron",
    compact: true,
    layout: "showcase",
    icon: "iron",
    image: STAND_IN.iron,
    name: { bn: "রড", en: "Iron" },
    shortName: { bn: "রড", en: "Iron" },
    description: {
      bn: "নির্মাণ কাজের জন্য বিভিন্ন প্রস্তুতকারকের রড।",
      en: "Iron rods from different manufacturers for construction work.",
    },
    isPublished: true,
    sortOrder: 5,
    variants: [
      {
        id: "bsrm-rod",
        slug: "bsrm-rod",
        image: STAND_IN.iron,
        name: { bn: "বিএসআরএম রড", en: "BSRM" },
        isPublished: true,
        featured: true,
        sortOrder: 1,
      },
      {
        id: "csrm-rod",
        slug: "csrm-rod",
        image: STAND_IN.iron,
        name: { bn: "সিএসআরএম রড", en: "CSRM" },
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: "ksrm-rod",
        slug: "ksrm-rod",
        image: STAND_IN.iron,
        name: { bn: "কেএসআরএম রড", en: "KSRM" },
        isPublished: true,
        sortOrder: 3,
      },
      {
        id: "aks-rod",
        slug: "aks-rod",
        image: STAND_IN.iron,
        name: { bn: "একেএস রড", en: "AKS" },
        isPublished: true,
        sortOrder: 4,
      },
      {
        id: "gph-rod",
        slug: "gph-rod",
        image: STAND_IN.iron,
        name: { bn: "জিপিএইচ রড", en: "GPH" },
        isPublished: true,
        sortOrder: 5,
      },
      {
        id: "bangla-rod",
        slug: "bangla-rod",
        image: STAND_IN.iron,
        name: { bn: "বাংলা রড", en: "Bangla" },
        isPublished: true,
        sortOrder: 6,
      },
      {
        id: "bikrampur-rod",
        slug: "bikrampur-rod",
        image: STAND_IN.iron,
        name: { bn: "বিক্রমপুর রড", en: "Bikrampur" },
        isPublished: true,
        sortOrder: 7,
      },
    ],
  },
  {
    id: "bricks",
    slug: "bricks",
    compact: true,
    layout: "spotlight",
    icon: "bricks",
    image: "/images/bricks/auto-bricks.jpg",
    name: { bn: "ইট", en: "Bricks" },
    shortName: { bn: "ইট", en: "Bricks" },
    description: {
      bn: "নির্মাণ কাজের জন্য অটো, দেশি ও ব্লক ইট।",
      en: "Auto, deshi and block bricks for construction work.",
    },
    isPublished: true,
    sortOrder: 6,
    variants: [
      {
        id: "auto-bricks",
        slug: "auto-bricks",
        image: "/images/bricks/auto-bricks.jpg",
        name: { bn: "অটো ইট", en: "Auto Bricks" },
        isPublished: true,
        featured: true,
        sortOrder: 1,
      },
      {
        id: "deshi-bricks",
        slug: "deshi-bricks",
        image: "/images/hero/brick-moulding.webp",
        name: { bn: "দেশি ইট", en: "Deshi Bricks" },
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: "block-bricks",
        slug: "block-bricks",
        image: "/images/hero/brick-kiln.webp",
        name: { bn: "ব্লক ইট", en: "Block Bricks" },
        isPublished: true,
        sortOrder: 3,
      },
    ],
  },
];
