/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abi: {
          sky:    '#A8D5E5',
          skyDk:  '#7FB3D5',
          deep:   '#1F618D',
          mist:   '#E8F4F9',
          cream:  '#FDFBF7',
          sand:   '#F5EFE6',
        },
        ve: {
          yellow: '#FFCD00',
          blue:   '#003893',
          red:    '#CE1126',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(31, 97, 141, 0.08)',
        bar:  '0 -4px 20px rgba(31, 97, 141, 0.12)',
      },
    },
  },
  plugins: [],
};
