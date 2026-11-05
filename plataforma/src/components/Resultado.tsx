// Tela de resultado. Componente puro: serve ao simulador (navegador) e aos relatórios (servidor).
import type { Resultado as R } from '@/lib/calc';
import type { Nicho } from '@/lib/types';
import { brl, pct } from '@/lib/format';
import GraficoAnos from './GraficoAnos';
import Semaforo from './Semaforo';

export function Manchete({ r }: { r: R }) {
  if (r.derivacao.modo !== 'motor') return null;
  const t = r.teste;
  const ano = r.anos.find(a => a.ano === t.ano)!;
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm text-tinta-2">Capital de giro a mais em {t.ano}, por causa do split</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">
          {brl(ano.favoravel)} <span className="font-semibold text-tinta-3">a</span> {brl(ano.prudente)}
        </p>
        <p className="mt-1 text-sm text-tinta-2">
          Entre {pct(r.pctMes(t.ano, 'favoravel'))} e {pct(r.pctMes(t.ano, 'prudente'))} de um mês de faturamento. Em 2033, com o IBS cheio, o cenário prudente chega a {brl(r.anos[6].prudente)}.
        </p>
      </div>
      <Semaforo veredito={t.verdict} />
    </div>
  );
}

export default function Resultado({ r, nicho, compacto = false }: { r: R; nicho: Nicho; compacto?: boolean }) {
  const d = r.derivacao;
  return (
    <div className="space-y-8">
      {d.mensagens.length > 0 && (
        <ul className="space-y-2">
          {d.mensagens.map((m, i) => (
            <li key={i} className={`rounded border px-3 py-2 text-sm ${m.nivel === 'alerta' ? 'border-[#E9C98F] bg-[#FBF3E6]' : 'border-linha bg-marca-claro'}`}>
              {m.texto}
            </li>
          ))}
        </ul>
      )}
      {d.modo !== 'motor' ? <BlocoSimples r={r} nicho={nicho} /> : <Detalhe r={r} compacto={compacto} />}
      {r.extras.length > 0 && d.modo === 'motor' && <Extras r={r} />}
    </div>
  );
}

function Detalhe({ r, compacto }: { r: R; compacto: boolean }) {
  const t = r.teste;
  const a = r.anos.find(x => x.ano === t.ano)!;
  const comp = [
    { nome: 'Imposto que sai antes', valor: a.debitoAntecipado, texto: 'Com o split, o IBS e a CBS das vendas saem no dia em que o cliente paga, e não mais no vencimento da apuração.' },
    { nome: 'Crédito que espera o fornecedor', valor: a.creditoCondicionado, texto: 'O crédito das compras só fica disponível depois que o imposto do fornecedor é pago (LC 214, art. 47).' },
    { nome: 'Saldo credor que o split acrescenta', valor: a.saldoCredor, texto: 'Quando o crédito passa do débito que ainda está em aberto, a sobra vai para ressarcimento e fica parada.' },
  ];
  const totalComp = comp.reduce((s, c) => s + c.valor, 0) || 1;
  return (
    <>
      <section className="painel p-4 md:p-6">
        <GraficoAnos titulo="Capital de giro a mais por ano" dados={r.anos.map(x => ({ ano: x.ano, favoravel: x.favoravel, prudente: x.prudente }))} />
        <div className="mt-4 overflow-x-auto">
          <table className="tabela">
            <thead>
              <tr><th>Ano</th><th className="num">Alíquota cheia</th><th className="num">Favorável</th><th className="num">Prudente</th><th className="num">Novo no ano</th><th className="num">% de um mês</th></tr>
            </thead>
            <tbody>
              {r.anos.map(x => (
                <tr key={x.ano} className={x.ano === t.ano ? 'bg-marca-claro' : ''}>
                  <td className="font-semibold">{x.ano}</td>
                  <td className="num">{pct(100 * x.aliquota, 'auto')}</td>
                  <td className="num">{brl(x.favoravel)}</td>
                  <td className="num">{brl(x.prudente)}</td>
                  <td className="num">{brl(x.novo)}</td>
                  <td className="num">{pct(r.pctMes(x.ano, 'favoravel'))} a {pct(r.pctMes(x.ano, 'prudente'))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ajuda mt-3">Favorável: o crédito abate a retenção do split em até 48 horas. Prudente: o crédito só abate na apuração mensal. A regra oficial ainda não saiu; os dois aparecem sempre.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="painel p-4 md:p-6">
          <h3 className="h3">De onde vem o número de {t.ano}</h3>
          <p className="ajuda">Cenário prudente, decomposto.</p>
          <ul className="mt-4 space-y-4">
            {comp.map(c => (
              <li key={c.nome}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{c.nome}</span>
                  <span className="tabular-nums">{brl(c.valor)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-papel-3"><div className="h-1.5 rounded bg-tinta-2" style={{ width: `${(100 * c.valor) / totalComp}%` }} /></div>
                {!compacto && <p className="ajuda">{c.texto}</p>}
              </li>
            ))}
          </ul>
          {a.saldoCredorSemSplit > 0.5 && (
            <div className="mt-5 rounded border border-linha bg-papel p-3 text-sm">
              <p className="font-medium">Capital que já fica preso hoje: {brl(a.saldoCredorSemSplit)}</p>
              <p className="ajuda">É o saldo credor que existiria mesmo sem split, porque o crédito passa do débito total (comum com alíquota zero). Não entra no número acima.</p>
            </div>
          )}
        </div>
        <TesteCaixaPainel r={r} />
      </section>
    </>
  );
}

export function TesteCaixaPainel({ r }: { r: R }) {
  const t = r.teste;
  return (
    <div className="painel p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="h3">O caixa aguenta em {t.ano}?</h3>
          <p className="ajuda">Quem cobre a necessidade prudente, nesta ordem: caixa livre, limites, falta.</p>
        </div>
        <Semaforo veredito={t.verdict} pequeno />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <dt className="text-tinta-2">Necessidade</dt><dd className="num font-semibold">{brl(t.need)}</dd>
        <dt className="text-tinta-2">Do caixa livre</dt><dd className="num">{brl(t.fromCash)}</dd>
        <dt className="text-tinta-2">Dos limites de crédito</dt><dd className="num">{brl(t.fromCredit)}</dd>
        <dt className="text-tinta-2">Falta (aporte ou linha nova)</dt><dd className={`num ${t.gap > 0 ? 'font-semibold text-risco' : ''}`}>{brl(t.gap)}</dd>
        <dt className="text-tinta-2">Custo por ano</dt><dd className="num">{brl(t.costYear)}</dd>
        <dt className="text-tinta-2">Custo sobre a geração de caixa</dt><dd className="num">{Number.isFinite(t.pctFco) ? pct(100 * t.pctFco) : 'sem geração informada'}</dd>
      </dl>
      <p className="ajuda mt-4">Verde: o caixa livre cobre e o custo fica abaixo de 5% da geração de caixa. Amarelo: não falta dinheiro e o custo fica abaixo de 15%. Vermelho: os demais casos.</p>
    </div>
  );
}

function Extras({ r }: { r: R }) {
  return (
    <section className="painel p-4 md:p-6">
      <h3 className="h3">Cenários para comparar</h3>
      <p className="ajuda">Cálculos só para exibição. O resultado principal acima não muda.</p>
      {r.extras.map(e => (
        <div key={e.rotulo} className="mt-4">
          <p className="text-sm font-semibold">{e.rotulo}</p>
          {e.descricao && <p className="ajuda">{e.descricao}</p>}
          <div className="mt-2 overflow-x-auto">
            <TabelaAnos anos={e.anos} />
          </div>
        </div>
      ))}
    </section>
  );
}

function BlocoSimples({ r, nicho }: { r: R; nicho: Nicho }) {
  const s = r.simples!;
  const nao = r.derivacao.modo === 'nao_contribuinte';
  return (
    <section className="space-y-6">
      <div className="painel p-4 md:p-6">
        <h3 className="h3">{nao ? 'Fora do IBS e da CBS: a decisão é se vale optar' : 'No Simples puro a pergunta não é o caixa, é o cliente'}</h3>
        <p className="mt-2 text-sm leading-relaxed">{r.derivacao.textoModo || nicho.tratamento_tributario.simples_nacional.tratamento}</p>
      </div>
      {!nao && (
        <div className="painel p-4 md:p-6">
          <h3 className="h3">Crédito que o seu cliente PJ toma a cada R$ 1.000 que você vende</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="tabela">
              <thead><tr><th>Ano</th><th className="num">Fornecedor no regime regular</th><th className="num">Fornecedor no Simples puro</th><th className="num">Diferença no custo do cliente</th></tr></thead>
              <tbody>
                {s.anos.map(a => (
                  <tr key={a.ano}><td className="font-semibold">{a.ano}</td><td className="num">{brl(a.creditoRegular)}</td><td className="num">{brl(a.creditoSimples)}</td><td className="num">{brl(a.diferencaPorMil)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ajuda mt-3">Para vender a empresas do regime regular, o optante do Simples puro fica mais caro na conta do cliente nessa diferença. A opção pelo IBS e pela CBS por fora do DAS abre em março e setembro.</p>
        </div>
      )}
      <div className="painel p-4 md:p-6">
        <h3 className="h3">Se a empresa passar ao regime regular, o split pede este caixa</h3>
        <div className="mt-3 overflow-x-auto">
          <TabelaAnos anos={s.seRegular} />
        </div>
        <p className="ajuda mt-3">Calculado com as linhas do formulário como regime regular. Serve para pesar a decisão: o ganho comercial de transferir crédito contra o caixa que o split vai pedir.</p>
      </div>
    </section>
  );
}

function TabelaAnos({ anos }: { anos: { ano: number; favoravel: number; prudente: number }[] }) {
  return (
    <table className="tabela">
      <thead><tr><th>Ano</th><th className="num">Favorável</th><th className="num">Prudente</th></tr></thead>
      <tbody>{anos.map(a => <tr key={a.ano}><td className="font-semibold">{a.ano}</td><td className="num">{brl(a.favoravel)}</td><td className="num">{brl(a.prudente)}</td></tr>)}</tbody>
    </table>
  );
}

export function AvisosObrigatorios({ nicho }: { nicho: Nicho }) {
  const contratoMensal = nicho.linhas_receita.some(l => /mensal|contrato|recorr/i.test(l.nome));
  const aliqZero = nicho.linhas_receita.some(l => l.aliquota_pct_cheia === 0) || nicho.resultado_exemplo.por_ano.some(a => a.saldo_credor_sem_split > 0);
  const temIS = /seletivo/i.test(JSON.stringify(nicho.tratamento_tributario.regras_relevantes));
  return (
    <aside className="rounded-lg border border-linha bg-papel p-4 text-xs leading-relaxed text-tinta-2">
      <p className="mb-2 font-semibold text-tinta">Leia antes de usar o número</p>
      <ul className="list-disc space-y-1 pl-4">
        <li>É diagnóstico financeiro, não parecer jurídico ou contábil. O enquadramento (reduções, NCM, NBS, art. 127) precisa ser conferido caso a caso.</li>
        <li>As datas do split são previsão da Receita Federal, sem ato normativo publicado: etapa facultativa no 2º semestre de 2027 e obrigatória em 2028 nas vendas entre empresas por boleto, Pix, TED e TEF. Cartão, vale e consumidor final não têm data.</li>
        <li>O cenário favorável supõe que o crédito abate a retenção em até 48 horas; o prudente, só na apuração mensal. A regra ainda não foi publicada. O prudente não é o pior caso: pico de safra ou compra grande de ativo podem passar dele.</li>
        <li>São estimativas: a CBS de 2027 (11,35% calculada pelo TCU, sem resolução do Senado até 15/12/2026), as alíquotas de IBS (projeção do Comitê Gestor), o crédito presumido e o diesel de 2029 em diante.</li>
        <li>O prazo de ressarcimento (30, 60 ou 180 dias) depende do programa de conformidade e do enquadramento. O site não promete prazo.</li>
        {contratoMensal && <li>Em contratos mensais o imposto nasce no vencimento da parcela (LC 214, art. 10, §3º). O prazo do boleto não protege o caixa.</li>}
        {aliqZero && <li>Com alíquota zero, parte do capital preso existe com ou sem split; ele aparece à parte.</li>}
        {temIS && <li>O Imposto Seletivo depende de medida provisória ainda não convertida em lei e não entra no cálculo do caixa.</li>}
      </ul>
    </aside>
  );
}
