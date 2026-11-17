import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-accent text-accent-foreground shadow-soft hover:shadow-lift hover:brightness-105",
  secondary: "border border-border bg-surface text-foreground hover:border-accent hover:text-accent",
  inverse: "border border-inverse-foreground/30 text-inverse-foreground hover:border-accent hover:bg-inverse-foreground/5",
} as const;

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  /** Shows a trailing arrow that nudges forward on hover. */
  withArrow?: boolean;
};

export function buttonClassName(variant: ButtonVariant = "primary", size: keyof typeof sizes = "md") {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-all duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0",
    variants[variant],
    sizes[size],
  );
}

export function ButtonLink({ variant, size, withArrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClassName(variant, size), className)} {...props}>
      {children}
      {withArrow && (
        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}

export function PrimaryButton(props: Omit<ButtonLinkProps, "variant">) {
  return <ButtonLink variant="primary" {...props} />;
}

export function SecondaryButton(props: Omit<ButtonLinkProps, "variant">) {
  return <ButtonLink variant="secondary" {...props} />;
}
