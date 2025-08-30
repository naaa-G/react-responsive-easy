'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { docsConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function DocsSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(['Getting Started']);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(section => section !== title)
        : [...prev, title]
    );
  };

  return (
    <nav className="space-y-1">
      {docsConfig.sidebarNav.map((section) => {
        const isOpen = openSections.includes(section.title);
        
        return (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
            >
              <span>{section.title}</span>
              <ChevronRight
                size={16}
                className={cn(
                  'transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </button>
            
            {isOpen && (
              <div className="ml-2 mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href === '/docs' && pathname === '/docs');
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                      )}
                    >
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-tight">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
