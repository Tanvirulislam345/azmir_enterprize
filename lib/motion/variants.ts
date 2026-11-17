export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const REVEAL_DURATION = 0.8;

const OFFSET = 40;

export const visibleState = { opacity: 1, x: 0, y: 0, scale: 1 };

/**
 * Hidden state for a reveal. `exitedAbove` flips the vertical offset so an element
 * that left through the top re-enters from the top when the user scrolls back up.
 */
export function hiddenState(variant: RevealVariant, exitedAbove = false) {
  const flip = exitedAbove ? -1 : 1;

  switch (variant) {
    case "up":
      return { opacity: 0, x: 0, y: OFFSET * flip, scale: 1 };
    case "down":
      return { opacity: 0, x: 0, y: -OFFSET * flip, scale: 1 };
    case "left":
      return { opacity: 0, x: -OFFSET, y: 0, scale: 1 };
    case "right":
      return { opacity: 0, x: OFFSET, y: 0, scale: 1 };
    case "scale":
      return { opacity: 0, x: 0, y: 0, scale: 0.94 };
    case "fade":
      return { opacity: 0, x: 0, y: 0, scale: 1 };
  }
}

/** Initial inline style matching `hiddenState`, so content never flashes before hydration. */
export function initialRevealStyle(variant: RevealVariant) {
  const { opacity, x, y, scale } = hiddenState(variant);
  return { opacity, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` };
}
