import { notFound } from 'next/navigation';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { calcular, custoAcumulado, precoSugerido } from '@/lib/calc';
import { getEmpresa, getFaixas, getMarca, getParceiro, listarSimulacoes, podeVer } from '@/lib/dados';
import { brl, dataBR, pct } from '@/lib/format';
import { Logo } from '@/components/Site';
import BotaoImprimir from '@/components/BotaoImprimir';

export const metadata = { title: 'Proposta' };

export default async function Proposta({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const e = await getEmpresa(Number((await params).id));
  if (!e || !podeVer(u, e)) notFound();
  const s = (await listarSimulacoes(u, e.id))[0];
  if (!s) notFound();
  const n = getNicho(s.nicho_id)!;
  const r = calcular(n, { valores: s.valores, caixa: s.caixa, parametros: s.parametros });
  const preco = precoSugerido(r.receitaMensal, await getFaixas());
  const m = await getMarca();
  const parceiro = e.parceiro_id ? await getParceiro(e.parceiro_id) : undefined;
  const t = r.teste;
  const fav = r.anos.find(a => a.ano === t.ano)!.favoravel;
  return (
    <article className="mx-auto max-w-3xl bg-white px-8 py-10 print:px-0 print:py-0">
      <header className="flex items-center justify-between border-b-2 border-tinta pb-4">
        <Logo nome={m.nome} logoUrl={m.logoUrl} />
        <BotaoImprimir />
      </header>
      <p className="mt-6 text-sm text-tinta-2">Proposta para {e.nome}{parceiro ? `, em parceria com ${parceiro.nome}` : ''}. {dataBR(Date.now())}.</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Preparar o caixa para o split payment</h1>
      <section className="prosa mt-6 text-[15px]">
        <p>Pelo cálculo preliminar feito com os números de {e.nome}, o split payment de IBS e CBS vai pedir entre {brl(fav)} e {brl(t.need)} a mais de capital de giro em {t.ano}, ou {pct(r.pctMes(t.ano, 'favoravel'))} a {pct(r.pctMes(t.ano, 'prudente'))} de um mês de faturamento. Em 2033, com o IBS cheio, o cenário prudente chega a {brl(r.anos[6].prudente)}.</p>
        <p>A carga de imposto não muda; o prazo muda. Carregar essa necessidade de 2027 a 2033 com caixa próprio e linhas de crédito custa cerca de {brl(custoAcumulado(r))} em juros e rendimento perdido. Com {r.derivacao.modo === 'motor' && t.gap > 0 ? `uma falta de ${brl(t.gap)} que o caixa e os limites de hoje não cobrem, ` : ''}a pergunta é como precisar de menos e pagar menos pelo que faltar.</p>
      </section>
      <h2 className="h2 mt-8">O que propomos</h2>
      <table className="tabela mt-3">
        <thead><tr><th>Etapa</th><th>O que entrega</th><th className="num">Investimento</th></tr></thead>
        <tbody>
          <tr><td className="font-semibold">1. Diagnóstico</td><td>Duas a três semanas. Conferência do enquadramento de cada produto e serviço, prazos reais de clientes e fornecedores, necessidade por ano de 2027 a 2033 nos dois cenários e reunião com os sócios.</td><td className="num whitespace-nowrap">{brl(preco.diagnostico)}</td></tr>
          <tr><td className="font-semibold">2. Execução</td><td>Renegociar prazos, trocar antecipação de recebíveis pela base líquida, contratar limite antes de precisar, revisar preço, contratos longos e a decisão de regime.</td><td className="num whitespace-nowrap">Escopo após o diagnóstico</td></tr>
          <tr><td className="font-semibold">3. Acompanhamento</td><td>Atualizar a conta a cada norma nova, acompanhar saldo credor e ressarcimento e planejar cada ano da rampa até 2033.</td><td className="num whitespace-nowrap">{brl(preco.acompanhamento)}/mês</td></tr>
        </tbody>
      </table>
      <h2 className="h2 mt-8">Condições</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
        <li>O resultado é entregue como faixa, com os dois cenários. Quando sair a regra de compensação do crédito, a conta é revista sem custo dentro do acompanhamento.</li>
        <li>É diagnóstico financeiro. Pontos de enquadramento duvidosos são validados com escritório tributário habilitado.</li>
        <li>As datas do split são previsão da Receita Federal, sem ato normativo publicado em {dataBR(Date.now())}.</li>
      </ul>
      <p className="mt-8 text-sm font-semibold">{m.nome} · {m.telefone} · {m.email}</p>
    </article>
  );
}
