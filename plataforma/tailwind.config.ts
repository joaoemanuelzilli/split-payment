import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tinta: { DEFAULT: '#12302F', 2: '#43585A', 3: '#6E8183' },
        papel: { DEFAULT: '#F2F5F4', 2: '#FFFFFF', 3: '#E6ECEA' },
        linha: '#D3DCDA',
        marca: { DEFAULT: 'var(--marca)', claro: 'var(--marca-claro)' },
        retido: '#9A3B6B',
        fav: '#2a78d6',
        prud: '#eb6834',
        ok: '#1E7B46',
        atencao: '#9A5B00',
        risco: '#B42318',
      },
      fontFamily: { sans: ['var(--fonte)', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '6px' },
    },
  },
  plugins: [],
} satisfies Config;
