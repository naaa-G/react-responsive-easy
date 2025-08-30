'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X,
  Search,
  Sun,
  Moon,
  Monitor,
  Github
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { SearchDialog } from '@/components/search/SearchDialog';
import { siteConfig, docsConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const currentThemeOption = themeOptions.find(option => option.value === theme) || themeOptions[2];
  const NextIcon = themeOptions.find(option => option.value === nextTheme)?.icon || Sun;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="hidden font-bold sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {docsConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400',
                  pathname.startsWith(item.href)
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-300'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Icon icon={Search} size={16} />
              <span className="ml-2 text-sm text-gray-500">Search...</span>
              <kbd className="ml-auto hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400 lg:block">
                ⌘K
              </kbd>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(nextTheme)}
              className="h-9 w-9 p-0"
            >
              <Icon icon={NextIcon} size={16} />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* GitHub Link */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex h-9 w-9 p-0"
            >
              <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                <Icon icon={Github} size={16} />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden h-9 w-9 p-0"
            >
              {isOpen ? (
                <Icon icon={X} size={18} />
              ) : (
                <Icon icon={Menu} size={18} />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden"
            >
              <nav className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-3">
                  {docsConfig.mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-base font-medium transition-colors',
                        pathname.startsWith(item.href)
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                  
                  {/* Mobile Search */}
                  <button
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center rounded-lg px-3 py-2 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    <Icon icon={Search} size={16} className="mr-2" />
                    Search
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Dialog */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
