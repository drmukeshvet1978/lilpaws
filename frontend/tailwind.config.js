/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#151312',
          soft: '#2A2622',
        },
        paw: {
          50: '#FFF6EC',
          100: '#FFE9CE',
          200: '#FFCE94',
          300: '#FFB25C',
          400: '#FB9A33',
          500: '#F0800E', // primary brand orange, drawn from logo
          600: '#D6690A',
          700: '#AE5309',
          800: '#7E3D0B',
          900: '#4A230A',
        },
        cream: '#FBF7F1',
        bone: '#F3ECE1',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -14px rgba(21, 19, 18, 0.25)',
      },
      borderRadius: {
        paw: '2rem 2rem 2rem 0.5rem',
      },
      backgroundImage: {
        'paw-print': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23F0800E' fill-opacity='0.05'%3E%3Ccircle cx='40' cy='30' r='8'/%3E%3Ccircle cx='60' cy='24' r='7'/%3E%3Ccircle cx='78' cy='32' r='6'/%3E%3Cellipse cx='58' cy='52' rx='18' ry='14'/%3E%3C/g%3E%3C/svg%3E\")",
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.015)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.08)' },
        },
        wag: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(14deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        breathe: 'breathe 4.5s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        blink: 'blink 5s ease-in-out infinite',
        wag: 'wag 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
