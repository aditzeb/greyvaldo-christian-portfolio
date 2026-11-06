/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          neutral: '#000000',
          surface: '#0A0A0A',
          primary: '#EDEDED',
          secondary: '#8F8F8F',
          tertiary: '#0070F3',
          onPrimary: '#FFFFFF',
          border: '#1F1F1F',
          borderSubtle: '#8F8F8F33',
        }
      },
      fontFamily: {
        sans: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '32px',
      }
    },
  },
  plugins: [],
}

