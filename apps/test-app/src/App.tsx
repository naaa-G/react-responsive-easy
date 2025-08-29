import React from 'react'
import { ResponsiveProvider, useResponsiveValue, useScaledStyle, useBreakpoint, ResponsiveConfig } from '@react-responsive-easy/core'

// Test configuration
const testConfig: ResponsiveConfig = {
  base: { name: 'desktop', width: 1920, height: 1080, alias: 'desktop' },
  breakpoints: [
    { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'desktop', width: 1920, height: 1080, alias: 'desktop' }
  ],
  strategy: {
    origin: 'width' as const,
    mode: 'linear' as const,
    tokens: {
      fontSize: { scale: 0.85, min: 12, max: 48 },
      spacing: { scale: 0.85, step: 2 },
      radius: { scale: 0.9 },
      lineHeight: { scale: 0.9 },
      shadow: { scale: 0.9 },
      border: { scale: 0.9 }
    },
    rounding: { mode: 'nearest' as const, precision: 0.5 },
    accessibility: {
      minFontSize: 12,
      minTapTarget: 44,
      contrastPreservation: true
    },
    performance: {
      memoization: true,
      cacheStrategy: 'memory' as const,
      precomputeValues: true
    }
  }
}

function HeroSection() {
  const fontSize = useResponsiveValue(48, { token: 'fontSize' })
  const padding = useResponsiveValue(48, { token: 'spacing' })
  const buttonPadding = useResponsiveValue(16, { token: 'spacing' })
  const borderRadius = useResponsiveValue(8, { token: 'radius' })

  return (
    <section data-testid="hero-section" style={{ padding, textAlign: 'center' }}>
      <h1 
        data-testid="hero-title" 
        style={{ fontSize, margin: '0 0 32px 0', color: '#333' }}
      >
        React Responsive Easy Test App
      </h1>
      <button 
        data-testid="hero-button"
        style={{
          padding: `${buttonPadding}px ${buttonPadding * 2}px`,
          borderRadius,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          minWidth: 120,
          minHeight: 44
        }}
      >
        Get Started
      </button>
    </section>
  )
}

function FeatureCards() {
  const cardStyle = useScaledStyle({
    padding: 24,
    margin: 16,
    borderRadius: 12,
    fontSize: 18
  })

  const cards = [
    { title: 'Easy Setup', description: 'Get started in minutes' },
    { title: 'Responsive', description: 'Works on all devices' },
    { title: 'TypeScript', description: 'Full type safety' }
  ]

  return (
    <section data-testid="feature-cards" style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 20,
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      {cards.map((card, index) => (
        <div 
          key={index}
          data-testid="feature-card"
          style={{
            ...cardStyle,
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            flex: '1 1 300px',
            maxWidth: 350
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>{card.title}</h3>
          <p style={{ margin: 0, color: '#666' }}>{card.description}</p>
        </div>
      ))}
    </section>
  )
}

function Navigation() {
  const navItems = ['Home', 'Features', 'Docs', 'About']

  return (
    <nav data-testid="navigation" style={{
      padding: '16px 24px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      gap: 20,
      justifyContent: 'center'
    }}>
      {navItems.map((item, index) => (
        <a 
          key={index}
          href="#"
          data-testid="nav-item"
          style={{
            padding: '12px 16px',
            textDecoration: 'none',
            color: '#333',
            borderRadius: 4,
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {item}
        </a>
      ))}
    </nav>
  )
}

function BreakpointInfo() {
  const currentBreakpoint = useBreakpoint()

  return (
    <div data-testid="breakpoint-info" style={{
      position: 'fixed',
      top: 10,
      right: 10,
      backgroundColor: '#333',
      color: 'white',
      padding: '8px 12px',
      borderRadius: 4,
      fontSize: 12,
      fontFamily: 'monospace'
    }}>
      Current: {currentBreakpoint?.name || 'unknown'}
    </div>
  )
}

function BreakpointValues() {
  const currentBreakpoint = useBreakpoint()

  return (
    <div data-testid="breakpoint-values" style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      backgroundColor: '#333',
      color: 'white',
      padding: '8px 12px',
      borderRadius: 4,
      fontSize: 12,
      fontFamily: 'monospace'
    }}>
      {currentBreakpoint ? `${currentBreakpoint.width}x${currentBreakpoint.height}` : 'unknown'}
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <ResponsiveProvider 
      config={testConfig}
      initialBreakpoint="desktop"
      debug={true}
    >
      <div 
        data-testid="responsive-app" 
        data-responsive-context="true"
        style={{ minHeight: '100vh' }}
      >
        <Navigation />
        <main style={{ padding: '40px 20px' }}>
          <div data-testid="section">
            <HeroSection />
          </div>
          <div data-testid="section" style={{ marginTop: 60 }}>
            <FeatureCards />
          </div>
        </main>
        <BreakpointInfo />
        <BreakpointValues />
        
        {/* Add some responsive elements for testing */}
        <div style={{ display: 'none' }}>
          <div data-testid="responsive-element">Test Element 1</div>
          <div data-testid="responsive-element">Test Element 2</div>
          <div data-testid="responsive-element">Test Element 3</div>
        </div>
      </div>
    </ResponsiveProvider>
  )
}

export default App
