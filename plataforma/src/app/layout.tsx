import type { Metadata } from 'next';
import { Parkinsans } from 'next/font/google';
import './globals.css';
import { getMarca } from '@/lib/dados';

export const dynamic = 'force-dynamic';

const fonte = Parkinsans({ subsets: ['latin', 'latin-ext'], variable: '--fonte', display: 'swap', adjustFontFallback: false });

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMarca();
  return {
    title: { default: `${m.nome}: ${m.slogan}`, template: `%s | ${m.nome}` },
    description: 'Quanto capital de giro a sua empresa vai precisar a mais com o split payment de IBS e CBS, de 2027 a 2033, por setor.',
  };
}

function clarear(hex: string) {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '#E3EFEE';
  const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = c.map(v => Math.round(v * 0.12 + 255 * 0.88));
  return '#' + mix.map(v => v.toString(16).padStart(2, '0')).join('');
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const m = await getMarca();
  const estilo = { ['--marca' as string]: m.cor, ['--marca-claro' as string]: clarear(m.cor) } as React.CSSProperties;
  return (
    <html lang="pt-BR" className={fonte.variable} style={estilo}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
