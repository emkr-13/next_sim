"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DivideIcon as LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: typeof LucideIcon;
  title: string;
  isCollapsed?: boolean;
  isChild?: boolean;
  onClick?: () => void;
  subItems?: { href: string; title: string }[];
  isExpanded?: boolean;
  onExpandToggle?: () => void;
}

const NavItem = ({
  href,
  icon: Icon,
  title,
  isCollapsed = false,
  isChild = false,
  onClick,
  subItems,
  isExpanded = false,
  onExpandToggle,
}: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const handleItemClick = (e: React.MouseEvent) => {
    if (subItems && subItems.length > 0) {
      e.preventDefault();
      if (onExpandToggle) {
        onExpandToggle();
      }
    } else if (onClick) {
      onClick();
    }
  };

  if (isChild) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "pl-10" // Indent child items
        )}
      >
        <span>{title}</span>
      </Link>
    );
  }

  return (
    <div>
      {subItems && subItems.length > 0 ? (
        <div
          onClick={handleItemClick}
          className={cn(
            "group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex flex-1 items-center justify-between">
              <span>{title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-180" : "rotate-0"
                )}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          )}
        </div>
      ) : (
        <Link
          href={href}
          onClick={onClick}
          className={cn(
            "group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>{title}</span>}
        </Link>
      )}

      {!isCollapsed && subItems && subItems.length > 0 && isExpanded && (
        <div className="mt-1 space-y-1">
          {subItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={Icon}
              title={item.title}
              isChild={true}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;
