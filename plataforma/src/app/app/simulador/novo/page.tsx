import { notFound, redirect } from 'next/navigation';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { getEmpresa, listarEmpresas, podeVer, simulacaoInicial } from '@/lib/dados';
import Cabecalho from '@/components/Cabecalho';
import Simulador from '@/components/Simulador';
import { salvarSimulacaoAcao } from '../../../acoes';

export const metadata = { title: 'Simulador' };

export default async function NovaSim({ searchParams }: { searchParams: Promise<{ nicho?: string; empresa?: string }> }) {
  const u = await exigirUsuario();
  const sp = await searchParams;
  if (!sp.nicho) redirect(`/app/simulador${sp.empresa ? `?empresa=${sp.empresa}` : ''}`);
  const n = getNicho(sp.nicho);
  if (!n) notFound();
  const emp = sp.empresa ? getEmpresa(Number(sp.empresa)) : undefined;
  const empresaId = emp && podeVer(u, emp) ? emp.id : null;
  const inicial = simulacaoInicial(n.id);
  if (emp?.faturamento_mensal) {
    const f = n.campos_especificos.find(c => c.alvos.includes('receita_mensal') && c.tipo === 'moeda');
    if (f) inicial.valores[f.id] = emp.faturamento_mensal;
  }
  const empresas = listarEmpresas(u).map(e => ({ id: e.id, nome: e.nome }));
  return (
    <>
      <Cabecalho titulo={n.nicho} descricao={`${n.categoria}. ${emp ? `Cliente: ${emp.nome}.` : ''}`} />
      <div className="px-4 py-6 md:px-8">
        <Simulador nicho={n} inicial={inicial} modo="consultor" empresaId={empresaId} empresas={empresas} salvar={salvarSimulacaoAcao}
          nomeInicial={emp ? `${emp.nome}: ${n.nicho}` : undefined} />
      </div>
    </>
  );
}
