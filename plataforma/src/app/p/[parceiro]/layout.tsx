import { notFound } from 'next/navigation';
import { getParceiroPorSlug } from '@/lib/dados';
import { CabecalhoSite, RodapeSite } from '@/components/Site';

export default async function LayoutParceiro({ children, params }: { children: React.ReactNode; params: Promise<{ parceiro: string }> }) {
  const p = getParceiroPorSlug((await params).parceiro);
  if (!p) notFound();
  const estilo = p.cor ? ({ ['--marca' as string]: p.cor } as React.CSSProperties) : undefined;
  return (
    <div style={estilo}>
      <CabecalhoSite parceiro={p} />
      <main>{children}</main>
      <RodapeSite />
    </div>
  );
}
