import { notFound } from 'next/navigation';
import { exigirUsuario } from '@/lib/auth';
import { getEmpresa, getSimulacao, podeVer } from '@/lib/dados';
import Relatorio from '@/components/Relatorio';

export const metadata = { title: 'Relatório' };

export default async function RelatorioInterno({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const s = await getSimulacao(Number((await params).id));
  if (!s) notFound();
  const e = s.empresa_id ? await getEmpresa(s.empresa_id) : undefined;
  if (e && !podeVer(u, e)) notFound();
  if (!e && u.papel === 'parceiro' && s.criado_por !== u.id) notFound();
  return <div className="py-6 print:py-0"><Relatorio s={s} interno /></div>;
}
