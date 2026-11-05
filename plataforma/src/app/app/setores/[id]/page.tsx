import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigirUsuario } from '@/lib/auth';
import { getNicho, nichoSlug } from '@/lib/base';
import Cabecalho from '@/components/Cabecalho';

const TIPO = { F: 'Fato', E: 'Estimativa', H: 'Hipótese' };

export default async function FichaSetor({ params }: { params: Promise<{ id: string }> }) {
  await exigirUsuario();
  const n = getNicho((await params).id);
  if (!n) notFound();
  const tt = n.tratamento_tributario;
  const Lista = ({ itens }: { itens: string[] }) => <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">{itens.map((x, i) => <li key={i}>{x}</li>)}</ul>;
  return (
    <>
      <Cabecalho titulo={n.nicho} descricao={`${n.id}. ${n.categoria}. Prioridade ${n.prioridade}, confiança ${n.confianca_geral === 'media' ? 'média' : n.confianca_geral}. ${n.porte_alvo}`}
        acoes={<><Link href={`/app/simulador/novo?nicho=${n.id}`} className="btn-primario">Simular</Link><a href={`/setores/${nichoSlug(n)}`} target="_blank" rel="noreferrer" className="btn-secundario">Página pública</a></>} />
      <div className="grid gap-8 px-5 py-6 md:px-8 xl:px-10 xl:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-8">
          <section><h2 className="h2">Tese de consultoria</h2><p className="mt-2 leading-relaxed">{n.tese_consultoria}</p></section>
          <section><h2 className="h2">Leitura crítica</h2><p className="mt-2 leading-relaxed text-tinta-2">{n.analise_critica}</p></section>
          <section>
            <h2 className="h2">Enquadramento de IBS e CBS</h2>
            <p className="mt-2 text-sm leading-relaxed">{tt.resumo}</p>
            <div className="painel mt-3 overflow-x-auto">
              <table className="tabela">
                <thead><tr><th>Item vendido</th><th className="num">Da cheia</th><th>Base legal</th><th>Status</th></tr></thead>
                <tbody>{tt.vendas.map((v, i) => <tr key={i}><td>{v.item}{v.observacao && <span className="block text-xs text-tinta-3">{v.observacao}</span>}</td><td className="num">{v.aliquota_pct_cheia}%</td><td className="text-xs">{v.base_legal}</td><td className="text-xs">{v.status}, confiança {v.confianca}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="mt-3 text-sm"><span className="font-medium">Crédito ao cliente: </span>{tt.credito_ao_cliente}</p>
            <Lista itens={tt.regras_relevantes} />
            <p className="mt-3 text-sm"><span className="font-medium">Simples Nacional ({tt.simples_nacional.relevancia}): </span>{tt.simples_nacional.tratamento}</p>
          </section>
          <section>
            <h2 className="h2">Premissas</h2>
            <div className="painel mt-3 overflow-x-auto">
              <table className="tabela">
                <thead><tr><th>Premissa</th><th>Valor</th><th>Tipo</th><th>Racional</th></tr></thead>
                <tbody>{n.premissas_operacionais.map((q, i) => <tr key={i}><td>{q.premissa}</td><td className="whitespace-nowrap">{String(q.valor)}</td><td>{TIPO[q.tipo]}</td><td className="text-xs text-tinta-2">{q.racional}{q.fonte ? ` (${q.fonte})` : ''}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="min-w-0 space-y-6">
          <section className="painel p-4"><h2 className="h3">Perguntas da reunião</h2><Lista itens={n.perguntas_diagnostico} /></section>
          <section className="painel p-4"><h2 className="h3">Documentos a pedir</h2><Lista itens={n.dados_para_coletar} /></section>
          <section className="painel p-4"><h2 className="h3">Riscos e pontos abertos</h2><Lista itens={n.riscos_pontos_abertos} /></section>
          <section className="painel p-4"><h2 className="h3">Pendências a verificar</h2><Lista itens={n.pendencias_verificar} /></section>
          <section className="painel p-4"><h2 className="h3">Regras de cálculo do setor</h2><Lista itens={n.regras_especiais_calculo} /></section>
          <section className="painel p-4">
            <h2 className="h3">Fontes</h2>
            <ul className="mt-2 space-y-1.5 text-sm">{n.fontes.map((f, i) => <li key={i}><a href={f.url} target="_blank" rel="noreferrer" className="text-marca hover:underline">{f.titulo}</a>{f.acesso && <span className="text-xs text-tinta-3"> (acesso {f.acesso})</span>}</li>)}</ul>
          </section>
        </aside>
      </div>
    </>
  );
}
