import React from 'react'
import { ResponsiveProvider, useResponsiveValue, useScaledStyle, useBreakpoint, ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core'

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
        onClick={() => {
          console.log('Get Started button clicked!')
          alert('🎉 Welcome to React Responsive Easy! Your responsive scaling engine is working perfectly!')
        }}
        style={{
          padding: `${buttonPadding}px ${buttonPadding * 2}px`,
          borderRadius,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          minWidth: 120,
          minHeight: 44,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0056b3'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#007bff'
          e.currentTarget.style.transform = 'scale(1)'
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

function Navigation({ activeSection, setActiveSection }: { 
  activeSection: string; 
  setActiveSection: (section: string) => void 
}) {
  const navItems = ['Home', 'Features', 'Docs', 'About']

  const handleNavClick = (item: string) => {
    setActiveSection(item)
    console.log(`Navigated to: ${item}`)
  }

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
        <button 
          key={index}
          onClick={() => handleNavClick(item)}
          data-testid="nav-item"
          style={{
            padding: '12px 16px',
            textDecoration: 'none',
            color: activeSection === item ? '#007bff' : '#333',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 4,
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: activeSection === item ? 'bold' : 'normal'
          }}
        >
          {item}
        </button>
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
  const [activeSection, setActiveSection] = React.useState('Home')
  
  // Helper function to use responsive values in render function
  const useResponsiveValue = (value: number, options: any) => {
    // This is a simplified version for the render function
    // In a real component, you'd use the hook directly
    return value
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return (
          <>
            <div data-testid="section">
              <HeroSection />
            </div>
            <div data-testid="section" style={{ marginTop: 60 }}>
              <FeatureCards />
            </div>
          </>
        )
      case 'Features':
        return (
          <div data-testid="features-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontSize: useResponsiveValue(36, { token: 'fontSize' }), marginBottom: 32 }}>
              🚀 Revolutionary Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 12 }}>
                <h3>🎯 Mathematical Precision</h3>
                <p>Pixel-perfect scaling with mathematical accuracy</p>
              </div>
              <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 12 }}>
                <h3>⚡ Real-time Scaling</h3>
                <p>Instant responsive updates as you resize</p>
              </div>
              <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 12 }}>
                <h3>♿ Accessibility First</h3>
                <p>Built-in accessibility compliance</p>
              </div>
            </div>
          </div>
        )
      case 'Docs':
        return (
          <div data-testid="docs-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontSize: useResponsiveValue(36, { token: 'fontSize' }), marginBottom: 32 }}>
              📚 Documentation
            </h2>
            <p style={{ fontSize: useResponsiveValue(18, { token: 'fontSize' }), maxWidth: 600, margin: '0 auto' }}>
              Comprehensive guides and examples for React Responsive Easy
            </p>
          </div>
        )
      case 'About':
        return (
          <div data-testid="about-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontSize: useResponsiveValue(36, { token: 'fontSize' }), marginBottom: 32 }}>
              🎉 About React Responsive Easy
            </h2>
            <p style={{ fontSize: useResponsiveValue(18, { token: 'fontSize' }), maxWidth: 600, margin: '0 auto' }}>
              The revolutionary npm package that transforms how developers build responsive UIs
            </p>
          </div>
        )
      default:
        return null
    }
  }

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
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <main>
          {renderSection()}
        </main>
        <BreakpointInfo />
        <BreakpointValues />
      </div>
    </ResponsiveProvider>
  )
}

export default App
