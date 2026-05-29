/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abi: {
          sky:      '#A8D5E5',   // brand sky — header band, fills (= theme-color)
          skySoft:  '#CFE6EF',   // light tints, chips
          navy:     '#15506C',   // primary ink, headings, logo frame, buttons
          navyDeep: '#0F3E54',   // hover / active / footer
          ocean:    '#2C7DA0',   // links, secondary text, eyebrows, signature
          milk:     '#EAF6FB',   // near-white, text on dark
          gold:     '#CC8E2E',   // warm accent — hairlines, arepa, details
          whatsapp:     '#25D366',
          whatsappDeep: '#1EBE5A',
          whatsappInk:  '#0B3D2E',
          // Legacy aliases repointed to the new palette (avoids a full class rename):
          deep:  '#15506C',  // → navy
          ink:   '#15506C',  // → navy (text)
          mist:  '#E1EDF3',  // → cool light neutral (borders, pills)
          cream: '#FFFFFF',  // → white page background
        },
        ve: { yellow: '#FFCD00', blue: '#0A3D91', red: '#CE1126' },
      },
      fontFamily: {
        serif:   ['Fraunces', 'Georgia', 'serif'],          // keep `font-serif` = Fraunces
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        script:  ['Sacramento', 'cursive'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(21, 80, 108, 0.08)',
        bar:  '0 -4px 20px rgba(21, 80, 108, 0.12)',
      },
    },
  },
  plugins: [],
};
