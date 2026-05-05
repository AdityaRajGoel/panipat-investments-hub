import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  name: string;
  url?: string;
};

type VisibleBreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Visible breadcrumb navigation bar.
 * Schema is handled separately by SEOHead — this is purely the UI element.
 */
const VisibleBreadcrumbs = ({ items, className = "" }: VisibleBreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`container mx-auto px-4 py-3 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0 && item.name === "Home";

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
              )}
              {isLast || !item.url ? (
                <span
                  className="font-medium text-foreground truncate max-w-[200px]"
                  aria-current="page"
                >
                  {isHome && <Home className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />}
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-secondary transition-colors truncate max-w-[200px] inline-flex items-center gap-1"
                >
                  {isHome && <Home className="w-3.5 h-3.5 flex-shrink-0" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default VisibleBreadcrumbs;
