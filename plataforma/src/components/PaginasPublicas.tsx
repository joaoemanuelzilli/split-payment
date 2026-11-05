import Link from 'next/link';
import { categorias, nichoSlug } from '@/lib/base';
import { getConfigPublica, getParametros } from '@/lib/dados';
import type { Nicho } from '@/lib/types';
import { minusculaInicial, pct } from '@/lib/format';
import Simulador from './Simulador';
import { capturarLead } from '@/app/acoes';

const EXPOSICAO = { alta: 'Exposição alta', media: 'Exposição média', baixa: 'Exposição baixa' };

export function ListaSetores({ base = '' }: { base?: string }) {
  const cfg = getConfigPublica();
  const cats = categorias(n => !cfg.somentePrioridade1 || n.prioridade === 1);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="h1">Escolha o setor da empresa</h1>
      <p className="mt-3 max-w-2xl text-tinta-2">
        Cada setor tem um formulário com o vocabulário dele e um exemplo de empresa típica já preenchido. O número ao lado é o capital extra do exemplo em 2028, no cenário prudente, em % de um mês de faturamento.
      </p>
      <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
        {cats.map(c => (
          <section key={c.codigo}>
            <h2 className="border-b border-tinta pb-2 text-lg font-bold">{c.nome}</h2>
            <ul className="divide-y divide-linha">
              {c.nichos.map(n => (
                <li key={n.id}>
                  <Link href={`${base}/setores/${nichoSlug(n)}`} className="flex items-baseline justify-between gap-4 py-2.5 hover:text-marca">
                    <span>{n.nicho}</span>
                    <span className="shrink-0 tabular-nums text-sm text-tinta-2">{pct(n.resultado_exemplo.pct_um_mes_receita_2028.prudente)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function PaginaNicho({ nicho, parceiro, base = '' }: { nicho: Nicho; parceiro?: string; base?: string }) {
  const cfg = getConfigPublica();
  const inicial = { valores: Object.fromEntries(nicho.campos_especificos.map(f => [f.id, f.padrao])), caixa: { ...nicho.caixa_exemplo }, parametros: getParametros() };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-tinta-3"><Link href={`${base}/setores`} className="hover:text-marca">Setores</Link> / {nicho.categoria}</nav>
      <header className="mt-3 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <h1 className="h1">Split payment para {minusculaInicial(nicho.nicho)}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-tinta-2">{nicho.descricao_negocio}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded border border-linha bg-white p-3"><dt className="text-tinta-3">No exemplo, em 2028</dt><dd className="text-xl font-bold tabular-nums">{pct(nicho.resultado_exemplo.pct_um_mes_receita_2028.favoravel)} a {pct(nicho.resultado_exemplo.pct_um_mes_receita_2028.prudente)}</dd><dd className="text-xs text-tinta-3">de um mês de faturamento</dd></div>
          <div className="rounded border border-linha bg-white p-3"><dt className="text-tinta-3">{EXPOSICAO[nicho.split.exposicao]}</dt><dd className="mt-1 text-xs leading-snug text-tinta-2">{nicho.split.quando}</dd></div>
        </dl>
      </header>
      <div className="mt-8">
        <Simulador nicho={nicho} inicial={inicial} modo="publico" capturar={capturarLead} exigirCadastro={cfg.exigirCadastro} parceiro={parceiro} />
      </div>
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="h2">O que pesa neste setor</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-tinta-2">
            {nicho.split.observacoes.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="h2">Como o IBS e a CBS tratam o setor</h2>
          <p className="mt-3 text-sm leading-relaxed text-tinta-2">{nicho.tratamento_tributario.resumo}</p>
          <p className="mt-2 text-sm leading-relaxed text-tinta-2"><span className="font-medium text-tinta">Crédito para o cliente: </span>{nicho.tratamento_tributario.credito_ao_cliente}</p>
        </div>
      </section>
    </div>
  );
}
