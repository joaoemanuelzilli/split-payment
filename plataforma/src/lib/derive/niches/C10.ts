// Fórmulas próprias dos nichos da categoria C10 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Deriver } from '../core';

export const derivers: Record<string, Deriver> = {
  // Escritório de contabilidade
  'C10-01': c => {
    const reg = c.num('pct_clientes_regular'), avu = c.num('pct_avulsos_regular'), pf = c.num('pct_pf');
    c.r('honorarios_regular', 'participacao_pct', reg);
    c.r('avulsos_regular', 'participacao_pct', avu);
    c.r('mei_pf', 'participacao_pct', pf);
    c.r('honorarios_simples', 'participacao_pct', 100 - reg - avu - pf);
    // HIPÓTESE: "simular o honorário de 2033" fica como aviso, sem cálculo extra, porque a derivacao não traz fórmula.
    c.msg('O ISS fixo do escritório contábil some em 2033 e a carga passa a acompanhar o faturamento. Confira o honorário de 2033.', 'info');
  },
  // Escritório de advocacia
  'C10-02': c => {
    const par = c.num('pct_partido'), exi = c.num('pct_exito'), sim = c.num('pct_simples'), suc = c.num('pct_sucumbencia');
    c.r('partido_regular', 'participacao_pct', par);
    c.r('exito_regular', 'participacao_pct', exi);
    c.r('clientes_simples', 'participacao_pct', sim);
    c.r('sucumbencia', 'participacao_pct', suc);
    c.r('pessoa_fisica', 'participacao_pct', 100 - par - exi - sim - suc);
    // sucumbência: recebe tributa_sucumbencia se cumpre_127 = 70; com cumpre_127 = 100 vai a 100 só se o escritório tributa
    const tributa = c.num('tributa_sucumbencia');
    const aliq = c.num('cumpre_127') === 70 ? tributa : tributa === 70 ? 100 : 0;
    c.r('sucumbencia', 'aliquota_pct_cheia', aliq);
    c.msg('O êxito entra como média mensal. Um êxito grande concentra o efeito no mês do recebimento.', 'alerta', 'pct_exito');
  },
  // Consultoria de engenharia e projetos
  'C10-03': c => {
    const priv = c.num('pct_privado'), sinal = c.num('pct_sinal') / 100, pub = c.num('pct_publico'), sim = c.num('pct_simples');
    c.r('projetos_privados', 'participacao_pct', priv * (1 - sinal));
    c.r('sinal_privado', 'participacao_pct', priv * sinal);
    c.r('publico', 'participacao_pct', pub);
    c.r('clientes_simples', 'participacao_pct', sim);
    c.r('pessoa_fisica', 'participacao_pct', 100 - priv - pub - sim);
    const proj = c.num('pct_projetistas');
    c.c('projetistas_regular', 'pct_receita', (proj * 6) / 14);
    c.c('projetistas_simples', 'pct_receita', (proj * 8) / 14);
    if (sinal > 0) c.msg('O sinal é tratado como recebimento à vista. Se o projeto leva meses para ser entregue, o efeito no caixa muda.', 'alerta', 'pct_sinal');
    c.msg('Se a empresa também executa obra, use o nicho de construtora para essa parte (redução de 50%).', 'info');
  },
  // Arquitetura e design de interiores
  'C10-04': c => {
    const emp = c.num('pct_empresas'), sinal = c.num('pct_sinal') / 100, rt = c.num('pct_rt'), ref = c.num('pct_reformas');
    c.r('projetos_empresas', 'participacao_pct', emp * (1 - sinal));
    c.r('sinal_empresas', 'participacao_pct', emp * sinal);
    c.r('rt_lojas', 'participacao_pct', rt);
    c.r('execucao_reformas', 'participacao_pct', ref);
    c.r('projetos_pf', 'participacao_pct', 100 - emp - rt - ref);
    c.c('materiais_reforma', 'pct_receita', ref * 0.4);
    c.c('empreiteiros', 'pct_receita', ref / 3);
    if (c.num('tem_cau') === 100) c.msg('Sem o registro profissional, a redução cai para toda a sociedade. Considere separar o designer em outra empresa.', 'alerta', 'tem_cau');
  },
  // Consultoria agronômica e topografia
  'C10-05': c => {
    const atec = c.num('pct_atec_regular'), topoReg = c.num('pct_topo_regular'), topoPf = c.num('pct_topo_pf'), pub = c.num('pct_publico');
    c.r('atec_regular', 'participacao_pct', atec);
    c.r('topografia_regular', 'participacao_pct', topoReg);
    c.r('topografia_pf', 'participacao_pct', topoPf);
    c.r('publico', 'participacao_pct', pub);
    c.r('atec_pf', 'participacao_pct', 100 - atec - topoReg - topoPf - pub);
    const comb = c.num('pct_veiculos_combustivel') / 2;
    c.c('combustivel', 'pct_receita', comb);
    c.c('veiculos', 'pct_receita', comb);
    const fat = c.num('faturamento_mensal');
    c.c('equipamentos', 'pct_receita', fat > 0 ? (100 * c.num('compra_equipamentos_ano')) / 12 / fat : 0);
    if (c.num('aplica_diferimento') === 0) c.msg('A assistência técnica diferida entra com alíquota 0. O crédito das compras pode virar saldo credor, e isso depende de o prestador manter os créditos.', 'info', 'aplica_diferimento');
    c.msg('O faturamento é sazonal. O cálculo usa a média mensal, mas a safra concentra os recebimentos.', 'alerta', 'faturamento_mensal');
  },
  // Economia, estatística e pesquisa de mercado
  'C10-06': c => {
    const emp = c.num('pct_empresas'), sinal = c.num('pct_sinal') / 100, pub = c.num('pct_publico'), ele = c.num('pct_eleitoral'), ext = c.num('pct_exterior');
    c.r('pesquisas_empresas', 'participacao_pct', emp * (1 - sinal));
    c.r('sinal_empresas', 'participacao_pct', emp * sinal);
    c.r('publico', 'participacao_pct', pub);
    c.r('eleitoral_entidades', 'participacao_pct', ele);
    c.r('exterior', 'participacao_pct', ext);
    c.r('clientes_simples', 'participacao_pct', 100 - emp - pub - ele - ext);
    const campo = c.num('pct_campo');
    c.c('campo_regular', 'pct_receita', campo / 3);
    c.c('campo_simples', 'pct_receita', (campo * 2) / 3);
    if (sinal > 0) c.msg('O sinal é tratado como recebimento à vista. Se o trabalho de campo leva meses, o efeito no caixa muda.', 'alerta', 'pct_sinal');
    if (ele > 0) c.msg('Em ano eleitoral, a linha de pesquisas eleitorais muda a média do ano.', 'alerta', 'pct_eleitoral');
  },
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
