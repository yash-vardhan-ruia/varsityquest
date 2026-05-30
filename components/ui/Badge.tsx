import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "neutral" | "danger" | "custom";
  className?: string;
}

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase text-label-sm";

  const variants = {
    primary: "bg-primary-container text-white",
    secondary: "bg-secondary-container text-on-secondary-container",
    gold: "bg-tertiary-container text-white",
    neutral: "bg-surface-container text-on-surface-variant border border-outline-variant-custom/40",
    danger: "bg-error-container text-on-error-container",
    custom: "",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
