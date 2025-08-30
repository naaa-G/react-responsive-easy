const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Enterprise color palette
      colors: {
        // Brand colors
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        
        // Neutral grays
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        
        // Code syntax highlighting
        code: {
          background: '#0d1117',
          foreground: '#e6edf3',
          comment: '#8b949e',
          keyword: '#ff7b72',
          string: '#a5d6ff',
          function: '#d2a8ff',
          variable: '#ffa657',
          number: '#79c0ff',
          operator: '#ff7b72'
        }
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', ...fontFamily.mono],
        display: ['Cal Sans', 'Inter', ...fontFamily.sans]
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      
      // Spacing and sizing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      
      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      
      // Box shadows
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'large': '0 10px 40px 0 rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)'
      },
      
      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px'
      },
      
      // Gradient stops
      gradientColorStops: {
        'brand-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    
    // Custom component classes
    function({ addComponents, theme }) {
      addComponents({
        // Button variants
        '.btn': {
          '@apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },
        '.btn-primary': {
          '@apply bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500': {},
        },
        '.btn-secondary': {
          '@apply bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700': {},
        },
        '.btn-ghost': {
          '@apply text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800': {},
        },
        
        // Card variants
        '.card': {
          '@apply bg-white rounded-xl shadow-soft border border-gray-200 dark:bg-gray-900 dark:border-gray-800': {},
        },
        '.card-hover': {
          '@apply transition-all duration-200 hover:shadow-medium hover:-translate-y-1': {},
        },
        
        // Code blocks
        '.code-block': {
          '@apply bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto': {},
        },
        
        // Gradient text
        '.gradient-text': {
          '@apply bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent': {},
        }
      });
    }
  ]
};
