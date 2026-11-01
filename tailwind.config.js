/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#08090B',
          dark: '#050507',
          light: '#0E1014'
        },
        surface: {
          DEFAULT: '#12151A',
          elevated: '#171B22',
          border: '#292D33'
        },
        silver: {
          DEFAULT: '#D7DCE2',
          light: '#E6E9EE',
          dark: '#B0B7C1'
        },
        steel: {
          DEFAULT: '#9299A3',
          light: '#A8AFBA',
          dark: '#6E747E'
        },
        darkBorder: {
          DEFAULT: '#292D33',
          subtle: '#1F2227',
          bright: '#3D434D'
        },
        softWhite: {
          DEFAULT: '#F3F4F5',
          card: '#E9EBEF',
          muted: '#DDE0E5'
        },
        // Mapped for backwards-compatibility with existing classes
        forest: {
          DEFAULT: '#08090B',
          dark: '#050507',
          light: '#12151A'
        },
        paper: {
          DEFAULT: '#FFFFFF',
          card: '#F3F4F5',
          muted: '#D7DCE2'
        },
        copper: {
          DEFAULT: '#FFFFFF',
          dark: '#D7DCE2',
          light: '#FFFFFF',
          glow: 'rgba(255, 255, 255, 0.15)'
        },
        sage: {
          DEFAULT: '#9299A3',
          light: '#D7DCE2',
          dark: '#6E747E'
        },
        mutedInk: {
          DEFAULT: '#9299A3',
          light: '#D7DCE2'
        },
        borderBase: '#292D33'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      lineHeight: {
        tightDisplay: '1.05',
        editorial: '1.65',
      },
      letterSpacing: {
        technical: '0.08em',
      }
    },
  },
  plugins: [],
}

