import React, { useState } from 'react'
import { 
  useResponsiveValue, 
  useBreakpoint, 
  useScaledStyle
} from '@react-responsive-easy/core'
import { PerformanceDashboard } from '@react-responsive-easy/performance-dashboard'
import {
  ResponsiveNavigation,
  ResponsiveHero,
  AdvancedResponsiveGrid,
  ResponsiveStats,
  ResponsiveTimeline,
  ResponsiveTestimonials
} from './components/ResponsiveLayout'
import AdvancedCharts from './components/AdvancedCharts'
import AdvancedAnimations from './components/AdvancedAnimations'
import PWAManager from './components/PWAManager'
import {
  demoStats,
  demoFeatures,
  demoTimeline,
  demoTestimonials
} from './data/demoData'
import './App.css'
import './PerformanceDashboard.css'
import './components/ResponsiveLayout.css'

// Responsive Button Component
const ResponsiveButton: React.FC<{ 
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  onClick?: () => void
}> = ({ variant = 'primary', children, onClick }) => {
  const fontSize = useResponsiveValue(18, { token: 'fontSize' })
  const padding = useResponsiveValue(16, { token: 'spacing' })
  const borderRadius = useResponsiveValue(8, { token: 'radius' })
  
  const buttonStyle = useScaledStyle({
    fontSize: fontSize,
    padding: padding,
    borderRadius: borderRadius
  })

  const buttonClasses = `responsive-button btn-${variant}`

  return (
    <button className={buttonClasses} style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  )
}

// Responsive Card Component
const ResponsiveCard: React.FC<{ 
  title: string
  content: string
  icon: string 
}> = ({ title, content, icon }) => {
  const padding = useResponsiveValue(24, { token: 'spacing' })
  const borderRadius = useResponsiveValue(12, { token: 'radius' })
  const fontSize = useResponsiveValue(16, { token: 'fontSize' })
  const titleSize = useResponsiveValue(20, { token: 'fontSize' })
  
  const cardStyle = useScaledStyle({
    padding: padding,
    borderRadius: borderRadius
  })

  const cardClasses = 'responsive-card feature-card'

  return (
    <div className={cardClasses} style={cardStyle}>
      <div className="card-title" style={{ fontSize: `${titleSize}px` }}>
        {icon} {title}
      </div>
      <div className="card-content" style={{ fontSize: `${fontSize}px` }}>
        {content}
      </div>
    </div>
  )
}

// Responsive Grid Component
const ResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gap = useResponsiveValue(24, { token: 'spacing' })
  
  const gridStyle = useScaledStyle({
    gap: gap,
    padding: gap
  })

  return <div className="responsive-grid feature-grid" style={gridStyle}>{children}</div>
}

// Main App Component
const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')
  const [showPhase2Features, setShowPhase2Features] = useState(false)
  const breakpoint = useBreakpoint()
  
  // Responsive values
  const containerPadding = useResponsiveValue(32, { token: 'spacing' })
  const headingSize = useResponsiveValue(48, { token: 'fontSize' })
  const subheadingSize = useResponsiveValue(24, { token: 'fontSize' })
  
  // Theme toggle
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  const containerClasses = `app-container ${currentTheme === 'dark' ? 'dark' : ''}`
  const headerClasses = 'app-header'
  const headingClasses = 'app-heading'
  const subheadingClasses = 'app-subheading'
  const controlsClasses = 'app-controls'
  const breakpointClasses = 'breakpoint-indicator'

  return (
    <div className={containerClasses}>
      {/* PWA Manager - Fixed at top */}
      <PWAManager />
      
      {/* Responsive Navigation */}
      <ResponsiveNavigation />
      
      {/* Breakpoint Indicator */}
      <div className={breakpointClasses}>
        {breakpoint.name} ({breakpoint.width}px)
      </div>
      
      {/* Main Content Container */}
      <main className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Hero Section */}
        <ResponsiveHero
          title="React Responsive Easy"
          subtitle="Mathematical scaling engine for responsive React applications. Build beautiful, responsive UIs with mathematical precision."
          ctaText="Get Started"
          onCtaClick={() => setShowDashboard(true)}
        />
        
        {/* Controls */}
        <div className={controlsClasses}>
          <ResponsiveButton variant="primary" onClick={toggleTheme}>
            {currentTheme === 'light' ? '🌙' : '☀️'} Toggle Theme
          </ResponsiveButton>
          
          <ResponsiveButton 
            variant="outline" 
            onClick={() => setShowDashboard(!showDashboard)}
          >
            📊 {showDashboard ? 'Hide' : 'Show'} Performance Dashboard
          </ResponsiveButton>

          <ResponsiveButton 
            variant="secondary" 
            onClick={() => setShowPhase2Features(!showPhase2Features)}
          >
            🚀 {showPhase2Features ? 'Hide' : 'Show'} Phase 2 Features
          </ResponsiveButton>
        </div>
        
        {/* Performance Dashboard */}
        {showDashboard && (
          <div className="dashboard-container" style={{ marginBottom: `${containerPadding}px` }}>
            <PerformanceDashboard />
          </div>
        )}
        
        {/* Phase 2 Advanced Features */}
        {showPhase2Features && (
          <>
            {/* Advanced Charts Section */}
            <section style={{ marginBottom: `${containerPadding}px` }}>
              <AdvancedCharts />
            </section>

            {/* Advanced Animations Section */}
            <section style={{ marginBottom: `${containerPadding}px` }}>
              <AdvancedAnimations />
            </section>
          </>
        )}
        
        {/* Stats Section */}
        <section className="mb-12" style={{ marginBottom: `${containerPadding}px` }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: `${containerPadding}px`,
            fontSize: `${useResponsiveValue(32, { token: 'fontSize' })}px`
          }}>
            Why Choose React Responsive Easy?
          </h2>
          <ResponsiveStats stats={demoStats} />
        </section>
        
        {/* Feature Cards */}
        <section className="mb-12" style={{ marginBottom: `${containerPadding}px` }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: `${containerPadding}px`,
            fontSize: `${useResponsiveValue(32, { token: 'fontSize' })}px`
          }}>
            Core Features
          </h2>
          <div className="responsive-feature-grid">
            {demoFeatures.map((feature, index) => (
              <ResponsiveCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                content={feature.content}
              />
            ))}
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="mb-12" style={{ marginBottom: `${containerPadding}px` }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: `${containerPadding}px`,
            fontSize: `${useResponsiveValue(32, { token: 'fontSize' })}px`
          }}>
            Development Journey
          </h2>
          <ResponsiveTimeline items={demoTimeline} />
        </section>
        
        {/* Testimonials Section */}
        <section className="mb-12" style={{ marginBottom: `${containerPadding}px` }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: `${containerPadding}px`,
            fontSize: `${useResponsiveValue(32, { token: 'fontSize' })}px`
          }}>
            What Developers Say
          </h2>
          <ResponsiveTestimonials testimonials={demoTestimonials} />
        </section>
      </main>
      
      {/* Footer */}
      <footer style={{ 
        marginTop: `${containerPadding * 2}px`,
        textAlign: 'center',
        padding: '20px',
        borderTop: `1px solid ${currentTheme === 'light' ? '#e5e7eb' : '#334155'}`
      }}>
        <p style={{ color: currentTheme === 'light' ? '#64748b' : '#94a3b8' }}>
          Built with React Responsive Easy • Phase 2 Enhanced • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

export default App
