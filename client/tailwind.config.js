/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch "High-Velocity Telemetry" design tokens
        hud: {
          bg: '#0b1326',
          'surface': '#0b1326',
          'surface-dim': '#0b1326',
          'surface-bright': '#31394e',
          'surface-container-lowest': '#060d20',
          'surface-container-low': '#131b2e',
          'surface-container': '#171f33',
          'surface-container-high': '#222a3e',
          'surface-container-highest': '#2d3449',
          'on-surface': '#dbe2fd',
          'on-surface-variant': '#c7c4d8',
          'outline': '#918fa1',
          'outline-variant': '#464555',
          'primary': '#c3c0ff',
          'primary-container': '#4f46e5',
          'secondary': '#4edea3',
          'secondary-container': '#00a572',
          'tertiary': '#fbabff',
          'tertiary-container': '#a500bd',
          'error': '#ffb4ab',
          'error-container': '#93000a',
          'inverse-primary': '#4d44e3',
        },
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'star-movement-bottom': 'star-movement-bottom 6s linear infinite alternate',
        'star-movement-top': 'star-movement-top 6s linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} 