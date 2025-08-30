import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InteractivePlayground } from '@/components/playground/InteractivePlayground';

export const metadata: Metadata = {
  title: 'Interactive Playground',
  description: 'Experiment with React Responsive Easy in real-time. Try different breakpoints, scaling strategies, and see your components adapt instantly.',
  keywords: [
    'React',
    'Playground',
    'Interactive',
    'Responsive',
    'Live Preview',
    'Code Editor',
    'Monaco',
    'TypeScript'
  ],
};

export default function PlaygroundPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-br from-white via-brand-50/30 to-purple-50/30 dark:from-gray-950 dark:via-brand-950/20 dark:to-purple-950/20">
          <div className="container py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Interactive{' '}
                <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Playground
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                Experiment with React Responsive Easy in real-time. Write code, see instant previews, 
                and explore how your components adapt across different breakpoints.
              </p>
              
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-900/60">
                  <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    Live Preview
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Instant feedback
                  </div>
                </div>
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-900/60">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    TypeScript
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Full IntelliSense
                  </div>
                </div>
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-900/60">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    Templates
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ready examples
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Playground Section */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <InteractivePlayground 
              height="70vh"
              className="mx-auto max-w-7xl"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-gray-50 py-16 dark:bg-gray-900/50 sm:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Playground Features
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Everything you need to explore and learn React Responsive Easy
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Monaco Editor',
                  description: 'VS Code-quality editor with syntax highlighting, IntelliSense, and error detection.',
                  icon: '🎨'
                },
                {
                  name: 'Live Preview',
                  description: 'See your changes instantly with real-time compilation and rendering.',
                  icon: '⚡'
                },
                {
                  name: 'TypeScript Support',
                  description: 'Full TypeScript support with type checking and autocomplete.',
                  icon: '🔷'
                },
                {
                  name: 'Example Templates',
                  description: 'Start with pre-built examples covering basic to advanced use cases.',
                  icon: '📝'
                },
                {
                  name: 'Responsive Preview',
                  description: 'Test your components across different breakpoints and screen sizes.',
                  icon: '📱'
                },
                {
                  name: 'Error Handling',
                  description: 'Clear error messages and debugging information to help you learn.',
                  icon: '🐛'
                }
              ].map((feature) => (
                <div
                  key={feature.name}
                  className="rounded-2xl bg-white p-6 shadow-soft dark:bg-gray-900"
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Getting Started
              </h2>
              <div className="mt-8 space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Choose a Template
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Start with one of our example templates: Basic, Advanced, or Hooks showcase.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edit the Code
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Modify the code in the editor. Use Ctrl+Space for autocomplete and hover for documentation.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      See Live Results
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Watch your changes appear instantly in the live preview. Resize your browser to test responsiveness.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Copy & Use
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Copy the code to your clipboard and use it in your own projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
