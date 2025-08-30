import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsNavigation } from '@/components/docs/DocsNavigation';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex-1">
        <div className="container mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Sidebar */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6">
              <DocsSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 lg:pl-8">
            <div className="py-6">
              <div className="max-w-4xl">
                {children}
              </div>
            </div>
          </main>

          {/* Right Navigation */}
          <aside className="hidden w-48 flex-shrink-0 xl:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6">
              <DocsNavigation />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
