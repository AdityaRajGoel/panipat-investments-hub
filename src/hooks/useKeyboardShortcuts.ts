import { useEffect } from "react";

/**
 * Global keyboard shortcuts for the app.
 * - Ctrl+K / Cmd+K or "/" to focus search
 * - Escape to blur active element
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      // Ctrl+K / Cmd+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
          // Scroll search into view
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // "/" shortcut (only when not typing)
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
}
