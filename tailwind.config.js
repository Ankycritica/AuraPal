/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // AuraPal brand tokens — mapped to CSS variables set in theme.css / App.jsx
        'ap-accent': '#c29543',
        'ap-warm': '#fcf1d8',
        'ap-dark': '#09090b',
        'ap-muted': '#8b8d98',
        'surface': '#121214',
        'text': '#fafafa',
        'muted': '#a1a1aa',
        'brand-start': '#d4af37',
        'on-brand': '#09090b',

        // Existing Radix/shadcn tokens
        'ap-indigo': '#4F46E5',
        'ap-emerald': '#22C55E',
        'ap-darktext': '#111827',
        'ap-lightbg': '#F9FAFB',

        primary: {
          DEFAULT: '#d4af37',
          50: '#fdfaec',
          100: '#faf3d0',
          200: '#f5e598',
          300: '#f0d360',
          400: '#e9bc2c',
          500: '#d4af37',
          600: '#b5922e',
          700: '#8f7024',
          800: '#6a5019',
          900: '#4c3810',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #d4af37, #f3e5ab)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}


