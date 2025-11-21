/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DC2626",
        secondary: "#1E40AF",
        accent: "#F59E0B",
        surface: "#FFFFFF",
        background: "#F3F4F6",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#DC2626",
        info: "#3B82F6"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out'
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}