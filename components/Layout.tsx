'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import SidebarComponent from './SidebarComponent';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="min-h-screen bg-background flex">
      <SidebarComponent />
      
      <main className={cn(
        "flex-1 transition-all duration-300 overflow-auto",
        isDesktop ? "lg:pl-64" : "pl-0", // Adjust main content based on sidebar state
        className
      )}>
        <div className="container mx-auto py-6 px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;