import "server-only";
import type en from "@/dictionaries/en.json";
import type { Locale } from "./config";

/** English is the reference shape; every locale file must match it. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  bn: () => import("@/dictionaries/bn.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
