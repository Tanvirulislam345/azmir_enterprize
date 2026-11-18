import type { AboutPage, LeaderMessage, Team } from "@/types/about";

/**
 * About section content.
 *
 * DRAFT  replace before launch:
 * - The Managing Director's message, vision, mission and goals are a professional draft written for review.
 *   They must be approved (or rewritten) by MD. Radowan Hossen.
 * - The Bangla spelling of his name ("মোঃ রাদোয়ান হোসেন") needs confirmation.
 * - No photo yet: add `photo: "/images/team/radowan-hossen.webp"` (portrait, about 4:5) when it arrives.
 *
 * PLACEHOLDER  replace before launch:
 * - IT Support Team member names are placeholders (the roles are confirmed).
 *
 * Adding an About page: add an entry to `aboutPages` (kind "message" or "team") and its content below;
 * the About menu, mobile drawer, about sub-nav, overview cards and sitemap pick it up automatically.
 */
export const aboutPages: AboutPage[] = [
  {
    id: "managing-director",
    slug: "managing-director",
    kind: "message",
    icon: "user",
    title: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" },
    summary: {
      en: "A message from MD. Radowan Hossen",
      bn: "মোঃ রাদোয়ান হোসেনের বার্তা",
    },
    sortOrder: 1,
  },
  {
    id: "it-support",
    slug: "it-support",
    kind: "team",
    icon: "headset",
    title: { en: "IT Support Team", bn: "আইটি সাপোর্ট টিম" },
    summary: {
      en: "The people behind our digital services",
      bn: "আমাদের ডিজিটাল সেবার পেছনের মানুষেরা",
    },
    sortOrder: 2,
  },
];

export const managingDirector: LeaderMessage = {
  person: {
    id: "radowan-hossen",
    name: { en: "MD. Radowan Hossen", bn: "মোঃ রাদোয়ান হোসেন" },
    role: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" },
    initials: "RH",
  },
  greeting: { en: "Assalamualaikum,", bn: "আসসালামু আলাইকুম," },
  paragraphs: [
    {
      en: "Thank you for taking the time to learn about M/S. AZMIR ENTERPRIZE. Every structure that stands strong begins with the right materials, delivered on time. That simple idea has guided us since the day we started, and it still shapes every order we take.",
      bn: "এম/এস. আজমির এন্টারপ্রাইজ সম্পর্কে জানতে সময় দেওয়ার জন্য আপনাকে ধন্যবাদ। প্রতিটি মজবুত স্থাপনার শুরু হয় সঠিক নির্মাণসামগ্রী দিয়ে, যা সময়মতো পৌঁছে যায়। এই সহজ ভাবনাই শুরু থেকে আমাদের পথ দেখিয়েছে, এবং আজও আমাদের প্রতিটি অর্ডারে তা প্রতিফলিত হয়।",
    },
    {
      en: "We supply stone, sand, bitumen, coal, iron rod and bricks, and we arrange the transportation that carries them to your site. Our customers are contractors, developers, engineers and builders who cannot afford delays or surprises, so we work to keep our information clear, our communication direct and our commitments realistic.",
      bn: "আমরা পাথর, বালু, বিটুমিন, কয়লা, রড ও ইট সরবরাহ করি এবং সেগুলো আপনার সাইটে পৌঁছে দিতে পরিবহনের ব্যবস্থা করি। আমাদের ক্রেতারা ঠিকাদার, ডেভেলপার, প্রকৌশলী ও নির্মাতা, যাদের কাজে দেরি বা অনিশ্চয়তার সুযোগ নেই। তাই আমরা তথ্য স্পষ্ট রাখতে, সরাসরি যোগাযোগ করতে এবং বাস্তবসম্মত প্রতিশ্রুতি দিতে কাজ করি।",
    },
    {
      en: "Our strength is the trust of the people we work with. We believe that honest dealing and consistent quality build relationships that last far longer than a single project, and we measure our success by how often our customers come back to us.",
      bn: "যাদের সাথে আমরা কাজ করি, তাদের আস্থাই আমাদের শক্তি। আমরা বিশ্বাস করি সৎ লেনদেন ও ধারাবাহিক মান এমন সম্পর্ক গড়ে তোলে যা একটি প্রকল্পের চেয়ে অনেক বেশি দিন টিকে থাকে, এবং ক্রেতারা কতবার আমাদের কাছে ফিরে আসেন, তা দিয়েই আমরা আমাদের সাফল্য মাপি।",
    },
    {
      en: "As we grow, our focus stays the same: reliable supply, fair dealing and service that makes your work easier. I invite you to explore our products and to talk to our team about your next project.",
      bn: "আমরা যত বড় হচ্ছি, আমাদের মনোযোগ একই থাকছে: নির্ভরযোগ্য সরবরাহ, ন্যায্য লেনদেন এবং এমন সেবা যা আপনার কাজ সহজ করে। আমাদের পণ্যগুলো দেখতে এবং আপনার পরবর্তী প্রকল্প নিয়ে আমাদের টিমের সাথে কথা বলতে আপনাকে আমন্ত্রণ জানাই।",
    },
  ],
  quote: {
    en: "Every structure that stands strong begins with the right materials, delivered on time.",
    bn: "প্রতিটি মজবুত স্থাপনার শুরু হয় সঠিক নির্মাণসামগ্রী দিয়ে, যা সময়মতো পৌঁছে যায়।",
  },
  closing: { en: "Thank you.", bn: "ধন্যবাদ।" },
  vision: {
    en: "To be a trusted name in construction material supply in Bangladesh, known for dependable quality and service.",
    bn: "নির্ভরযোগ্য মান ও সেবার জন্য বাংলাদেশে নির্মাণসামগ্রী সরবরাহে একটি আস্থার নাম হয়ে ওঠা।",
  },
  mission: {
    en: "To supply the right construction materials and arrange their transport with clear information, fair dealing and direct communication, so our customers can build with confidence.",
    bn: "স্পষ্ট তথ্য, ন্যায্য লেনদেন ও সরাসরি যোগাযোগের মাধ্যমে সঠিক নির্মাণসামগ্রী সরবরাহ ও পরিবহনের ব্যবস্থা করা, যাতে আমাদের ক্রেতারা আস্থার সাথে নির্মাণ করতে পারেন।",
  },
  goals: [
    {
      title: { en: "Consistent quality", bn: "ধারাবাহিক মান" },
      text: {
        en: "Supply materials that meet what was agreed, order after order.",
        bn: "প্রতিটি অর্ডারে যা নির্ধারিত হয়েছে সেই অনুযায়ী পণ্য সরবরাহ করা।",
      },
    },
    {
      title: { en: "Reliable delivery", bn: "নির্ভরযোগ্য ডেলিভারি" },
      text: {
        en: "Arrange transport that gets materials to site when they are needed.",
        bn: "প্রয়োজনের সময় সাইটে পণ্য পৌঁছাতে পরিবহনের ব্যবস্থা করা।",
      },
    },
    {
      title: { en: "Honest dealing", bn: "সৎ লেনদেন" },
      text: {
        en: "Give clear information and realistic commitments from the first enquiry.",
        bn: "প্রথম জিজ্ঞাসা থেকেই স্পষ্ট তথ্য ও বাস্তবসম্মত প্রতিশ্রুতি দেওয়া।",
      },
    },
    {
      title: { en: "Growing together", bn: "একসাথে এগিয়ে চলা" },
      text: {
        en: "Build long-term relationships and grow alongside our customers.",
        bn: "দীর্ঘমেয়াদি সম্পর্ক গড়ে তোলা এবং ক্রেতাদের সাথে একসাথে এগিয়ে যাওয়া।",
      },
    },
  ],
};

export const itSupportTeam: Team = {
  intro: {
    en: "Our IT Support Team builds and maintains our website and online catalogue, keeps our servers running and our data secure, and builds software projects of any kind  from SaaS products to HRM and ERP systems and AI integration.",
    bn: "আমাদের আইটি সাপোর্ট টিম ওয়েবসাইট ও অনলাইন পণ্যতালিকা তৈরি ও রক্ষণাবেক্ষণ করে, সার্ভার সচল ও তথ্য সুরক্ষিত রাখে, এবং যেকোনো ধরনের সফটওয়্যার প্রকল্প তৈরি করে  সাস প্রোডাক্ট থেকে শুরু করে এইচআরএম, ইআরপি সিস্টেম ও এআই ইন্টিগ্রেশন পর্যন্ত।",
  },
  responsibilities: [
    {
      icon: "globe",
      title: {
        en: "Website & online catalogue",
        bn: "ওয়েবসাইট ও অনলাইন পণ্যতালিকা",
      },
      text: {
        en: "Building and updating our pages and product information.",
        bn: "আমাদের পেজ ও পণ্যের তথ্য তৈরি ও হালনাগাদ করা।",
      },
    },
    {
      icon: "wrench",
      title: { en: "Website maintenance", bn: "ওয়েবসাইট রক্ষণাবেক্ষণ" },
      text: {
        en: "Updates, fixes and performance, so the site stays fast and available.",
        bn: "আপডেট, সমস্যা সমাধান ও পারফরম্যান্স, যাতে সাইট দ্রুত ও সবসময় সচল থাকে।",
      },
    },
    {
      icon: "server",
      title: { en: "Server maintenance", bn: "সার্ভার রক্ষণাবেক্ষণ" },
      text: {
        en: "Hosting, monitoring, backups and updates for our servers.",
        bn: "সার্ভারের হোস্টিং, মনিটরিং, ব্যাকআপ ও আপডেট।",
      },
    },
    {
      icon: "data",
      title: { en: "Data & security", bn: "তথ্য ও নিরাপত্তা" },
      text: {
        en: "Protecting business records and customer information.",
        bn: "ব্যবসায়িক নথি ও ক্রেতার তথ্য সুরক্ষিত রাখা।",
      },
    },
  ],
  capabilities: [
    {
      icon: "cloud",
      title: { en: "SaaS products", bn: "সাস প্রোডাক্ট" },
      text: {
        en: "Cloud software that businesses subscribe to and use from anywhere.",
        bn: "ক্লাউড সফটওয়্যার, যা প্রতিষ্ঠানগুলো সাবস্ক্রাইব করে যেকোনো জায়গা থেকে ব্যবহার করে।",
      },
    },
    {
      icon: "boxes",
      title: { en: "HRM & ERP systems", bn: "এইচআরএম ও ইআরপি সিস্টেম" },
      text: {
        en: "People, payroll, inventory, sales and accounts  managed in one system.",
        bn: "কর্মী, বেতন, ইনভেন্টরি, বিক্রয় ও হিসাব  এক সিস্টেমে পরিচালনা।",
      },
    },
    {
      icon: "sparkles",
      title: { en: "AI integration", bn: "এআই ইন্টিগ্রেশন" },
      text: {
        en: "Adding AI features such as assistants and automation to existing software.",
        bn: "বিদ্যমান সফটওয়্যারে অ্যাসিস্ট্যান্ট ও অটোমেশনের মতো এআই সুবিধা যুক্ত করা।",
      },
    },
    {
      icon: "code",
      title: { en: "Custom projects", bn: "কাস্টম প্রকল্প" },
      text: {
        en: "Any software your business needs, designed and built to fit how you work.",
        bn: "আপনার প্রতিষ্ঠানের প্রয়োজনীয় যেকোনো সফটওয়্যার, আপনার কাজের ধরন অনুযায়ী ডিজাইন ও তৈরি।",
      },
    },
  ],
  members: [
    {
      id: "lead-software-engineer",
      name: { en: "Team member name", bn: "সদস্যের নাম" },
      role: { en: "Lead Software Engineer", bn: "লিড সফটওয়্যার ইঞ্জিনিয়ার" },
      initials: "LS",
    },
    {
      id: "devops-engineer",
      name: { en: "Team member name", bn: "সদস্যের নাম" },
      role: { en: "DevOps Engineer", bn: "ডেভঅপস ইঞ্জিনিয়ার" },
      initials: "DO",
    },
    {
      id: "software-engineer",
      name: { en: "Team member name", bn: "সদস্যের নাম" },
      role: { en: "Software Engineer", bn: "সফটওয়্যার ইঞ্জিনিয়ার" },
      initials: "SE",
    },
    {
      id: "sqa-engineer",
      name: { en: "Team member name", bn: "সদস্যের নাম" },
      role: { en: "SQA Engineer", bn: "এসকিউএ ইঞ্জিনিয়ার" },
      initials: "QA",
    },
  ],
  contact: {
    phone: {
      id: "it-support",
      number: "01647169052",
      international: "+8801647169052",
      channels: ["call", "whatsapp"],
    },
    email: "tanvirulislam122519@gmail.com",
  },
};
