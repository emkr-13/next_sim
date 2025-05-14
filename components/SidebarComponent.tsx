'use client';

import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import NavItem from '@/components/NavItem';
import { cn } from '@/lib/utils';
import { Menu, X, LayoutDashboard, Package, User, Tag, Store, Users, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTheme } from 'next-themes';

interface SidebarProps {
  className?: string;
}

const SidebarComponent = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  };

  const toggleExpandItem = (itemKey: string) => {
    setExpandedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(key => key !== itemKey) 
        : [...prev, itemKey]
    );
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && !isDesktop && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-64",
          !isDesktop && (isMobileOpen ? "translate-x-0" : "-translate-x-full"),
          isDesktop && "translate-x-0",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Package className="h-6 w-6" />
              <span>Inventory App</span>
            </div>
          )}
          {isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(!isCollapsed && "ml-auto")}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-3">
          <nav className="flex flex-col gap-1">
            <NavItem
              href="/dashboard"
              icon={LayoutDashboard}
              title="Dashboard"
              isCollapsed={isCollapsed}
              onClick={closeMobileSidebar}
            />
            <NavItem
              href="/inventory"
              icon={Package}
              title="Inventory"
              isCollapsed={isCollapsed}
              onClick={closeMobileSidebar}
              subItems={[
                { href: '/inventory/category', title: 'Category' },
                { href: '/inventory/store', title: 'Store' },
              ]}
              isExpanded={expandedItems.includes('inventory')}
              onExpandToggle={() => toggleExpandItem('inventory')}
            />
            <NavItem
              href="/accounts"
              icon={Users}
              title="Accounts"
              isCollapsed={isCollapsed}
              onClick={closeMobileSidebar}
            />
          </nav>
        </div>

        <div className="mt-auto border-t p-4">
          <div className="flex flex-col gap-2">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.fullname || 'User'}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email || 'user@example.com'}
                  </span>
                </div>
              </div>
            )}
            <NavItem
              href="/account"
              icon={User}
              title="My Account"
              isCollapsed={isCollapsed}
              onClick={closeMobileSidebar}
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className={cn("flex-1", isCollapsed && "p-0 w-10 h-10")}
                onClick={() => logout()}
              >
                {isCollapsed ? <User className="h-4 w-4" /> : "Logout"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;