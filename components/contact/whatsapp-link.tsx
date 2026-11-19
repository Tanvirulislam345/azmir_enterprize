"use client";

import type { ComponentProps, MouseEvent } from "react";
import { whatsappLinks, type WhatsAppTarget } from "@/lib/contact";

type WhatsAppLinkProps = Omit<ComponentProps<"a">, "href" | "target" | "rel"> & { whatsapp: WhatsAppTarget };

/** How long to wait for the WhatsApp app to take over before falling back to the web link (app not installed). */
const APP_FALLBACK_MS = 1600;

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac; touch support gives it away.
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

/** Hands off to the WhatsApp app; if the page is still in front after a moment, the app isn't there, so use the web link. */
function openInApp(links: ReturnType<typeof whatsappLinks>) {
  const cleanup = () => {
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", cleanup);
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") cleanup();
  };
  const timer = window.setTimeout(() => {
    cleanup();
    if (document.visibilityState === "visible") window.location.href = links.universal;
  }, APP_FALLBACK_MS);

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", cleanup);
  window.location.href = links.app;
}

/**
 * Link that opens a WhatsApp chat with the number directly, skipping WhatsApp's "Continue to chat" page:
 * the app on phones and WhatsApp Web on computers. Without JS (or on a modified click) it is a plain link to
 * WhatsApp's official send page.
 */
export function WhatsAppLink({ whatsapp, onClick, children, ...props }: WhatsAppLinkProps) {
  const links = whatsappLinks(whatsapp);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (isMobileDevice()) openInApp(links);
    else window.open(links.web, "_blank", "noopener,noreferrer");
  };

  return (
    <a {...props} href={links.universal} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
      {children}
    </a>
  );
}
