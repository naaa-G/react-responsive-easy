import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-6 w-6" />
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {siteConfig.description}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Getting Started</Link></li>
              <li><Link href="/docs/api" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">API Reference</Link></li>
              <li><Link href="/examples" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Examples</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Community</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href={siteConfig.links.github} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">GitHub</Link></li>
              <li><Link href={siteConfig.links.discord} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Discord</Link></li>
              <li><Link href={siteConfig.links.twitter} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Twitter</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Resources</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Blog</Link></li>
              <li><Link href="/playground" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Playground</Link></li>
              <li><Link href="/changelog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Changelog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
          <p>&copy; 2024 {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
