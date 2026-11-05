import Link from 'next/link';
import { estatisticas, nichoSlug } from '@/lib/base';
import { getParametros } from '@/lib/dados';
import { brl, pct } from '@/lib/format';

export default function Inicio() {
  const p = getParametros();
  const est = estatisticas();
  const venda = 10000;
  const imp28 = venda * (p.cbs_referencia_pct / 100);
  const imp33 = venda * ((p.cbs_referencia_pct + p.ibs_cheio_pct) / 100);
  const parteEmpresa = (100 * venda) / (venda + imp28);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          Quando o cliente pagar, o imposto já vai ter saído.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-tinta-2">
          Com o split payment de IBS e CBS, o banco separa o imposto no momento do pagamento e manda direto ao Fisco. A carga não muda, o prazo muda. Calcule quanto capital de giro a sua empresa vai precisar a mais, de 2027 a 2033.
        </p>

        <figure className="mt-12 max-w-4xl" aria-label={`Exemplo: boleto de ${brl(venda + imp28)} pago por cliente do regime regular em 2028`}>
          <figcaption className="mb-3 text-sm text-tinta-2">Um boleto de {brl(venda + imp28)} pago por um cliente do regime regular em 2028</figcaption>
          <div className="split-barra flex h-20 w-full overflow-hidden rounded-lg md:h-24">
            <div className="split-empresa flex items-end bg-marca p-3 text-white md:p-4" style={{ width: `${parteEmpresa}%` }}>
              <span>
                <span className="block text-xs opacity-80 md:text-sm">Entra na conta da empresa</span>
                <span className="text-xl font-bold tabular-nums md:text-2xl">{brl(venda)}</span>
              </span>
            </div>
            <div className="split-fisco flex items-end bg-retido p-2 text-white md:p-3" style={{ width: `${100 - parteEmpresa}%` }}>
              <span className="text-sm font-bold tabular-nums md:text-base">{brl(imp28)}</span>
            </div>
          </div>
          <div className="mt-2 flex justify-end text-sm text-tinta-2">
            <span className="max-w-[16rem] text-right">vai direto para o Fisco no mesmo dia, antes do vencimento da apuração</span>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-tinta-2">
            Em 2033, com o IBS cheio, a mesma venda de {brl(venda)} leva {brl(imp33)} de imposto. Hoje esse dinheiro fica no caixa por cerca de um mês e paga fornecedor e folha. Com o split, ele deixa de passar pela empresa, e o crédito das compras só vale depois que o fornecedor pagar o dele.
          </p>
        </figure>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/setores" className="btn-primario px-6 py-3 text-base">Calcular para o meu setor</Link>
          <Link href="/como-calculamos" className="btn-secundario px-6 py-3 text-base">Como o cálculo funciona</Link>
        </div>
      </section>

      <section className="border-y border-linha bg-papel-2">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="h2">Quem vai sentir mais</h2>
            <p className="mt-3 leading-relaxed text-tinta-2">
              Calculamos {est.total} setores com uma empresa típica de cada. Na mediana, o capital extra em 2028 é de {pct(est.mediana2028)} de um mês de faturamento, e sobe para {pct(est.mediana2033)} em 2033. Indústria, atacado e serviços entre empresas ficam bem acima disso. Saúde, educação, restaurantes e varejo, bem abaixo, porque cartão e consumidor final ainda não têm data para entrar no split.
            </p>
          </div>
          <ol className="divide-y divide-linha border-y border-linha">
            {est.maisExpostos.map(n => (
              <li key={n.id}>
                <Link href={`/setores/${nichoSlug(n)}`} className="flex items-baseline justify-between gap-4 py-3 hover:text-marca">
                  <span>
                    <span className="font-semibold">{n.nicho}</span>
                    <span className="block text-xs text-tinta-3">{n.categoria}</span>
                  </span>
                  <span className="shrink-0 text-right tabular-nums">
                    <span className="font-semibold">{pct(n.resultado_exemplo.pct_um_mes_receita_2028.prudente)}</span>
                    <span className="block text-xs text-tinta-3">de um mês, 2028</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="h2">O calendário que importa para o caixa</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-5">
          {[
            ['Até 15/12/2026', 'O Senado fixa a CBS de 2027. Sem resolução, vale a alíquota calculada pelo TCU.'],
            ['01/01/2027', 'A CBS entra no lugar de PIS e Cofins. O split ainda não roda.'],
            ['2º semestre de 2027', 'Split facultativo nas vendas entre empresas por boleto, Pix, TED e TEF. Previsão da Receita.'],
            ['2028', 'Split obrigatório previsto nessas vendas. É o ano do primeiro choque de caixa.'],
            ['2029 a 2033', 'O IBS sobe em rampa e chega cheio em 2033. A necessidade de caixa cresce junto.'],
          ].map(([data, txt]) => (
            <li key={data} className="border-t-2 border-marca pt-3">
              <p className="font-bold">{data}</p>
              <p className="mt-1 text-sm leading-relaxed text-tinta-2">{txt}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
        <div className="painel p-6">
          <h2 className="h2">Para a empresa</h2>
          <p className="mt-2 leading-relaxed text-tinta-2">
            A calculadora dá a faixa. O diagnóstico com os seus números responde três coisas: de onde vem o dinheiro, quanto custa e o que mudar em preço, prazo e contrato para precisar de menos. Contratar o limite antes de precisar sai mais barato do que no aperto de 2028.
          </p>
          <Link href="/setores" className="btn-primario mt-5">Escolher o setor</Link>
        </div>
        <div className="painel p-6">
          <h2 className="h2">Para escritórios de contabilidade</h2>
          <p className="mt-2 leading-relaxed text-tinta-2">
            Seus clientes vão perguntar sobre o caixa, e o escritório não precisa montar uma área de finanças para responder. Ofereça a calculadora com a sua marca, receba os contatos e divida o honorário do diagnóstico.
          </p>
          <Link href="/contadores" className="btn-secundario mt-5">Ser parceiro</Link>
        </div>
      </section>
    </>
  );
}
