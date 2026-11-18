/**
 * Suspense boundary for the product segment. The parent `[category]/loading.tsx` doesn't re-trigger
 * when moving between products of the same category, so this segment needs its own boundary
 * to keep the `params` read out of the shared App Shell.
 */
export { default } from "../loading";
