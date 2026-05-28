/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abi: {
          sky:    '#A8D5E5',   // light-blue brand band + decorative accent
          deep:   '#1A4D72',   // brand navy — backgrounds, accents, links
          ink:    '#0F1B2A',   // primary text (near-black with a navy hint)
          mist:   '#F0EDE6',   // warm neutral — borders, pills, strips
          cream:  '#FBF8F1',   // page background
          terracotta:   '#B85535',   // primary CTA / warm accent
          terracottaDk: '#9F4527',   // CTA hover
          peach:        '#F4D5C4',   // soft warm accent (chips)
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
