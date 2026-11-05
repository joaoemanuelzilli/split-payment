import { notFound } from 'next/navigation';
import { getSimulacaoPorToken } from '@/lib/dados';
import Relatorio from '@/components/Relatorio';

export const metadata = { title: 'Diagnóstico de caixa', robots: { index: false } };

export default async function RelatorioPublico({ params }: { params: Promise<{ token: string }> }) {
  const s = getSimulacaoPorToken((await params).token);
  if (!s) notFound();
  return <div className="bg-papel py-6 print:bg-white print:py-0"><Relatorio s={s} /></div>;
}
