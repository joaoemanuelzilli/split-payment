import { getBase, estatisticas } from '@/lib/base';
import { getParametros } from '@/lib/dados';
import { pct } from '@/lib/format';

export const metadata = { title: 'Como calculamos' };

export default function ComoCalculamos() {
  const b = getBase();
  const p = getParametros();
  const est = estatisticas();
  return (
    <div className="recipiente py-12 md:py-16">
      <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <h1 className="h1">Como o cálculo funciona</h1>
      <div className="prosa max-w-[44rem] text-tinta-2 lg:pt-2">
        <p>O cálculo compara dois mundos no mesmo ano e com a mesma carga de imposto: um sem split, em que a empresa recolhe na apuração e toma o crédito pelo valor destacado na nota, e outro com split, em que o imposto sai no pagamento e o crédito depende de o fornecedor ter pago o dele (LC 214/2025, arts. 47 e 48). A diferença entre os dois é o capital de giro que a empresa precisa ter a mais, de forma permanente.</p>
        <p>Cada setor tem as suas linhas de receita (quem é o cliente, como paga, em quantos dias, quanto antecipa, qual alíquota) e de compra (quanto gera de crédito e se o crédito é condicionado). O formulário de cada setor muda essas linhas, e o motor calcula ano a ano, de 2027 a 2033.</p>
      </div>
      </div>
      <h2 className="h2 mt-16 border-t border-linha pt-10">As três parcelas do número</h2>
      <ol className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-3">
        <li><p className="text-lg font-semibold">Imposto que sai antes</p><p className="mt-2 leading-relaxed text-tinta-2">Hoje o imposto da venda fica no caixa até o vencimento da apuração, no mês seguinte. Com o split, sai no dia do pagamento. Antecipar recebíveis piora: o imposto que entrava adiantado deixa de entrar.</p></li>
        <li><p className="text-lg font-semibold">Crédito que espera o fornecedor</p><p className="mt-2 leading-relaxed text-tinta-2">O crédito só fica disponível quando o débito do fornecedor é extinto. Quanto maior o prazo pago ao fornecedor, mais o crédito demora.</p></li>
        <li><p className="text-lg font-semibold">Saldo credor</p><p className="mt-2 leading-relaxed text-tinta-2">Se o crédito passa do débito em aberto, a sobra vai para ressarcimento e fica parada. O saldo credor que já existiria sem split (comum com alíquota zero) aparece à parte.</p></li>
      </ol>
      <div className="mt-16 grid gap-x-16 gap-y-12 border-t border-linha pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div>
      <h2 className="h2">Por que dois cenários</h2>
      <p className="mt-3 max-w-[36rem] leading-relaxed text-tinta-2">A regra que diz se o crédito abate a retenção do split em até 48 horas ou só na apuração mensal ainda não foi publicada. O favorável supõe o abatimento rápido; o prudente, só na apuração. Mostramos sempre os dois.</p>
      </div>
      <div>
      <h2 className="h2">Premissas em uso</h2>
      <table className="tabela mt-3">
        <tbody>
          <tr><td>CBS de referência</td><td className="num">{pct(p.cbs_referencia_pct, 'auto')}</td><td className="text-xs text-tinta-3">Calculada pelo TCU; o Senado fixa até 15/12/2026</td></tr>
          <tr><td>IBS cheio em 2033</td><td className="num">{pct(p.ibs_cheio_pct, 'auto')}</td><td className="text-xs text-tinta-3">Projeção do Comitê Gestor; rampa de 10% a 40% de 2029 a 2032</td></tr>
          <tr><td>Adesão ao split em 2027</td><td className="num">{pct(p.adesao_2027_pct, 0)}</td><td className="text-xs text-tinta-3">Etapa facultativa prevista para o 2º semestre</td></tr>
          <tr><td>Adesão a partir de 2028</td><td className="num">{pct(p.adesao_2028_em_diante_pct, 0)}</td><td className="text-xs text-tinta-3">Obrigatória prevista nas vendas entre empresas por boleto, Pix, TED e TEF</td></tr>
          <tr><td>Prazo extra do ressarcimento</td><td className="num">{p.ressarcimento_dias_extra} dias</td><td className="text-xs text-tinta-3">30, 60 ou 180 dias de análise, conforme o caso</td></tr>
        </tbody>
      </table>
      </div>
      </div>
      <div className="mt-16 grid gap-x-16 gap-y-6 border-t border-linha pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <h2 className="h2">A base</h2>
      <div>
      <p className="max-w-[44rem] leading-relaxed text-tinta-2">Versão {b.versao}, de {b.data_referencia.split('-').reverse().join('/')}. São {est.total} setores, cada um com o enquadramento de IBS e CBS e a base legal, premissas marcadas como fato, estimativa ou hipótese, e {est.fontes} páginas de fonte ao todo. Com os valores de exemplo, a plataforma reproduz o resultado calculado da base em todos os setores; esse é o teste de aceite da implementação.</p>
      <p className="mt-6 max-w-[44rem] rounded-lg border border-linha bg-white p-4 text-sm text-tinta-2">É diagnóstico financeiro, não parecer jurídico ou contábil. O enquadramento de cada produto e serviço precisa ser conferido caso a caso, e não prometemos prazo de ressarcimento nem a data do split.</p>
      </div>
      </div>
    </div>
  );
}
