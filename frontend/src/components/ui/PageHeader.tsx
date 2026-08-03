import React, { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className = '',
}) => (
  <section className={`page-header overflow-hidden ${className}`}>
    <div className="page-header__glow" aria-hidden="true" />
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 max-w-2xl lg:max-w-[50%]">
        {eyebrow && <p className="section-kicker mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
      </div>

      {(actions || aside) && (
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          {aside}
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      )}
    </div>
  </section>
);

export default PageHeader;
