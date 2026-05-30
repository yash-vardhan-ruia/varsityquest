import React from "react";
import { SearchX } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No Colleges Found",
  description = "We couldn't find any colleges matching your active search terms or filters. Try adjusting your selections.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-surface-lowest rounded-lg border border-outline-variant-custom/40 shadow-level1 max-w-lg mx-auto my-6">
      <div className="p-4 bg-surface-container rounded-full text-on-surface-variant mb-4">
        <SearchX size={48} className="stroke-[1.5]" />
      </div>
      <h3 className="font-semibold text-headline-sm text-on-surface mb-2">
        {title}
      </h3>
      <p className="text-on-surface-variant text-body-sm mb-6 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
