/** @type {import('tailwindcss').Config} */
import {nextui} from "@nextui-org/react";


module.exports = {
  content: [
    './dashboard/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: '#01B96B'
        }
      },
      dark: {
        colors: {
          primary: '#01B96B'
        }
      }
    }
  })],
}
