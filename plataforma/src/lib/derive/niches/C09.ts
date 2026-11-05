// Fórmulas próprias dos nichos da categoria C09 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Deriver } from '../core';

// C09-01 Escola particular (infantil ao médio)
const c0901: Deriver = c => {
  const conv = c.num('pct_convenio'), mat = c.num('pct_material'), unif = c.num('pct_uniforme_extra'), cant = c.num('pct_cantina');
  const mensalidades = 100 - conv - mat - unif - cant;
  const cartao = c.num('pct_cartao_mensal') / 100;
  c.r('convenio_empresas', 'participacao_pct', conv);
  c.r('material', 'participacao_pct', mat);
  c.r('uniforme_extra', 'participacao_pct', unif);
  c.r('cantina', 'participacao_pct', cant);
  c.r('mensal_cartao', 'participacao_pct', mensalidades * cartao);
  c.r('mensal_boleto', 'participacao_pct', mensalidades * (1 - cartao));
  if (c.bool('simular_b2c')) {
    // HIPÓTESE: segue a derivação do campo (mensal_boleto e uniforme_extra); a regra geral cita "boleto ou Pix", mas o material (Pix) não é citado na derivação.
    c.extra('Cenário futuro: mensalidades e uniforme no split', cc => {
      cc.r('mensal_boleto', 'parcela_sujeita_split_pct', 100);
      cc.r('uniforme_extra', 'parcela_sujeita_split_pct', 100);
    }, 'Hipótese sem data: pagamentos por boleto e Pix de consumidor final passam a ter o imposto separado no split.');
    c.msg('O cenário com mensalidades e uniforme no split é uma hipótese. Não há data definida para isso.', 'info', 'simular_b2c');
  }
};

// C09-02 Escola técnica e curso profissionalizante
const c0902: Deriver = c => {
  const tec = c.num('pct_tecnico_alunos'), livres = c.num('pct_livres_alunos'), emp = c.num('pct_empresas'), pub = c.num('pct_publico');
  const tecEmp = c.num('pct_tecnico_nas_empresas') / 100;
  c.r('tecnico_alunos', 'participacao_pct', tec);
  c.r('livres_alunos', 'participacao_pct', livres);
  c.r('tecnico_empresas', 'participacao_pct', emp * tecEmp);
  c.r('qualificacao_empresas', 'participacao_pct', emp * (1 - tecEmp));
  c.r('publico', 'participacao_pct', pub);
  // Se a soma passar de 100, o resto fica negativo: a camada genérica zera as empresas do Simples e normaliza.
  c.r('empresas_simples', 'participacao_pct', 100 - tec - livres - emp - pub);
  c.msg('Cenário futuro: as mensalidades de alunos por boleto e Pix podem entrar no split mais adiante, sem data definida.', 'info');
};

// C09-03 Treinamento corporativo e educação executiva
const c0903: Deriver = c => {
  const reg = c.num('pct_empresas_regular'), pos = c.num('pct_pos_ies') / 100, simp = c.num('pct_empresas_simples'), pub = c.num('pct_publico');
  c.r('empresas', 'participacao_pct', reg * (1 - pos));
  c.r('pos_ies', 'participacao_pct', reg * pos);
  c.r('empresas_simples', 'participacao_pct', simp);
  c.r('publico', 'participacao_pct', pub);
  // Se a soma passar de 100, o resto fica negativo: a camada genérica zera as pessoas físicas e normaliza.
  c.r('pessoas_fisicas', 'participacao_pct', 100 - reg - simp - pub);
  const ins = c.num('pct_instrutores'), insReg = c.num('pct_instrutores_regular') / 100;
  c.c('instrutores_simples', 'pct_receita', ins * (1 - insReg));
  c.c('instrutores_regular', 'pct_receita', ins * insReg);
  c.msg('Em 2027 a adesão dos clientes corporativos tende a ser maior que a média, porque eles têm crédito cheio a proteger.', 'info');
};

// C09-04 Faculdade e ensino superior
const c0904: Deriver = c => {
  const grad = c.num('pct_graduacao'), fies = c.num('pct_fies'), prouni = c.num('pct_coberta_prouni') / 100;
  c.r('grad_prouni', 'participacao_pct', (grad - fies) * prouni);
  c.r('fies', 'participacao_pct', fies * prouni);
  c.r('grad_sem_prouni', 'participacao_pct', grad * (1 - prouni));
  const pos = c.num('pct_pos'), emp = c.num('pct_empresas');
  c.r('pos_extensao', 'participacao_pct', pos);
  c.r('empresas', 'participacao_pct', emp);
  // Se a soma passar de 100, o resto fica negativo: a camada genérica zera as outras receitas e normaliza.
  c.r('outras', 'participacao_pct', 100 - grad - pos - emp);
  if (prouni === 0) {
    // Sem Prouni, a graduação usa a alíquota de 40% da cheia, sem alíquota específica.
    for (const l of ['grad_prouni', 'fies']) {
      c.r(l, 'aliquota_especifica_por_ano', null);
      c.r(l, 'aliquota_pct_cheia', 40);
    }
  }
  c.msg('Com CBS zero nas linhas do Prouni e do Fies, o saldo credor vai para ressarcimento. O prazo de ressarcimento é a entrada que mais mexe no resultado.', 'info');
};

// C09-05 Escola de idiomas e cursos livres
const c0905: Deriver = c => {
  const emp = c.num('pct_empresas'), empSimp = c.num('pct_empresas_simples') / 100, mat = c.num('pct_material');
  c.r('in_company', 'participacao_pct', emp * (1 - empSimp));
  c.r('in_company_simples', 'participacao_pct', emp * empSimp);
  c.r('material', 'participacao_pct', mat);
  const alunos = 100 - emp - mat, cartao = c.num('pct_cartao') / 100;
  c.r('mensal_cartao', 'participacao_pct', alunos * cartao);
  c.r('mensal_boleto', 'participacao_pct', alunos * (1 - cartao));
  const aliq = c.num('aliquota_cursos');
  for (const l of ['mensal_boleto', 'mensal_cartao', 'in_company', 'in_company_simples']) c.r(l, 'aliquota_pct_cheia', aliq);
  c.msg('Cenário futuro: as mensalidades por boleto e Pix podem entrar no split mais adiante, sem data definida e com alíquota cheia.', 'info');
};

export const derivers: Record<string, Deriver> = {
  'C09-01': c0901, 'C09-02': c0902, 'C09-03': c0903, 'C09-04': c0904, 'C09-05': c0905,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
