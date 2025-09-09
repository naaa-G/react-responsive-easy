import React from 'react'
import ReactDOM from 'react-dom/client'
import { ResponsiveProvider } from '@yaseratiar/react-responsive-easy-core'
import App from './App'
import './index.css'

// Responsive configuration
const responsiveConfig = {
  breakpoints: [
    { name: 'mobile', width: 320, height: 568, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'desktop', width: 1024, height: 768, alias: 'desktop' },
    { name: 'wide', width: 1440, height: 900, alias: 'wide' }
  ],
  base: { name: 'desktop', width: 1024, height: 768, alias: 'desktop' },
  strategy: {
    origin: 'width' as const,
    mode: 'linear' as const,
    tokens: {
      fontSize: { scale: 1.0, min: 12, unit: 'px' as const, responsive: true },
      spacing: { scale: 1.0, unit: 'px' as const, responsive: true },
      radius: { scale: 1.0, unit: 'px' as const, responsive: true },
      lineHeight: { scale: 1.0, responsive: true },
      shadow: { scale: 1.0, responsive: true },
      border: { scale: 1.0, unit: 'px' as const, responsive: true }
    },
    rounding: { mode: 'nearest' as const, precision: 2 },
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ResponsiveProvider config={responsiveConfig}>
      <App />
    </ResponsiveProvider>
  </React.StrictMode>
)
