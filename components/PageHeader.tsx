import React from 'react';
import { Breadcrumb } from './ui/breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbSegments?: {
    name: string;
    href: string;
    current?: boolean;
  }[];
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbSegments,
  actions,
}) => {
  return (
    <div className="mb-6 space-y-2">
      {breadcrumbSegments && (
        <Breadcrumb segments={breadcrumbSegments} className="mb-2" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;