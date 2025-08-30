'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeadingItem {
  id: string;
  title: string;
  level: number;
}

export function DocsNavigation() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the page
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingItems: HeadingItem[] = [];

    headingElements.forEach((heading) => {
      if (heading.id) {
        headingItems.push({
          id: heading.id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        });
      }
    });

    setHeadings(headingItems);

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headingElements.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        On This Page
      </h4>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              'block text-sm transition-colors hover:text-brand-600 dark:hover:text-brand-400',
              heading.level > 2 && 'ml-4',
              heading.level > 3 && 'ml-8',
              activeId === heading.id
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
