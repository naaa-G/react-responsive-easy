import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Remix Integration - React Responsive Easy',
  description: 'Learn how to integrate React Responsive Easy with Remix for full-stack React applications with server-side rendering.',
}

export default function RemixGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Remix Integration</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Build full-stack responsive applications with Remix and React Responsive Easy
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Remix provides a powerful full-stack React framework with built-in server-side rendering, data loading,
            and routing. React Responsive Easy integrates seamlessly with Remix, offering responsive design capabilities
            that work both on the server and client while maintaining optimal performance.
          </p>

          <h2>Installation</h2>
          <p>
            Install React Responsive Easy in your Remix project:
          </p>

          <CodeBlock
            language="bash"
            code={`# Install core package
npm install @react-responsive-easy/core

# Install Remix-specific optimizations
npm install @react-responsive-easy/remix-plugin

# Install additional packages as needed
npm install @react-responsive-easy/performance-dashboard
npm install @react-responsive-easy/ai-optimizer`}
          />

          <h2>Basic Setup</h2>
          <p>
            Set up the ResponsiveProvider in your Remix app:
          </p>

          <CodeBlock
            language="tsx"
            code={`// app/root.tsx
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import styles from './tailwind.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix App with React Responsive Easy',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ResponsiveProvider
          breakpoints={{
            mobile: 320,
            tablet: 768,
            desktop: 1024,
            wide: 1440
          }}
          defaultBreakpoint="mobile"
        >
          <Outlet />
        </ResponsiveProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}`}
          />

          <h2>Remix Plugin Configuration</h2>
          <p>
            Configure the Remix plugin for optimal build performance:
          </p>

          <CodeBlock
            language="typescript"
            code={`// remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: [
    '@react-responsive-easy/core',
    '@react-responsive-easy/remix-plugin'
  ],
  // Plugin configuration
  plugins: [
    require('@react-responsive-easy/remix-plugin')({
      // Enable build-time optimizations
      optimize: true,
      // Generate responsive CSS at build time
      generateCSS: true,
      // Optimize bundle size
      treeShake: true,
      // Custom breakpoints
      breakpoints: {
        mobile: 320,
        tablet: 768,
        desktop: 1024,
        wide: 1440
      },
      // Enable SSR optimizations
      ssr: true,
      // CSS extraction options
      cssExtraction: {
        enabled: true,
        filename: 'responsive-[hash].css'
      }
    })
  ]
}

// package.json
{
  "dependencies": {
    "@remix-run/node": "^2.0.0",
    "@remix-run/react": "^2.0.0",
    "@remix-run/serve": "^2.0.0",
    "@react-responsive-easy/core": "^1.0.0"
  },
  "devDependencies": {
    "@remix-run/dev": "^2.0.0",
    "@react-responsive-easy/remix-plugin": "^1.0.0"
  }
}`}
          />

          <h2>Server-Side Rendering</h2>
          <p>
            React Responsive Easy works seamlessly with Remix SSR:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Route Components</h3>
              <p>
                Create responsive route components with server-side data loading:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/routes/_index.tsx
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

interface LoaderData {
  posts: Array<{
    id: string
    title: string
    excerpt: string
  }>
}

export const loader: LoaderFunction = async () => {
  // Fetch data on the server
  const posts = await getPosts()
  return json<LoaderData>({ posts })
}

export default function Index() {
  const { posts } = useLoaderData<LoaderData>()
  const breakpoint = useBreakpoint()
  
  const gridColumns = useResponsiveValue(1, {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  })

  const cardPadding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24,
    wide: 32
  })

  const titleFontSize = useResponsiveValue(24, {
    mobile: 20,
    tablet: 22,
    desktop: 24,
    wide: 28
  })

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ 
        fontSize: titleFontSize,
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        Responsive Blog
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${gridColumns}, 1fr)\`,
        gap: '24px'
      }}>
        {posts.map((post) => (
          <article
            key={post.id}
            style={{
              padding: cardPadding,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 style={{ 
              fontSize: titleFontSize * 0.8,
              margin: '0 0 16px 0',
              color: '#1e293b'
            }}>
              {post.title}
            </h2>
            <p style={{ 
              margin: 0,
              color: '#64748b',
              lineHeight: 1.6
            }}>
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '32px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#94a3b8'
      }}>
        Current breakpoint: {breakpoint.name} ({breakpoint.width}px)
      </div>
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Data Loading</h3>
              <p>
                Load responsive data on the server:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/routes/posts.$postId.tsx
import type { LoaderFunction } from '@remix-run/node'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useResponsiveValue } from '@react-responsive-easy/core'

interface Post {
  id: string
  title: string
  content: string
  publishedAt: string
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await getPost(params.postId)
  if (!post) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ post })
}

export default function PostRoute() {
  const { post } = useLoaderData<{ post: Post }>()
  
  const containerWidth = useResponsiveValue('100%', {
    mobile: '100%',
    tablet: '90%',
    desktop: '80%',
    wide: '70%'
  })

  const contentPadding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24,
    wide: 32
  })

  const titleFontSize = useResponsiveValue(32, {
    mobile: 24,
    tablet: 28,
    desktop: 32,
    wide: 36
  })

  const contentFontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 15,
    desktop: 16,
    wide: 18
  })

  return (
    <div style={{ 
      width: containerWidth,
      margin: '0 auto',
      padding: contentPadding
    }}>
      <article>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: titleFontSize,
            margin: '0 0 16px 0',
            color: '#1e293b'
          }}>
            {post.title}
          </h1>
          <time style={{ 
            fontSize: '14px',
            color: '#64748b'
          }}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </header>
        
        <div style={{
          fontSize: contentFontSize,
          lineHeight: 1.7,
          color: '#374151'
        }}>
          {post.content}
        </div>
      </article>
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Error Boundaries</h3>
              <p>
                Handle errors gracefully with responsive error boundaries:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/routes/posts.$postId.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'
import { isRouteErrorResponse, useRouteError } from '@remix-run/react'

export function ErrorBoundary() {
  const error = useRouteError()
  
  const errorPadding = useResponsiveValue(32, {
    mobile: 20,
    tablet: 24,
    desktop: 32,
    wide: 40
  })

  const errorFontSize = useResponsiveValue(18, {
    mobile: 16,
    tablet: 17,
    desktop: 18,
    wide: 20
  })

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{
        padding: errorPadding,
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h1 style={{ 
          fontSize: errorFontSize * 1.5,
          color: '#dc2626',
          margin: '0 0 16px 0'
        }}>
          {error.status} {error.statusText}
        </h1>
        <p style={{ 
          fontSize: errorFontSize,
          color: '#7f1d1d',
          margin: 0
        }}>
          {error.data}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      padding: errorPadding,
      textAlign: 'center',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h1 style={{ 
        fontSize: errorFontSize * 1.5,
        color: '#dc2626',
        margin: '0 0 16px 0'
      }}>
        Unexpected Error
      </h1>
      <p style={{ 
        fontSize: errorFontSize,
        color: '#7f1d1d',
        margin: 0
      }}>
        Something went wrong. Please try again later.
      </p>
    </div>
  )
}`}
              />
            </div>
          </div>

          <h2>Client-Side Features</h2>
          <p>
            Leverage client-side responsive features in Remix:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Form Handling</h3>
              <p>
                Create responsive forms with Remix's form handling:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/routes/contact.tsx
import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'
import { useState, useEffect } from 'react'

interface ActionData {
  errors?: {
    name?: string
    email?: string
    message?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  const errors: ActionData['errors'] = {}
  
  if (!name) errors.name = 'Name is required'
  if (!email) errors.email = 'Email is required'
  if (!message) errors.message = 'Message is required'

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors })
  }

  // Process form submission
  await submitContactForm({ name, email, message })
  
  return redirect('/contact/success')
}

export default function ContactRoute() {
  const actionData = useActionData<ActionData>()
  const breakpoint = useBreakpoint()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formWidth = useResponsiveValue('100%', {
    mobile: '100%',
    tablet: '80%',
    desktop: '60%',
    wide: '50%'
  })

  const inputPadding = useResponsiveValue(12, {
    mobile: 10,
    tablet: 11,
    desktop: 12,
    wide: 14
  })

  const labelFontSize = useResponsiveValue(14, {
    mobile: 13,
    tablet: 13.5,
    desktop: 14,
    wide: 15
  })

  const buttonWidth = useResponsiveValue('auto', {
    mobile: '100%',
    tablet: 'auto',
    desktop: 'auto',
    wide: 'auto'
  })

  useEffect(() => {
    if (actionData?.errors) {
      setIsSubmitting(false)
    }
  }, [actionData])

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ 
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        Contact Us
      </h1>
      
      <Form
        method="post"
        style={{
          width: formWidth,
          margin: '0 auto',
          maxWidth: '600px'
        }}
        onSubmit={() => setIsSubmitting(true)}
      >
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: labelFontSize,
              fontWeight: '500',
              color: '#374151'
            }}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            style={{
              width: '100%',
              padding: \`\${inputPadding}px\`,
              border: actionData?.errors?.name ? '1px solid #dc2626' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            required
          />
          {actionData?.errors?.name && (
            <p style={{ 
              color: '#dc2626',
              fontSize: '14px',
              margin: '4px 0 0 0'
            }}>
              {actionData.errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: labelFontSize,
              fontWeight: '500',
              color: '#374151'
            }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            style={{
              width: '100%',
              padding: \`\${inputPadding}px\`,
              border: actionData?.errors?.email ? '1px solid #dc2626' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            required
          />
          {actionData?.errors?.email && (
            <p style={{ 
              color: '#dc2626',
              fontSize: '14px',
              margin: '4px 0 0 0'
            }}>
              {actionData.errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: labelFontSize,
              fontWeight: '500',
              color: '#374151'
            }}
          >
            Message
          </label>
          <textarea
            name="message"
            rows={4}
            style={{
              width: '100%',
              padding: \`\${inputPadding}px\`,
              border: actionData?.errors?.message ? '1px solid #dc2626' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              resize: 'vertical'
            }}
            required
          />
          {actionData?.errors?.message && (
            <p style={{ 
              color: '#dc2626',
              fontSize: '14px',
              margin: '4px 0 0 0'
            }}>
              {actionData.errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: \`\${inputPadding}px 24px\`,
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            width: buttonWidth
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </Form>
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Navigation</h3>
              <p>
                Create responsive navigation with Remix routing:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/ResponsiveNavigation.tsx
import { Link, useLocation } from '@remix-run/react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'
import { useState } from 'react'

const navigationItems = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Posts' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
]

export default function ResponsiveNavigation() {
  const location = useLocation()
  const breakpoint = useBreakpoint()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navPadding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24,
    wide: 32
  })

  const navItemFontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 15,
    desktop: 16,
    wide: 18
  })

  const navItemSpacing = useResponsiveValue(32, {
    mobile: 16,
    tablet: 24,
    desktop: 32,
    wide: 40
  })

  const isMobile = breakpoint.name === 'mobile'

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: \`0 \${navPadding}px\`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          textDecoration: 'none'
        }}>
          Logo
        </Link>

        {isMobile ? (
          <div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#1e293b'
              }}
            >
              ☰
            </button>
            
            {isMobileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '16px',
                zIndex: 1000
              }}>
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'block',
                      padding: '12px 0',
                      fontSize: navItemFontSize,
                      color: location.pathname === item.to ? '#3b82f6' : '#374151',
                      textDecoration: 'none',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: navItemSpacing
          }}>
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  fontSize: navItemFontSize,
                  color: location.pathname === item.to ? '#3b82f6' : '#374151',
                  textDecoration: 'none',
                  fontWeight: location.pathname === item.to ? '600' : '400'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}`}
              />
            </div>
          </div>

          <h2>Performance Optimization</h2>
          <p>
            Optimize performance in Remix applications:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Resource Loading</h3>
              <p>
                Optimize resource loading with Remix's resource handling:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/routes/posts.tsx
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useFetcher } from '@remix-run/react'
import { useResponsiveValue } from '@react-responsive-easy/core'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  excerpt: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  
  const posts = await getPosts({ page, limit })
  return json({ posts, page, limit })
}

export default function PostsRoute() {
  const { posts, page, limit } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const [allPosts, setAllPosts] = useState<Post[]>(posts)
  const [currentPage, setCurrentPage] = useState(page)
  
  const postsPerRow = useResponsiveValue(1, {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  })

  const loadMore = () => {
    const nextPage = currentPage + 1
    fetcher.load(\`/posts?page=\${nextPage}&limit=\${limit}\`)
    setCurrentPage(nextPage)
  }

  useEffect(() => {
    if (fetcher.data?.posts) {
      setAllPosts(prev => [...prev, ...fetcher.data.posts])
    }
  }, [fetcher.data])

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ 
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        All Posts
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${postsPerRow}, 1fr)\`,
        gap: '24px',
        marginBottom: '32px'
      }}>
        {allPosts.map((post) => (
          <article
            key={post.id}
            style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 style={{ 
              fontSize: '20px',
              margin: '0 0 16px 0',
              color: '#1e293b'
            }}>
              {post.title}
            </h2>
            <p style={{ 
              margin: 0,
              color: '#64748b',
              lineHeight: 1.6
            }}>
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={loadMore}
          disabled={fetcher.state === 'loading'}
          style={{
            backgroundColor: fetcher.state === 'loading' ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: fetcher.state === 'loading' ? 'not-allowed' : 'pointer'
          }}
        >
          {fetcher.state === 'loading' ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Prefetching</h3>
              <p>
                Implement prefetching for responsive navigation:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/PrefetchLink.tsx
import { Link, useFetcher } from '@remix-run/react'
import { useResponsiveValue } from '@react-responsive-easy/core'

interface PrefetchLinkProps {
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function PrefetchLink({ to, children, className, style }: PrefetchLinkProps) {
  const fetcher = useFetcher()
  
  const prefetchDelay = useResponsiveValue(300, {
    mobile: 500, // Longer delay on mobile for better UX
    tablet: 400,
    desktop: 300,
    wide: 200
  })

  const handleMouseEnter = () => {
    // Prefetch on hover with responsive delay
    setTimeout(() => {
      fetcher.load(to)
    }, prefetchDelay)
  }

  return (
    <Link
      to={to}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      prefetch="intent"
    >
      {children}
    </Link>
  )
}

// app/components/ResponsiveNavigation.tsx
import PrefetchLink from './PrefetchLink'

// Use PrefetchLink in navigation
<PrefetchLink
  to={item.to}
  style={{
    fontSize: navItemFontSize,
    color: location.pathname === item.to ? '#3b82f6' : '#374151',
    textDecoration: 'none',
    fontWeight: location.pathname === item.to ? '600' : '400'
  }}
>
  {item.label}
</PrefetchLink>`}
              />
            </div>
          </div>

          <h2>Styling and CSS</h2>
          <p>
            Integrate responsive design with Remix's styling system:
          </p>

          <div className="space-y-6">
            <div>
              <h3>CSS Modules</h3>
              <p>
                Use CSS modules with responsive design in Remix:
              </p>
              <CodeBlock
                language="css"
                code={`/* app/components/ResponsiveCard.module.css */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.title {
  margin: 0 0 16px 0;
  color: #1e293b;
}

.content {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

/* Responsive variants */
@media (max-width: 767px) {
  .card {
    padding: 16px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .content {
    font-size: 14px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .card {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .content {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .card {
    padding: 24px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .content {
    font-size: 16px;
  }
}`}
              />

              <CodeBlock
                language="tsx"
                code={`// app/components/ResponsiveCard.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'
import styles from './ResponsiveCard.module.css'

interface ResponsiveCardProps {
  title: string
  content: string
}

export default function ResponsiveCard({ title, content }: ResponsiveCardProps) {
  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })

  return (
    <div 
      className={styles.card}
      style={{ padding }}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.content}>{content}</p>
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Tailwind CSS</h3>
              <p>
                Use Tailwind CSS with responsive design in Remix:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/TailwindResponsiveCard.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'

interface TailwindResponsiveCardProps {
  title: string
  content: string
}

export default function TailwindResponsiveCard({ title, content }: TailwindResponsiveCardProps) {
  const padding = useResponsiveValue('p-6', {
    mobile: 'p-4',
    tablet: 'p-5',
    desktop: 'p-6',
    wide: 'p-8'
  })

  const titleSize = useResponsiveValue('text-xl', {
    mobile: 'text-lg',
    tablet: 'text-lg',
    desktop: 'text-xl',
    wide: 'text-2xl'
  })

  const contentSize = useResponsiveValue('text-base', {
    mobile: 'text-sm',
    tablet: 'text-sm',
    desktop: 'text-base',
    wide: 'text-lg'
  })

  return (
    <div className={\`bg-white rounded-lg shadow-md border border-gray-200 \${padding}\`}>
      <h3 className={\`\${titleSize} font-semibold text-gray-900 mb-4\`}>
        {title}
      </h3>
      <p className={\`\${contentSize} text-gray-600 leading-relaxed\`}>
        {content}
      </p>
    </div>
  )
}`}
              />
            </div>
          </div>

          <h2>Testing and Deployment</h2>
          <p>
            Set up testing and deployment for Remix applications:
          </p>

          <CodeBlock
            language="typescript"
            code={`// app/components/__tests__/ResponsiveComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import ResponsiveComponent from '../ResponsiveComponent'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ResponsiveProvider breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
    {children}
  </ResponsiveProvider>
)

describe('ResponsiveComponent', () => {
  it('renders correctly on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })

    render(
      <TestWrapper>
        <ResponsiveComponent />
      </TestWrapper>
    )

    expect(screen.getByText('Mobile Layout')).toBeInTheDocument()
  })
})

// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { reactResponsiveEasy } from '@react-responsive-easy/remix-plugin'

export default defineConfig({
  plugins: [
    reactResponsiveEasy({
      testing: true,
      testBreakpoints: {
        mobile: 375,
        tablet: 768,
        desktop: 1024
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/test/setup.ts'],
    globals: true
  }
})

// app/test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window resize events
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// package.json scripts
{
  "scripts": {
    "dev": "remix dev",
    "build": "remix build",
    "start": "remix-serve build",
    "typecheck": "tsc",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}`}
          />

          <h2>Best Practices</h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Remix Integration Best Practices
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>• Use the Remix plugin for build optimizations</li>
              <li>• Leverage SSR for responsive content</li>
              <li>• Implement proper error boundaries</li>
              <li>• Use prefetching for better navigation performance</li>
              <li>• Test responsive behavior across all breakpoints</li>
              <li>• Configure environment variables for different modes</li>
              <li>• Use CSS modules or Tailwind for styling</li>
              <li>• Implement proper loading states</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand Remix integration, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/frameworks/nextjs">
                <span className="font-semibold">Next.js Integration</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Learn Next.js integration
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/plugins">
                <span className="font-semibold">Build Plugins</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Configure build optimizations
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/performance">
                <span className="font-semibold">Performance</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize performance
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/quick-start">
                <span className="font-semibold">Quick Start</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Get started quickly
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
