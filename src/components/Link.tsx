import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "@tanstack/react-router";
import { cn } from "@/utils/cn";

export interface LinkProps
  extends Omit<RouterLinkProps, "className" | "children"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  children: ReactNode;
}

export interface ExternalLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  external: true;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps | ExternalLinkProps>(
  (
    { className, variant = "ghost", size = "md", external, children, ...props },
    ref
  ) => {
    const baseStyles = cn(
      // Base styles
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Variant styles
      {
        "bg-red-700 text-white shadow hover:bg-red-800 active:bg-red-900":
          variant === "primary",
        "border border-red-700 bg-transparent text-red-700 hover:bg-red-700 hover:text-white active:bg-red-800":
          variant === "secondary",
        "text-red-700 hover:text-red-800 hover:underline": variant === "ghost",
      },
      // Size styles
      {
        "h-8 px-3 text-sm": size === "sm" && variant !== "ghost",
        "h-10 px-4 py-2": size === "md" && variant !== "ghost",
        "h-12 px-6 text-lg": size === "lg" && variant !== "ghost",
        "text-sm": size === "sm" && variant === "ghost",
        "text-base": size === "md" && variant === "ghost",
        "text-lg": size === "lg" && variant === "ghost",
      },
      className
    );

    // External link (regular anchor)
    if (external) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { external: _external, ...anchorProps } =
        props as ExternalLinkProps;
      return (
        <a
          className={baseStyles}
          ref={ref}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    // Internal link (TanStack Router)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external: _externalProp, ...routerProps } = props as LinkProps;
    return (
      <RouterLink
        className={baseStyles}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...routerProps}
      >
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = "Link";

export { Link };
