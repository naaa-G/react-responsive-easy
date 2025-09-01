import React, { useState } from 'react'
import { 
  useResponsiveValue, 
  useBreakpoint, 
  useScaledStyle 
} from '@yaseratiar/react-responsive-easy-core'

// Responsive Navigation Component
export const ResponsiveNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const breakpoint = useBreakpoint()
  
  const navHeight = useResponsiveValue(64, { token: 'spacing' })
  const navPadding = useResponsiveValue(16, { token: 'spacing' })
  const fontSize = useResponsiveValue(16, { token: 'fontSize' })
  
  const navStyle = useScaledStyle({
    height: navHeight,
    padding: navPadding,
    fontSize: fontSize
  })
  
  const isMobile = breakpoint.width < 768
  
  return (
    <nav className="responsive-navigation" style={navStyle}>
      <div className="nav-brand">
        <span className="brand-icon">🚀</span>
        <span className="brand-text">React Responsive Easy</span>
      </div>
      
      {isMobile ? (
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      ) : (
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#examples" className="nav-link">Examples</a>
          <a href="#docs" className="nav-link">Documentation</a>
          <a href="#performance" className="nav-link">Performance</a>
        </div>
      )}
      
      {isMobile && isMenuOpen && (
        <div className="mobile-menu">
          <a href="#features" className="mobile-nav-link">Features</a>
          <a href="#examples" className="mobile-nav-link">Examples</a>
          <a href="#docs" className="mobile-nav-link">Documentation</a>
          <a href="#performance" className="mobile-nav-link">Performance</a>
        </div>
      )}
    </nav>
  )
}

// Advanced Responsive Grid Component
export const AdvancedResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const breakpoint = useBreakpoint()
  const gap = useResponsiveValue(24, { token: 'spacing' })
  const padding = useResponsiveValue(24, { token: 'spacing' })
  
  // Dynamic grid columns based on breakpoint
  const getGridColumns = () => {
    if (breakpoint.width < 480) return 1
    if (breakpoint.width < 768) return 2
    if (breakpoint.width < 1024) return 3
    if (breakpoint.width < 1440) return 4
    return 5
  }
  
  const gridStyle = useScaledStyle({
    gap: gap,
    padding: padding
  })
  
  return (
    <div 
      className="advanced-responsive-grid" 
      style={{
        ...gridStyle,
        gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`
      }}
    >
      {children}
    </div>
  )
}

// Responsive Masonry Layout Component
export const ResponsiveMasonry: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gap = useResponsiveValue(16, { token: 'spacing' })
  
  const masonryStyle = useScaledStyle({
    gap: gap
  })
  
  return (
    <div className="responsive-masonry" style={masonryStyle}>
      {children}
    </div>
  )
}

// Responsive Hero Section Component
export const ResponsiveHero: React.FC<{ 
  title: string
  subtitle: string
  ctaText: string
  onCtaClick: () => void
}> = ({ title, subtitle, ctaText, onCtaClick }) => {
  const titleSize = useResponsiveValue(48, { token: 'fontSize' })
  const subtitleSize = useResponsiveValue(24, { token: 'fontSize' })
  const ctaSize = useResponsiveValue(18, { token: 'fontSize' })
  const padding = useResponsiveValue(80, { token: 'spacing' })
  const borderRadius = useResponsiveValue(16, { token: 'radius' })
  
  const heroStyle = useScaledStyle({
    padding: padding,
    borderRadius: borderRadius
  })
  
  const titleStyle = useScaledStyle({
    fontSize: titleSize
  })
  
  const subtitleStyle = useScaledStyle({
    fontSize: subtitleSize
  })
  
  const ctaStyle = useScaledStyle({
    fontSize: ctaSize
  })
  
  return (
    <section className="responsive-hero" style={heroStyle}>
      <div className="hero-content">
        <h1 className="hero-title" style={titleStyle}>
          {title}
        </h1>
        <p className="hero-subtitle" style={subtitleStyle}>
          {subtitle}
        </p>
        <button 
          className="hero-cta"
          style={ctaStyle}
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      </div>
      <div className="hero-visual">
        <div className="hero-animation">
          <div className="floating-card card-1">📱</div>
          <div className="floating-card card-2">💻</div>
          <div className="floating-card card-3">🖥️</div>
        </div>
      </div>
    </section>
  )
}

// Responsive Stats Grid Component
export const ResponsiveStats: React.FC<{ 
  stats: Array<{ label: string; value: string; icon: string }>
}> = ({ stats }) => {
  const gap = useResponsiveValue(32, { token: 'spacing' })
  const padding = useResponsiveValue(24, { token: 'spacing' })
  const borderRadius = useResponsiveValue(12, { token: 'radius' })
  const fontSize = useResponsiveValue(32, { token: 'fontSize' })
  const labelSize = useResponsiveValue(14, { token: 'fontSize' })
  
  const statsStyle = useScaledStyle({
    gap: gap
  })
  
  const statStyle = useScaledStyle({
    padding: padding,
    borderRadius: borderRadius
  })
  
  const valueStyle = useScaledStyle({
    fontSize: fontSize
  })
  
  const labelStyle = useScaledStyle({
    fontSize: labelSize
  })
  
  return (
    <div className="responsive-stats" style={statsStyle}>
      {stats.map((stat, index) => (
        <div key={index} className="stat-card" style={statStyle}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value" style={valueStyle}>
            {stat.value}
          </div>
          <div className="stat-label" style={labelStyle}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// Responsive Timeline Component
export const ResponsiveTimeline: React.FC<{ 
  items: Array<{ title: string; description: string; date: string; icon: string }>
}> = ({ items }) => {
  const gap = useResponsiveValue(32, { token: 'spacing' })
  const padding = useResponsiveValue(20, { token: 'spacing' })
  const borderRadius = useResponsiveValue(8, { token: 'radius' })
  const titleSize = useResponsiveValue(18, { token: 'fontSize' })
  const descSize = useResponsiveValue(14, { token: 'fontSize' })
  
  const timelineStyle = useScaledStyle({
    gap: gap
  })
  
  const itemStyle = useScaledStyle({
    padding: padding,
    borderRadius: borderRadius
  })
  
  const titleStyle = useScaledStyle({
    fontSize: titleSize
  })
  
  const descStyle = useScaledStyle({
    fontSize: descSize
  })
  
  return (
    <div className="responsive-timeline" style={timelineStyle}>
      {items.map((item, index) => (
        <div key={index} className="timeline-item" style={itemStyle}>
          <div className="timeline-icon">{item.icon}</div>
          <div className="timeline-content">
            <h3 className="timeline-title" style={titleStyle}>
              {item.title}
            </h3>
            <p className="timeline-description" style={descStyle}>
              {item.description}
            </p>
            <div className="timeline-date">{item.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Responsive Testimonials Component
export const ResponsiveTestimonials: React.FC<{ 
  testimonials: Array<{ 
    name: string; 
    role: string; 
    company: string; 
    content: string; 
    avatar: string 
  }>
}> = ({ testimonials }) => {
  const gap = useResponsiveValue(24, { token: 'spacing' })
  const padding = useResponsiveValue(24, { token: 'spacing' })
  const borderRadius = useResponsiveValue(12, { token: 'radius' })
  const contentSize = useResponsiveValue(16, { token: 'fontSize' })
  const nameSize = useResponsiveValue(18, { token: 'fontSize' })
  const roleSize = useResponsiveValue(14, { token: 'fontSize' })
  
  const testimonialsStyle = useScaledStyle({
    gap: gap
  })
  
  const testimonialStyle = useScaledStyle({
    padding: padding,
    borderRadius: borderRadius
  })
  
  const contentStyle = useScaledStyle({
    fontSize: contentSize
  })
  
  const nameStyle = useScaledStyle({
    fontSize: nameSize
  })
  
  const roleStyle = useScaledStyle({
    fontSize: roleSize
  })
  
  return (
    <div className="responsive-testimonials" style={testimonialsStyle}>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial-card" style={testimonialStyle}>
          <div className="testimonial-content" style={contentStyle}>
            "{testimonial.content}"
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">{testimonial.avatar}</div>
            <div className="author-info">
              <div className="author-name" style={nameStyle}>
                {testimonial.name}
              </div>
              <div className="author-role" style={roleStyle}>
                {testimonial.role} at {testimonial.company}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
