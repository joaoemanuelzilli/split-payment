import { getNicho } from '@/lib/base';
import { calcular } from '@/lib/calc';
import { getEmpresa, getMarca, getParceiro, simulacaoDesatualizada, type Simulacao } from '@/lib/dados';
import { opcoesDe } from '@/lib/derive/core';
import { brl, dataBR, pct } from '@/lib/format';
import Resultado, { AvisosObrigatorios, Manchete } from './Resultado';
import { Logo } from './Site';
import BotaoImprimir from './BotaoImprimir';

export default function Relatorio({ s, interno = false }: { s: Simulacao; interno?: boolean }) {
  const n = getNicho(s.nicho_id)!;
  const r = calcular(n, { valores: s.valores, caixa: s.caixa, parametros: s.parametros });
  const marca = getMarca();
  const empresa = s.empresa_id ? getEmpresa(s.empresa_id) : undefined;
  const parceiro = empresa?.parceiro_id ? getParceiro(empresa.parceiro_id) : undefined;
  const desatualizada = simulacaoDesatualizada(s);
  const valorCampo = (id: string) => {
    const f = n.campos_especificos.find(x => x.id === id)!;
    const v = s.valores[id];
    if (f.tipo === 'selecao') return opcoesDe(f).find(o => o.valor === v)?.rotulo ?? String(v);
    if (f.tipo === 'booleano') return v ? 'Sim' : 'Não';
    if (f.tipo === 'moeda') return brl(Number(v));
    if (f.tipo === 'percentual') return pct(Number(v));
    return `${String(v).replace('.', ',')} ${f.unidade || (f.tipo === 'dias' ? 'dias' : f.tipo === 'meses' ? 'meses' : '')}`;
  };

  return (
    <article className="mx-auto max-w-5xl bg-white px-6 py-8 print:max-w-none print:px-0 print:py-0 md:px-10">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-tinta pb-4">
        <div className="flex items-center gap-4">
          <Logo nome={marca.nome} logoUrl={marca.logoUrl} />
          {parceiro && <span className="text-sm text-tinta-2">em parceria com <strong className="text-tinta">{parceiro.nome}</strong></span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-tinta-2">Emitido em {dataBR(s.atualizado_em + 'Z')}</span>
          <BotaoImprimir />
        </div>
      </header>

      <section className="mt-6">
        <p className="text-sm text-tinta-2">Diagnóstico de caixa do split payment de IBS e CBS</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{empresa?.nome ?? s.nome}</h1>
        <p className="mt-1 text-tinta-2">{n.categoria}: {n.nicho}</p>
        {desatualizada && interno && (
          <p className="nao-imprimir mt-3 rounded border border-[#E9C98F] bg-[#FBF3E6] px-3 py-2 text-sm">Esta simulação usa premissas diferentes das atuais da plataforma. Abra no simulador e salve de novo para atualizar, ou use o recálculo geral nas configurações.</p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-linha p-5"><Manchete r={r} /></section>
      <div className="mt-6"><Resultado r={r} nicho={n} compacto /></div>

      <section className="quebra-antes mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="h2">Os números usados</h2>
          <table className="tabela mt-3">
            <tbody>
              {n.campos_especificos.map(f => (
                <tr key={f.id}><td className="text-tinta-2">{f.rotulo}</td><td className="num whitespace-nowrap">{valorCampo(f.id)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="h2">Caixa e premissas</h2>
          <table className="tabela mt-3">
            <tbody>
              <tr><td className="text-tinta-2">Caixa hoje</td><td className="num">{brl(s.caixa.caixa)}</td></tr>
              <tr><td className="text-tinta-2">Caixa mínimo</td><td className="num">{brl(s.caixa.caixa_minimo)}</td></tr>
              <tr><td className="text-tinta-2">Limites não usados</td><td className="num">{brl(s.caixa.limites)}</td></tr>
              <tr><td className="text-tinta-2">Custo do crédito</td><td className="num">{pct(s.caixa.custo_credito_pct_am, 'auto')} a.m.</td></tr>
              <tr><td className="text-tinta-2">Geração de caixa por mês</td><td className="num">{brl(s.caixa.geracao_caixa_mes)}</td></tr>
              <tr><td className="text-tinta-2">CBS de referência</td><td className="num">{pct(s.parametros.cbs_referencia_pct, 'auto')}</td></tr>
              <tr><td className="text-tinta-2">IBS cheio em 2033</td><td className="num">{pct(s.parametros.ibs_cheio_pct, 'auto')}</td></tr>
              <tr><td className="text-tinta-2">Adesão ao split em 2027 / 2028 em diante</td><td className="num">{pct(s.parametros.adesao_2027_pct, 0)} / {pct(s.parametros.adesao_2028_em_diante_pct, 0)}</td></tr>
              <tr><td className="text-tinta-2">Prazo extra do ressarcimento</td><td className="num">{s.parametros.ressarcimento_dias_extra} dias</td></tr>
              <tr><td className="text-tinta-2">CDI</td><td className="num">{pct(s.parametros.cdi_pct_aa, 'auto')} a.a.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="h2">O que pesa neste setor</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          {n.split.observacoes.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </section>

      <section className="mt-10 rounded-lg bg-marca-claro p-5">
        <h2 className="h2">Próximo passo</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Este número é uma faixa calculada com médias. O diagnóstico com os dados reais da empresa confere o enquadramento de cada produto e serviço, mede o prazo de clientes e fornecedores e entrega um plano: de onde vem o dinheiro, quanto custa e o que mudar em preço, prazo e contrato para precisar de menos.
        </p>
        <p className="mt-3 text-sm font-semibold">{parceiro ? `${parceiro.nome}${parceiro.telefone ? ' · ' + parceiro.telefone : ''}${parceiro.email ? ' · ' + parceiro.email : ''}` : `${marca.nome} · ${marca.telefone} · ${marca.email}`}</p>
      </section>

      <div className="mt-8"><AvisosObrigatorios nicho={n} /></div>
      {interno && (
        <p className="mt-4 text-xs text-tinta-3">Base de nichos {s.versao_base}. Motor de cálculo v2. Simulação nº {s.id}.</p>
      )}
    </article>
  );
}
