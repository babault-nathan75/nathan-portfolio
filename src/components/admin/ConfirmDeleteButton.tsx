"use client";

import type { ComponentProps } from "react";
import { btnDanger } from "@/lib/ui";

/**
 * Bouton de suppression avec confirmation, utilisable dans un <form action={...}>.
 * (Les event handlers ne sont pas autorisés dans les Server Components.)
 */
export default function ConfirmDeleteButton({
  confirmMessage,
  className = btnDanger,
  children,
  ...props
}: ComponentProps<"button"> & { confirmMessage: string; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
