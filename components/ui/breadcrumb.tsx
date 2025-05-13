import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: {
    name: string;
    href: string;
    current?: boolean;
  }[];
}

export function Breadcrumb({ segments, className, ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb" {...props}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0 text-muted-foreground/50" />}
            {segment.current ? (
              <span className="font-medium text-foreground">{segment.name}</span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-foreground transition-colors"
              >
                {segment.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}