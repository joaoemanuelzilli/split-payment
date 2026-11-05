import Link from 'next/link';
import { exigirUsuario } from '@/lib/auth';
import { getBase } from '@/lib/base';
import { pct } from '@/lib/format';
import Cabecalho from '@/components/Cabecalho';

export const metadata = { title: 'Setores e teses' };
const ORDENS = { p28: 'Mais expostos em 2028', p33: 'Mais expostos em 2033', prioridade: 'Prioridade', categoria: 'Categoria' } as const;

export default async function Setores({ searchParams }: { searchParams: Promise<{ ordem?: keyof typeof ORDENS; q?: string; exp?: string }> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const ordem = sp.ordem && sp.ordem in ORDENS ? sp.ordem : 'p28';
  let ns = [...getBase().nichos];
  if (sp.q) { const q = sp.q.toLowerCase(); ns = ns.filter(n => (n.nicho + n.categoria + (n.cnae.classes_exemplo ?? []).join(' ') + (n.cnae.divisao ?? '')).toLowerCase().includes(q)); }
  if (sp.exp) ns = ns.filter(n => n.split.exposicao === sp.exp);
  ns.sort((a, b) => ordem === 'p28' ? b.resultado_exemplo.pct_um_mes_receita_2028.prudente - a.resultado_exemplo.pct_um_mes_receita_2028.prudente
    : ordem === 'p33' ? b.resultado_exemplo.pct_um_mes_receita_2033.prudente - a.resultado_exemplo.pct_um_mes_receita_2033.prudente
    : ordem === 'prioridade' ? a.prioridade - b.prioridade || a.id.localeCompare(b.id) : a.id.localeCompare(b.id));
  return (
    <>
      <Cabecalho titulo="Setores e teses" descricao="Os 123 setores da base, com o efeito do exemplo, a prioridade comercial e o CNAE para buscar empresas. Use para escolher onde prospectar." />
      <div className="px-4 py-6 md:px-8">
        <form className="flex flex-wrap gap-2">
          <input name="q" defaultValue={sp.q} placeholder="Setor ou CNAE" className="campo max-w-xs" />
          <select name="exp" defaultValue={sp.exp ?? ''} className="campo w-auto"><option value="">Qualquer exposição</option><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></select>
          <select name="ordem" defaultValue={ordem} className="campo w-auto">{Object.entries(ORDENS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <button className="btn-secundario">Aplicar</button>
        </form>
        <div className="painel mt-4 overflow-x-auto">
          <table className="tabela">
            <thead><tr><th>Setor</th><th>Exposição</th><th className="num">2028</th><th className="num">2033</th><th className="num">Prioridade</th><th>Confiança</th><th>CNAE</th></tr></thead>
            <tbody>
              {ns.map(n => (
                <tr key={n.id}>
                  <td><Link href={`/app/setores/${n.id}`} className="font-medium hover:text-marca">{n.nicho}</Link><span className="block text-xs text-tinta-3">{n.id} · {n.categoria}</span></td>
                  <td className="capitalize text-tinta-2">{n.split.exposicao === 'media' ? 'média' : n.split.exposicao}</td>
                  <td className="num">{pct(n.resultado_exemplo.pct_um_mes_receita_2028.favoravel)} a {pct(n.resultado_exemplo.pct_um_mes_receita_2028.prudente)}</td>
                  <td className="num">{pct(n.resultado_exemplo.pct_um_mes_receita_2033.prudente)}</td>
                  <td className="num">{n.prioridade}</td>
                  <td className="text-tinta-2">{n.confianca_geral === 'media' ? 'média' : n.confianca_geral}</td>
                  <td className="text-xs text-tinta-2">{n.cnae.divisao}{n.cnae.classes_exemplo?.length ? `: ${n.cnae.classes_exemplo.slice(0, 3).join(', ')}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ajuda mt-2">Percentuais de um mês de faturamento, cenário prudente (2028 mostra a faixa favorável a prudente), com a empresa típica de cada setor.</p>
      </div>
    </>
  );
}
