#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Modelo financeiro — empresa nova em Uberlândia (MG): consultoria → software para a
Reforma Tributária do consumo (IBS/CBS, split payment). Data-base: 01/11/2026.

Tudo em R$ nominais. Mês 1 = nov/2026 (t=0). Horizonte: nov/2026 a dez/2036 (122 meses).
Saídas: CSVs na mesma pasta (prefixo modelo_). Depende só de numpy e da biblioteca padrão.

Marcação das premissas (ver tabela no relatório): [F] fato com fonte nas notas; [E] estimativa
com conta aberta; [H] hipótese a validar em campo.
"""
import csv
import math
import os
from dataclasses import dataclass, field, replace
from typing import Dict, List, Tuple

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
START_YEAR, START_MONTH = 2026, 11
END_YEAR = 2036
N_MONTHS = (END_YEAR - START_YEAR) * 12 + (12 - START_MONTH + 1)  # 122

MESES_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]


def cal(t: int) -> Tuple[int, int]:
    """índice do mês -> (ano, mês)"""
    m0 = (START_YEAR * 12 + START_MONTH - 1) + t
    return m0 // 12, m0 % 12 + 1


def label(t: int) -> str:
    y, m = cal(t)
    return f"{MESES_PT[m-1]}/{str(y)[2:]}"


# ----------------------------------------------------------------------------------
# PREMISSAS
# ----------------------------------------------------------------------------------
@dataclass
class P:
    # Capital e fundador
    capital_inicial: float = 100_000.0          # [H] premissa do fundador
    renda_atual_mes: float = 10_000.0           # [H] renda que deixa de ganhar
    renda_atual_g: float = 0.04                 # [E] crescimento nominal da renda alternativa (IPCA ~4%)
    stake_fundador: float = 0.70                # [H] 70% fundador / 30% sócio CRC com vesting 4 anos
    pro_labore_fundador_mes_inicio: int = 6     # t=6 => mai/2027 = 7º mês [H premissa: R$ 8 mil a partir do mês 7]
    pro_labore_fundador_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 8_000, 2028: 8_000, 2029: 10_000, 2030: 10_000, 2031: 12_000, 2032: 12_000,
        2033: 14_000, 2034: 14_000, 2035: 15_000, 2036: 15_000})
    pro_labore_socio_crc_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 4_000, 2028: 7_000, 2029: 9_000, 2030: 9_000, 2031: 10_000, 2032: 10_000,
        2033: 12_000, 2034: 12_000, 2035: 12_000, 2036: 12_000})
    socio_crc_mes_inicio: int = 3               # t=3 => fev/2027 (depois de 3 meses de pré-venda)
    custo_abertura: float = 8_000.0             # [E] JUCEMG, e-CNPJ, marca INPI, site, acordo de sócios (nota 06: R$ 1,2–3 mil + advogado R$ 3–10 mil)
    capex_inicial: float = 8_000.0              # [H] notebooks/equipamentos
    capex_anual_base: float = 4_000.0           # [H] reposição anual a partir de 2028
    capex_por_funcionario: float = 3_000.0      # [H] por novo CLT
    vida_util_meses: int = 36

    # Preços (R$ de 2027; inflação anual aplicada de 2028 em diante)
    preco_retainer: float = 1_500.0             # [F] faixa R$ 1.500–3.700 (nota 03/04); PME R$ 500–1.500 (nota 05) -> piso da faixa
    preco_diagnostico: float = 4_000.0          # [F] R$ 2–15 mil (nota 03); PME R$ 3–8 mil (nota 05)
    preco_projeto_media: float = 25_000.0       # [E] R$ 15–60 mil para médias (nota 05)
    preco_software_cnpj_liq: float = 140.0      # [E] lista R$ 199 (nota 04/05) menos desconto de revenda ao contador ~30% (2027–28)
    preco_software_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 140, 2027: 140, 2028: 140, 2029: 155, 2030: 155, 2031: 165, 2032: 165, 2033: 165, 2034: 165, 2035: 165, 2036: 165})  # [H] upsell de módulos (apuração assistida 2029, split) em R$ de 2027; NRR>100% (nota 08)
    receita_workshops_mes: float = 1_500.0      # [E] 1 workshop/trimestre × 15 pax × R$ 300 (Benchimol, nota 08) -> R$ 4,5 mil/trim
    inflacao_preco: float = 0.04                # [E] IPCA Focus 2027 4,34%, 2028 3,75% (nota 06)
    inflacao_custo: float = 0.045               # [E] salários acima do IPCA (vagas fiscais +138%, nota 03)

    # Horas (capacidade e consumo)
    horas_retainer: float = 6.0                 # [H] nota 05 (2027–28); cai com a produtização (ver horas_retainer_por_ano)
    horas_retainer_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 6, 2027: 6, 2028: 6, 2029: 5, 2030: 4, 2031: 4, 2032: 3.5, 2033: 3.5, 2034: 3.5, 2035: 3.5, 2036: 3.5})  # [H] "o que repete em 3 clientes vira feature" (nota 08)
    horas_diagnostico: float = 25.0             # [E] nota 05 (15–30 h) em 2027
    horas_diag_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 25, 2027: 25, 2028: 20, 2029: 15, 2030: 15, 2031: 15, 2032: 15, 2033: 15, 2034: 15, 2035: 15, 2036: 15})  # [H] templates/ferramenta interna
    horas_projeto_media: float = 80.0           # [H]
    horas_onboarding_cnpj: float = 3.0          # [H]
    horas_suporte_cnpj_mes: float = 0.25        # [H]
    horas_fundador: float = 50.0                # [H] restante: vendas e produto
    horas_socio_crc: float = 60.0               # [H] sócio técnico (CRC) parcialmente dedicado no início
    horas_analista: float = 100.0               # [E] 100 h faturáveis/mês (nota 05)
    cnpjs_por_cs: int = 400                     # [H] low-touch via contador (1ª linha é o escritório); nota 05 cita 100–200 p/ venda direta
    cnpjs_para_1o_cs: int = 150                 # [H]
    cnpjs_para_1o_gerente_canal: int = 200      # [H] 1 gerente de canal; 2º só com 700 CNPJs
    cnpjs_para_2o_gerente_canal: int = 700
    cnpjs_para_1o_dev: int = 25                 # [H] fundador codifica até aí (nota 08: dev só quando fundador é gargalo)
    cnpjs_para_2o_dev: int = 500
    caixa_min_para_contratar_meses: float = 3.0 # [H] disciplina: só contrata com caixa ≥ 3 meses de custo fixo
    margem_min_para_escalar_pro_labore: float = 0.05  # [H] pró-labore só sobe se a margem EBITDA dos últimos 12 meses ≥ 5%
    fator_r_alvo_inicio: float = 0.30           # [E] pró-labore ≥ 28% da receita nos meses iniciais para ficar no Anexo III (nota 06)

    # Custos de pessoal (R$/mês, custo total no Simples, nota 05 tabela)
    custo_analista: float = 9_046.0             # [F] analista fiscal pleno CLT no Simples
    custo_dev: float = 10_831.0                 # [F] dev full stack pleno (Indeed SP) CLT no Simples
    custo_cs: float = 6_243.0                   # [F] customer success coordinator
    custo_gerente_canal: float = 7_135.0 + 2_500.0 * 1.2744  # [E] SDR/AE pleno fixo + variável média
    # Overhead e marketing
    overhead_base_fase1: float = 3_000.0        # [E] meses 1–6, remoto (nota 05: R$ 2,6–6 mil)
    overhead_base: float = 5_000.0              # [E] a partir do mês 7
    overhead_por_funcionario: float = 800.0     # [H] ferramentas/licenças por pessoa
    infra_por_cnpj: float = 8.0                 # [H] nuvem/e-mail/monitoramento (nota 05: R$ 5–10)
    api_por_cnpj_apos_2029: float = 15.0        # [E] API fiscal quando ingerir documentos (nota 05: R$ 25–29 p/ 200 docs)
    marketing_fixo_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 500, 2027: 1_500, 2028: 3_000, 2029: 5_000, 2030: 5_000, 2031: 5_000, 2032: 5_000,
        2033: 5_000, 2034: 4_000, 2035: 4_000, 2036: 4_000})
    cac_retainer: float = 800.0                 # [E] custo variável de aquisição por retainer (eventos, mídia); tempo do fundador já está no pró-labore
    cac_diagnostico: float = 400.0              # [E]
    cac_cnpj: float = 300.0                     # [E] via canal contador (nota 05: 1/10 do CAC direto)
    cac_mult: float = 1.0                       # sensibilidade
    taxa_pagamento_consultoria: float = 3.0     # [F] Pix/boleto R$ 2–4 por recebimento (nota 05)
    taxa_pagamento_software: float = 0.01       # [E] boleto ao escritório; mix com cartão
    provisao_perdas: float = 0.03               # [E] inadimplência PME recorde (Serasa, nota 05): 3–5%

    # Funil / conversão (nota 05: lead→reunião 25–40%, reunião→proposta 50–70%, proposta→fechamento 20–35%)
    conv_diag_para_retainer: float = 0.40       # [H] critério de parada da nota 07: ≥30% em 6 meses
    frio_lead_reuniao: float = 0.325            # [H] lead frio (conteúdo, evento, anúncio)
    frio_reuniao_proposta: float = 0.60
    frio_proposta_fech: float = 0.275
    ind_lead_reuniao: float = 0.60              # [H] lead indicado por contador parceiro
    ind_reuniao_proposta: float = 0.80
    ind_proposta_fech: float = 0.40
    share_indicado_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0.3, 2027: 0.3, 2028: 0.5, 2029: 0.7, 2030: 0.7, 2031: 0.7, 2032: 0.7, 2033: 0.7, 2034: 0.7, 2035: 0.7, 2036: 0.7})  # [H]
    horas_por_reuniao: float = 2.0              # [H] inclui preparo e deslocamento/vídeo
    horas_por_proposta: float = 2.0             # [H]
    horas_prospeccao_mes: float = 20.0          # [H] conteúdo, LinkedIn, visitas a escritórios

    # Churn mensal
    churn_retainer_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0.0, 2027: 0.015, 2028: 0.015, 2029: 0.015, 2030: 0.02, 2031: 0.02, 2032: 0.02,
        2033: 0.025, 2034: 0.03, 2035: 0.03, 2036: 0.03})   # [E] nota 05: 1–2% até 2028, subindo 2029–33
    churn_software_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0.0, 2027: 0.015, 2028: 0.015, 2029: 0.015, 2030: 0.015, 2031: 0.015, 2032: 0.015,
        2033: 0.02, 2034: 0.02, 2035: 0.02, 2036: 0.02})    # [F] 11–13% a.a. SMB (ChartMogul/Benchmarkit, nota 05)
    churn_parceiro_mes: float = 0.005           # [H]

    # Software: lançamento e canal
    software_lancamento_t: int = 10             # t=10 => set/2027 (fase 10→100 do playbook, nota 08)
    novos_parceiros_mes_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 0.75, 2028: 0.75, 2029: 1.0, 2030: 1.0, 2031: 0.75, 2032: 0.5, 2033: 0.5,
        2034: 0.25, 2035: 0.25, 2036: 0.25})     # [H] escritórios parceiros ativados por mês (350–430 em Uberlândia, nota 03)
    max_parceiros: int = 85                     # [E] ~20% dos escritórios de Uberlândia + Triângulo remoto
    cnpjs_por_parceiro_mes_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 0.5, 2028: 0.5, 2029: 0.6, 2030: 0.6, 2031: 0.6, 2032: 0.4, 2033: 0.4,
        2034: 0.25, 2035: 0.25, 2036: 0.25})     # [H] ajustado p/ viés de otimismo; Omie ≈ 8 e Xero ≈ 20 CNPJs/escritório
    adocao_software_retainers_ano: float = 0.10 # [H] 10% da base de retainers adota o software por ano
    cnpjs_diretos_mes_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 0, 2028: 0.5, 2029: 2.0, 2030: 2.5, 2031: 2.5, 2032: 2.5, 2033: 2.5,
        2034: 1.5, 2035: 1.5, 2036: 1.5})       # [H] conteúdo/indicação

    # Demanda de consultoria (totais anuais; distribuídos por sazonalidade)
    diag_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 2, 2027: 27, 2028: 40, 2029: 50, 2030: 40, 2031: 35, 2032: 35, 2033: 45,
        2034: 20, 2035: 15, 2036: 12})           # [E] curva da nota 03 (picos 2027/2029/2033); 10% das PMEs compram diagnóstico
    retainers_diretos_mes_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 0.5, 2028: 0.5, 2029: 0.8, 2030: 0.5, 2031: 0.5, 2032: 0.5, 2033: 0.6,
        2034: 0.2, 2035: 0.2, 2036: 0.2})        # [H] indicados por contadores sem diagnóstico prévio
    retainers_diretos_inicio_t: int = 5         # abr/2027
    projetos_media_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0, 2027: 2, 2028: 5, 2029: 8, 2030: 6, 2031: 6, 2032: 7, 2033: 8, 2034: 4, 2035: 3, 2036: 3})  # [H]
    sazonalidade: List[float] = field(default_factory=lambda: [1.1, 1.1, 1.3, 0.8, 0.8, 0.8, 0.8, 1.0, 1.2, 1.2, 1.0, 0.9])  # [E] janelas set–out e jan–mar (nota 03)

    # Prazos de recebimento
    dso_software_meses: int = 1                 # [H] escritório paga a 30 dias
    # diagnóstico: 50% na assinatura (mês t), 50% na entrega (t+1); projeto média: 50% em t, 50% em t+2 (45–60 dias)

    # Tributos da própria empresa
    fator_r_minimo: float = 0.28                # [F] LC 123 art. 18 §5º-J
    limite_simples: float = 4_800_000.0         # [F]
    aliquota_presumido_fallback: float = 0.17   # [E/H] LP serviços 13,3–16,3% (nota 06) + CBS 2027+ não creditável p/ cliente do Simples

    # Taxa de desconto e valor terminal
    taxa_desconto_por_ano: Dict[int, float] = field(default_factory=lambda: {
        2026: 0.35, 2027: 0.35, 2028: 0.32, 2029: 0.28, 2030: 0.24, 2031: 0.20, 2032: 0.20,
        2033: 0.20, 2034: 0.20, 2035: 0.20, 2036: 0.20})  # [prompt] 35% validação -> 20% maturidade
    taxa_madura: float = 0.20
    g_perpetuidade: float = 0.03                # [prompt]
    roic_cap: float = 1.0                       # [E] teto de ROIC usado na taxa de reinvestimento (g/ROIC)
    mult_arr_software: float = 2.5              # [E] comparáveis 5–8× ARR (Omie ~6×, Taxcel 5–8×) com desconto de ~55% por tamanho/iliquidez/pessoa-chave
    mult_receita_consultoria: float = 0.8       # [H] firmas de serviço pequenas: 0,5–1,0× receita
    mult_ebitda: float = 5.0                    # [H] cheque alternativo

    # Cenário / sensibilidade
    vol_mult: float = 1.0                       # multiplica diagnósticos, retainers diretos, projetos e CNPJs
    preco_mult: float = 1.0
    atraso_meses: int = 0                       # desloca toda a demanda (não os custos fixos)
    stop_t: int = -1                            # mês em que a operação é encerrada (cenário fracasso); -1 = não para
    software_ativo: bool = True
    reserva_meses: float = 3.0                  # caixa mínimo = 3 meses de custo fixo antes de distribuir


# ----------------------------------------------------------------------------------
# TRIBUTOS DA PRÓPRIA EMPRESA (Simples Anexo III / V) — nota 06
# ----------------------------------------------------------------------------------
ANEXO_III = [(180_000, 0.06, 0), (360_000, 0.112, 9_360), (720_000, 0.135, 17_640),
             (1_800_000, 0.16, 35_640), (3_600_000, 0.21, 125_640), (4_800_000, 0.33, 648_000)]
ANEXO_V = [(180_000, 0.155, 0), (360_000, 0.18, 4_500), (720_000, 0.195, 9_900),
           (1_800_000, 0.205, 17_100), (3_600_000, 0.23, 62_100), (4_800_000, 0.305, 540_000)]


def aliquota_simples(rbt12: float, anexo) -> float:
    rbt12 = max(rbt12, 1.0)
    for teto, nominal, deducao in anexo:
        if rbt12 <= teto:
            return max((rbt12 * nominal - deducao) / rbt12, 0.0)
    return anexo[-1][1] - anexo[-1][2] / rbt12


# ----------------------------------------------------------------------------------
# MOTOR MENSAL
# ----------------------------------------------------------------------------------
def simulate(p: P) -> Dict[str, np.ndarray]:
    T = N_MONTHS
    cols = ["ano", "mes", "rec_retainer", "rec_diag", "rec_projeto", "rec_software", "rec_workshop",
            "receita_bruta", "tributos", "receita_liquida", "taxas_pgto", "provisao", "infra_api", "cac_var",
            "margem_contrib", "pessoal_analistas", "pessoal_dev", "pessoal_cs", "pessoal_canal",
            "pro_labore_fundador", "pro_labore_socio", "overhead", "marketing_fixo", "custo_fixo_total",
            "ebitda", "depreciacao", "ebit", "capex", "delta_recebiveis", "fcf", "aporte", "dividendos",
            "caixa", "retainers", "novos_retainers", "diag_vendidos", "projetos", "cnpjs", "novos_cnpjs",
            "parceiros", "analistas", "devs", "cs", "gerentes_canal", "headcount", "horas_demanda",
            "horas_capacidade", "utilizacao", "aliquota_efetiva", "fator_r", "regime", "rbt12",
            "leads_necessarios", "propostas_necessarias", "custo_fixo_caixa", "recebiveis", "caixa_antes_div",
            "reunioes_necessarias", "horas_vendas_fundador"]
    out = {c: np.zeros(T) for c in cols}

    cash = 0.0
    retainers = 0.0
    cnpjs = 0.0
    parceiros = 0.0
    analistas = 0
    devs = 0
    cs = 0
    gerentes = 0
    recebiveis = 0.0
    capex_hist: List[Tuple[int, float]] = []
    rec_hist: List[float] = []
    folha_hist: List[float] = []
    pending_cash: Dict[int, float] = {}       # recebimentos futuros (t -> R$)
    hired_months_above = 0
    months_below = 0
    stopped = False

    for t in range(T):
        y, m = cal(t)
        infl_p = (1 + p.inflacao_preco) ** max(0, y - 2027)
        infl_c = (1 + p.inflacao_custo) ** max(0, y - 2027)
        pm = p.preco_mult

        if p.stop_t >= 0 and t >= p.stop_t:
            stopped = True

        # ---------------- demanda (deslocada por atraso) ----------------
        td = t - p.atraso_meses
        if td < 0 or stopped:
            yd, md = None, None
        else:
            yd, md = cal(td)

        def sched(d: Dict[int, float], yy):
            return 0.0 if yy is None else d.get(yy, 0.0)

        saz = p.sazonalidade[md - 1] if md else 0.0
        diag_mes = sched(p.diag_por_ano, yd) / 12.0 * saz * p.vol_mult
        if td == 1:  # dez/2026: pré-venda de 2 diagnósticos
            diag_mes = p.diag_por_ano[2026] * p.vol_mult
        elif yd == 2026:
            diag_mes = 0.0
        proj_mes = sched(p.projetos_media_por_ano, yd) / 12.0 * p.vol_mult
        ret_direto = (sched(p.retainers_diretos_mes_por_ano, yd) * p.vol_mult
                      if (td is not None and td >= p.retainers_diretos_inicio_t) else 0.0)
        diag_prev = out["diag_vendidos"][t - 1] if t > 0 else 0.0
        novos_ret = p.conv_diag_para_retainer * diag_prev + ret_direto
        churn_r = p.churn_retainer_por_ano.get(y, 0.03) if not stopped else 1.0
        ret_ini = retainers
        retainers = max(0.0, ret_ini * (1 - churn_r) + novos_ret)
        ret_medio = (ret_ini + retainers) / 2.0

        # software / canal
        novos_cnpjs = 0.0
        if p.software_ativo and td is not None and td >= p.software_lancamento_t and not stopped:
            novos_parc = sched(p.novos_parceiros_mes_por_ano, yd) * p.vol_mult
            parceiros = min(p.max_parceiros, parceiros * (1 - p.churn_parceiro_mes) + novos_parc)
            novos_cnpjs = (parceiros * sched(p.cnpjs_por_parceiro_mes_por_ano, yd)
                           + ret_ini * p.adocao_software_retainers_ano / 12.0
                           + sched(p.cnpjs_diretos_mes_por_ano, yd)) * p.vol_mult
        churn_s = p.churn_software_por_ano.get(y, 0.02) if not stopped else 1.0
        cnpj_ini = cnpjs
        cnpjs = max(0.0, cnpj_ini * (1 - churn_s) + novos_cnpjs)
        cnpj_medio = (cnpj_ini + cnpjs) / 2.0

        # ---------------- receita ----------------
        rec_ret = ret_medio * p.preco_retainer * infl_p * pm
        rec_diag = diag_mes * p.preco_diagnostico * infl_p * pm
        rec_proj = proj_mes * p.preco_projeto_media * infl_p * pm
        preco_sw = p.preco_software_por_ano.get(y, p.preco_software_cnpj_liq) * (p.preco_software_cnpj_liq / 140.0)
        rec_sw = cnpj_medio * preco_sw * infl_p * pm
        rec_ws = (p.receita_workshops_mes * pm if (yd is not None and 2027 <= yd <= 2029 and not stopped) else 0.0)
        receita = rec_ret + rec_diag + rec_proj + rec_sw + rec_ws
        rec_hist.append(receita)
        rbt12 = sum(rec_hist[-12:]) * (12.0 / min(12, len(rec_hist))) if receita > 0 else sum(rec_hist[-12:])

        # ---------------- horas e equipe ----------------
        h_ret = p.horas_retainer_por_ano.get(y, p.horas_retainer) * (p.horas_retainer / 6.0)
        h_diag = p.horas_diag_por_ano.get(y, p.horas_diagnostico) * (p.horas_diagnostico / 25.0)
        horas = (ret_medio * h_ret + diag_mes * h_diag + proj_mes * p.horas_projeto_media
                 + novos_cnpjs * p.horas_onboarding_cnpj)
        suporte_h = cnpj_medio * p.horas_suporte_cnpj_mes
        if cs == 0:
            horas += suporte_h
        cap_fund = p.horas_fundador
        cap_socio = p.horas_socio_crc if t >= p.socio_crc_mes_inicio else 0.0
        req_analistas = max(0, math.ceil((horas - cap_fund - cap_socio) / p.horas_analista)) if not stopped else 0
        # contratação com 1 mês de confirmação; redução com 3 meses de folga
        if req_analistas > analistas:
            hired_months_above += 1
            if hired_months_above >= 2:
                analistas += 1
                hired_months_above = 0
        else:
            hired_months_above = 0
        if req_analistas < analistas:
            months_below += 1
            if months_below >= 3:
                analistas -= 1
                months_below = 0
        else:
            months_below = 0
        if stopped:
            analistas = devs = cs = gerentes = 0
        else:
            custo_fixo_prev = out["custo_fixo_total"][t - 1] if t > 0 else 10_000.0
            caixa_ok = cash >= p.caixa_min_para_contratar_meses * custo_fixo_prev
            mrr_sw = cnpjs * p.preco_software_por_ano.get(y, 140.0) * infl_p * pm
            if devs == 0 and cnpjs >= p.cnpjs_para_1o_dev and caixa_ok:
                devs = 1
            if devs == 1 and cnpjs >= p.cnpjs_para_2o_dev and caixa_ok and mrr_sw >= 4 * p.custo_dev * infl_c:
                devs = 2
            req_cs = math.ceil(cnpjs / p.cnpjs_por_cs) if cnpjs >= p.cnpjs_para_1o_cs else 0
            if req_cs > cs and caixa_ok:
                cs += 1
            elif req_cs < cs and y >= 2034:
                cs -= 1
            if gerentes == 0 and cnpjs >= p.cnpjs_para_1o_gerente_canal and caixa_ok and mrr_sw >= 2.5 * p.custo_gerente_canal * infl_c:
                gerentes = 1
            if gerentes == 1 and cnpjs >= p.cnpjs_para_2o_gerente_canal and caixa_ok and mrr_sw >= 6 * p.custo_gerente_canal * infl_c:
                gerentes = 2
        cap_total = cap_fund + cap_socio + analistas * p.horas_analista
        utilizacao = horas / cap_total if cap_total > 0 else 0.0

        # ---------------- custos ----------------
        if stopped:
            pl_f = pl_s = c_anal = c_dev = c_cs = c_ger = overhead = mkt_fixo = 0.0
        else:
            # escalada de pró-labore só se a margem EBITDA dos últimos 12 meses for ≥ mínimo
            rec12_prev = sum(rec_hist[-13:-1]) if len(rec_hist) > 1 else 0.0
            eb12_prev = float(np.sum(out["ebitda"][max(0, t - 12):t])) if t > 0 else 0.0
            margem12 = eb12_prev / rec12_prev if rec12_prev > 0 else -1.0
            nivel_f = p.pro_labore_fundador_por_ano.get(y, 0.0)
            nivel_s = p.pro_labore_socio_crc_por_ano.get(y, 0.0)
            base_f = p.pro_labore_fundador_por_ano.get(2027, 8_000.0)
            base_s = p.pro_labore_socio_crc_por_ano.get(2027, 4_000.0)
            if margem12 < p.margem_min_para_escalar_pro_labore and y >= 2028:
                nivel_f = min(nivel_f, max(base_f, out["pro_labore_fundador"][t - 1]))
                nivel_s = min(nivel_s, max(base_s, out["pro_labore_socio"][t - 1]))
            pl_s = nivel_s if t >= p.socio_crc_mes_inicio else 0.0
            if t >= p.pro_labore_fundador_mes_inicio:
                pl_f = nivel_f
            else:
                # antes do mês 7: pró-labore mínimo para manter Fator R ≥ 28% (Anexo III)
                pl_f = max(0.0, p.fator_r_alvo_inicio * receita - pl_s)
            c_anal = analistas * p.custo_analista * infl_c
            c_dev = devs * p.custo_dev * infl_c
            c_cs = cs * p.custo_cs * infl_c
            c_ger = gerentes * p.custo_gerente_canal * infl_c
            headcount = analistas + devs + cs + gerentes
            overhead = ((p.overhead_base_fase1 if t < 6 else p.overhead_base) * infl_c
                        + headcount * p.overhead_por_funcionario * infl_c)
            mkt_fixo = p.marketing_fixo_por_ano.get(y, 0.0) * infl_c
            if y >= 2028 and len(rec_hist) > 1:
                mkt_fixo = min(mkt_fixo, max(1_500.0 * infl_c, 0.06 * sum(rec_hist[-13:-1]) / 12.0))
        headcount = analistas + devs + cs + gerentes
        custo_fixo = pl_f + pl_s + c_anal + c_dev + c_cs + c_ger + overhead + mkt_fixo

        # tributos (Fator R com folha dos 12 meses: pró-labore + 90% do custo CLT)
        folha_mes = pl_f + pl_s + 0.9 * (c_anal + c_dev + c_cs + c_ger)
        folha_hist.append(folha_mes)
        folha12 = sum(folha_hist[-12:])
        rec12 = sum(rec_hist[-12:])
        fator_r = folha12 / rec12 if rec12 > 0 else 1.0
        if rbt12 > p.limite_simples:
            aliq, regime = p.aliquota_presumido_fallback, 2  # 2 = Lucro Presumido
        elif fator_r >= p.fator_r_minimo:
            aliq, regime = aliquota_simples(rbt12, ANEXO_III), 0  # 0 = Anexo III
        else:
            aliq, regime = aliquota_simples(rbt12, ANEXO_V), 1    # 1 = Anexo V
        tributos = receita * aliq
        taxas = ((ret_medio + diag_mes + proj_mes) * p.taxa_pagamento_consultoria
                 + rec_sw * p.taxa_pagamento_software)
        provisao = (rec_ret + rec_diag + rec_ws) * p.provisao_perdas
        infra = cnpj_medio * (p.infra_por_cnpj + (p.api_por_cnpj_apos_2029 if y >= 2029 else 0.0)) * infl_c
        cac_var = (novos_ret * p.cac_retainer + diag_mes * p.cac_diagnostico + novos_cnpjs * p.cac_cnpj) * p.cac_mult * infl_c
        margem_contrib = receita - tributos - taxas - provisao - infra - cac_var
        ebitda = margem_contrib - custo_fixo
        if t == 0:
            ebitda -= p.custo_abertura  # despesa pré-operacional

        # ---------------- capex e depreciação ----------------
        capex = 0.0
        if t == 0:
            capex += p.capex_inicial
        if m == 1 and y >= 2028 and not stopped:
            capex += p.capex_anual_base * infl_c
        if t > 0 and headcount > out["headcount"][t - 1] and not stopped:
            capex += (headcount - out["headcount"][t - 1]) * p.capex_por_funcionario * infl_c
        if capex > 0:
            capex_hist.append((t, capex))
        deprec = sum(c / p.vida_util_meses for (tt, c) in capex_hist if 0 <= t - tt < p.vida_util_meses)
        ebit = ebitda - deprec

        # ---------------- caixa: recebimentos por prazo ----------------
        # retainers e software: software recebido a 30 dias; retainers via Pix no dia 1 (mês corrente)
        # diagnóstico: 50% em t, 50% em t+1; projeto: 50% em t, 50% em t+2; workshops à vista
        pending_cash[t] = pending_cash.get(t, 0.0) + rec_ret + rec_ws + 0.5 * rec_diag + 0.5 * rec_proj
        pending_cash[t + 1] = pending_cash.get(t + 1, 0.0) + 0.5 * rec_diag + rec_sw
        pending_cash[t + 2] = pending_cash.get(t + 2, 0.0) + 0.5 * rec_proj
        recebido = pending_cash.pop(t, 0.0)
        novo_recebiveis = recebiveis + receita - recebido
        delta_rec = novo_recebiveis - recebiveis
        recebiveis = novo_recebiveis
        # descasamento de provisão: perdas são caixa que não entra -> já abatidas na receita líquida (simplificação)
        fcf = ebitda + provisao - provisao - capex - delta_rec  # provisão tratada como perda efetiva de caixa (não entra)
        # (a provisão reduz EBITDA e também reduz caixa: o recebível correspondente nunca entra)
        aporte = p.capital_inicial if t == 0 else 0.0
        cash_antes = cash + aporte + fcf
        # dividendos: em dezembro, a partir de 2028, caixa acima da reserva; no encerramento, tudo
        dividendos = 0.0
        reserva = p.reserva_meses * custo_fixo
        if stopped and t == p.stop_t:
            dividendos = max(0.0, cash_antes)   # liquidação: devolve o que sobrou
        elif (m == 12 and y >= 2028 and not stopped and cash_antes > reserva):
            dividendos = cash_antes - reserva
        cash = cash_antes - dividendos
        out.setdefault("caixa_antes_div", np.zeros(T))[t] = cash_antes

        # funil necessário (leads/reuniões/propostas) para checar a capacidade de vendas do fundador
        fechamentos = max(0.0, diag_mes + (novos_ret - p.conv_diag_para_retainer * diag_prev) + proj_mes)
        sh = p.share_indicado_por_ano.get(y, 0.7)
        c_pf = sh * p.ind_proposta_fech + (1 - sh) * p.frio_proposta_fech
        c_rp = sh * p.ind_reuniao_proposta + (1 - sh) * p.frio_reuniao_proposta
        c_lr = sh * p.ind_lead_reuniao + (1 - sh) * p.frio_lead_reuniao
        propostas = fechamentos / c_pf
        reunioes = propostas / c_rp
        leads = reunioes / c_lr
        horas_vendas = reunioes * p.horas_por_reuniao + propostas * p.horas_por_proposta + (p.horas_prospeccao_mes if not stopped else 0.0)

        vals = dict(ano=y, mes=m, rec_retainer=rec_ret, rec_diag=rec_diag, rec_projeto=rec_proj, rec_software=rec_sw,
                    rec_workshop=rec_ws, receita_bruta=receita, tributos=tributos, receita_liquida=receita - tributos,
                    taxas_pgto=taxas, provisao=provisao, infra_api=infra, cac_var=cac_var, margem_contrib=margem_contrib,
                    pessoal_analistas=c_anal, pessoal_dev=c_dev, pessoal_cs=c_cs, pessoal_canal=c_ger,
                    pro_labore_fundador=pl_f, pro_labore_socio=pl_s, overhead=overhead, marketing_fixo=mkt_fixo,
                    custo_fixo_total=custo_fixo, ebitda=ebitda, depreciacao=deprec, ebit=ebit, capex=capex,
                    delta_recebiveis=delta_rec, fcf=fcf, aporte=aporte, dividendos=dividendos, caixa=cash,
                    retainers=retainers, novos_retainers=novos_ret, diag_vendidos=diag_mes, projetos=proj_mes,
                    cnpjs=cnpjs, novos_cnpjs=novos_cnpjs, parceiros=parceiros, analistas=analistas, devs=devs, cs=cs,
                    gerentes_canal=gerentes, headcount=headcount, horas_demanda=horas, horas_capacidade=cap_total,
                    utilizacao=utilizacao, aliquota_efetiva=aliq, fator_r=fator_r, regime=regime, rbt12=rbt12,
                    leads_necessarios=leads, propostas_necessarias=propostas, custo_fixo_caixa=custo_fixo,
                    recebiveis=recebiveis, reunioes_necessarias=reunioes, horas_vendas_fundador=horas_vendas)
        for k, v in vals.items():
            out[k][t] = v
    return out


# ----------------------------------------------------------------------------------
# DESCONTO, VALOR TERMINAL, TIR, PAYBACK
# ----------------------------------------------------------------------------------
def discount_factors(p: P, flat: float = None) -> Tuple[np.ndarray, np.ndarray]:
    """Retorna (DF meio de período por mês, DF fim de período por mês)."""
    T = N_MONTHS
    f_end = np.zeros(T)
    f_mid = np.zeros(T)
    acc = 1.0
    for t in range(T):
        y, _ = cal(t)
        r_y = flat if flat is not None else p.taxa_desconto_por_ano.get(y, p.taxa_madura)
        r_m = (1 + r_y) ** (1 / 12) - 1
        f_mid[t] = 1.0 / (acc * (1 + r_m) ** 0.5)
        acc *= (1 + r_m)
        f_end[t] = 1.0 / acc
    return f_mid, f_end


def annual(out: Dict[str, np.ndarray]) -> Dict[int, Dict[str, float]]:
    res: Dict[int, Dict[str, float]] = {}
    anos = out["ano"].astype(int)
    for y in sorted(set(anos)):
        idx = np.where(anos == y)[0]
        d: Dict[str, float] = {}
        for k, v in out.items():
            if k in ("ano", "mes"):
                continue
            if k in ("caixa", "caixa_antes_div", "retainers", "cnpjs", "parceiros", "analistas", "devs", "cs", "gerentes_canal",
                     "headcount", "recebiveis", "rbt12", "fator_r", "aliquota_efetiva", "regime", "utilizacao"):
                d[k] = float(v[idx[-1]]) if k not in ("utilizacao", "aliquota_efetiva", "fator_r") else float(np.mean(v[idx]))
            else:
                d[k] = float(np.sum(v[idx]))
        d["meses"] = len(idx)
        res[y] = d
    return res


def terminal_values(p: P, out: Dict[str, np.ndarray], an: Dict[int, Dict[str, float]]) -> Dict[str, float]:
    y = END_YEAR
    a = an[y]
    nopat = a["ebit"]  # no Simples o IRPJ/CSLL está nos tributos sobre receita
    capital_investido = out["recebiveis"][-1] + sum(c * max(0, 1 - (N_MONTHS - 1 - tt) / p.vida_util_meses)
                                                     for tt, c in [(0, p.capex_inicial)])  # aprox.: recebíveis + PP&E líquido
    # PP&E líquido aproximado: capex dos últimos 36 meses em linha reta
    ppe = 0.0
    for t in range(N_MONTHS):
        c = out["capex"][t]
        idade = N_MONTHS - 1 - t
        if idade < p.vida_util_meses:
            ppe += c * (1 - idade / p.vida_util_meses)
    capital_investido = out["recebiveis"][-1] + ppe
    roic = nopat / capital_investido if capital_investido > 0 else float("inf")
    roic_usado = min(roic, p.roic_cap) if roic > 0 else p.roic_cap
    reinvest = p.g_perpetuidade / roic_usado if roic_usado > 0 else 0.0
    fcf_2037 = nopat * (1 + p.g_perpetuidade) * (1 - reinvest)
    tv_perp = fcf_2037 / (p.taxa_madura - p.g_perpetuidade) if nopat > 0 else 0.0
    arr = out["cnpjs"][-1] * p.preco_software_cnpj_liq * p.preco_mult * (1 + p.inflacao_preco) ** (y - 2027) * 12
    rec_cons = a["rec_retainer"] + a["rec_diag"] + a["rec_projeto"]
    tv_mult = p.mult_arr_software * arr + p.mult_receita_consultoria * rec_cons
    tv_ebitda = p.mult_ebitda * a["ebitda"] if a["ebitda"] > 0 else 0.0
    return dict(nopat_2036=nopat, capital_investido=capital_investido, roic=roic, reinvest=reinvest,
                fcf_2037=fcf_2037, tv_perpetuidade=tv_perp, arr_2036=arr, rec_consultoria_2036=rec_cons,
                tv_multiplo=tv_mult, tv_ebitda=tv_ebitda, tv_base=min(tv_perp, tv_mult))


def irr_monthly(flows: np.ndarray) -> float:
    """TIR mensal: varre uma grade de taxas e refina por bissecção na primeira mudança de sinal do VPL.
    Retorna -1.0 (perda total) se o VPL for negativo em toda a grade e a soma dos fluxos for negativa."""
    if not (np.any(flows > 0) and np.any(flows < 0)):
        return float("nan")
    tt = np.arange(len(flows))

    def npv(r):
        return float(np.sum(flows / (1 + r) ** tt))

    grid = np.concatenate([np.linspace(-0.5, -0.01, 50), np.linspace(-0.01, 1.0, 400)])
    vals = [npv(r) for r in grid]
    for i in range(1, len(grid)):
        if vals[i - 1] == 0:
            return float(grid[i - 1])
        if vals[i - 1] * vals[i] < 0:
            lo, hi = grid[i - 1], grid[i]
            for _ in range(100):
                mid = (lo + hi) / 2
                if npv(lo) * npv(mid) <= 0:
                    hi = mid
                else:
                    lo = mid
            return (lo + hi) / 2
    return -1.0 if float(np.sum(flows)) < 0 else float("nan")


def evaluate(p: P, flat_rate: float = None) -> Dict[str, object]:
    out = simulate(p)
    an = annual(out)
    f_mid, f_end = discount_factors(p, flat_rate)
    tv = terminal_values(p, out, an)
    T = N_MONTHS
    stopped = p.stop_t >= 0
    tv_base = 0.0 if stopped else tv["tv_base"]

    # ---- fluxo da empresa (100% do equity): aporte, FCF, caixa final + TV ----
    fcf = out["fcf"].copy()
    emp_flows = fcf.copy()
    emp_flows[0] -= p.capital_inicial   # o aporte é o investimento; o FCF do t=0 já inclui custos
    # valor no fim: caixa remanescente + valor terminal (o caixa não distribuído pertence ao sócio)
    last = (p.stop_t if stopped else T - 1)
    caixa_final = 0.0 if stopped else out["caixa"][T - 1]
    # Nota: FCF já é o fluxo distribuível; o caixa final é soma de FCF retidos — para não contar duas vezes,
    # o VPL da empresa usa FCF mensais + TV (o caixa retido é FCF já contado).
    vpl_emp = float(np.sum(emp_flows * f_mid)) + tv_base * f_end[T - 1]
    flows_emp_irr = emp_flows.copy()
    flows_emp_irr[T - 1] += tv_base
    irr_m = irr_monthly(flows_emp_irr)
    tir_emp = (1 + irr_m) ** 12 - 1 if not math.isnan(irr_m) else float("nan")

    # ---- fluxo do fundador: -aporte + pró-labore + stake × (dividendos + TV + caixa final) - renda atual perdida ----
    renda = np.array([p.renda_atual_mes * (1 + p.renda_atual_g) ** max(0, cal(t)[0] - 2027)
                      if (not stopped or t <= p.stop_t) else 0.0 for t in range(T)])
    # após parar, o fundador volta ao emprego: renda perdida cessa (conservador para a tese? não: é o custo real)
    fund = (-out["aporte"] + out["pro_labore_fundador"] + p.stake_fundador * out["dividendos"] - renda)
    if stopped:
        # na liquidação, o caixa devolvido vai 100% ao fundador (foi quem aportou)
        fund[p.stop_t] += (1 - p.stake_fundador) * out["dividendos"][p.stop_t]
    fund_tv = fund.copy()
    fund_tv[T - 1] += p.stake_fundador * (tv_base + caixa_final)
    vpl_fund = float(np.sum(fund * f_mid)) + p.stake_fundador * (tv_base + caixa_final) * f_end[T - 1]
    irr_f = irr_monthly(fund_tv)
    tir_fund = (1 + irr_f) ** 12 - 1 if not math.isnan(irr_f) else float("nan")
    # VPL do fundador sem custo de oportunidade (só caixa)
    fund_sem_renda = fund + renda
    vpl_fund_sem_renda = float(np.sum(fund_sem_renda * f_mid)) + p.stake_fundador * (tv_base + caixa_final) * f_end[T - 1]

    # payback (fluxo do fundador, sem TV)
    cum = np.cumsum(fund)
    pb = next((t for t in range(T) if cum[t] >= 0 and t > 0), None)
    cumd = np.cumsum(fund * f_mid)
    pbd = next((t for t in range(T) if cumd[t] >= 0 and t > 0), None)
    # payback do negócio (fluxo da empresa)
    cum_e = np.cumsum(emp_flows)
    pb_e = next((t for t in range(T) if cum_e[t] >= 0 and t > 0), None)
    cumd_e = np.cumsum(emp_flows * f_mid)
    pbd_e = next((t for t in range(T) if cumd_e[t] >= 0 and t > 0), None)

    # fundo do vale: caixa acumulado antes do aporte (= caixa - 100k) e caixa mínimo com aporte
    caixa = out["caixa_antes_div"] if not stopped else out["caixa_antes_div"][:p.stop_t]
    t_min = int(np.argmin(caixa))
    cash_pre_aporte = caixa - p.capital_inicial
    capital_necessario = float(-np.min(cash_pre_aporte)) if np.min(cash_pre_aporte) < 0 else 0.0
    # break-even: primeiro mês com EBITDA > 0 sustentado 3 meses
    eb = out["ebitda"]
    be = next((t for t in range(2, T) if eb[t] > 0 and eb[t - 1] > 0 and eb[t - 2] > 0), None)

    return dict(out=out, an=an, tv=tv, vpl_emp=vpl_emp, tir_emp=tir_emp, vpl_fund=vpl_fund, tir_fund=tir_fund,
                vpl_fund_sem_renda=vpl_fund_sem_renda, payback_fund=pb, payback_fund_desc=pbd, payback_emp=pb_e,
                payback_emp_desc=pbd_e, caixa_min=float(caixa.min()), t_caixa_min=t_min, capital_necessario=capital_necessario,
                breakeven_t=be, caixa_final=caixa_final, tv_base=tv_base, f_mid=f_mid, f_end=f_end, caixa_serie=caixa,
                fund_flows=fund, emp_flows=emp_flows, renda=renda)


# ----------------------------------------------------------------------------------
# CENÁRIOS
# ----------------------------------------------------------------------------------
def scenario(name: str, base: P) -> P:
    if name == "fracasso":
        # vendas a 50% do plano: < 10 contratos pagos até 31/03/2027 e receita < burn em jul/2027 (gates da nota 07);
        # o fundador dá 2 meses de ajuste e encerra em set/2027 (t=10). Software nunca é construído.
        return replace(base, vol_mult=0.5, software_ativo=False, stop_t=10)
    if name == "pessimista":
        # passa os gates por pouco (≈10 contratos até mar/2027), mas fica subescala: preço 10% menor, churn +0,5 p.p.,
        # software 6 meses atrasado, metade dos escritórios parceiros, menos CNPJs por escritório
        return replace(base, vol_mult=0.8, preco_mult=0.90, software_lancamento_t=base.software_lancamento_t + 6,
                       churn_retainer_por_ano={k: min(0.04, v + 0.005) for k, v in base.churn_retainer_por_ano.items()},
                       churn_software_por_ano={k: min(0.04, v + 0.005) for k, v in base.churn_software_por_ano.items()},
                       novos_parceiros_mes_por_ano={k: v * 0.6 for k, v in base.novos_parceiros_mes_por_ano.items()},
                       cnpjs_por_parceiro_mes_por_ano={k: v * 0.8 for k, v in base.cnpjs_por_parceiro_mes_por_ano.items()})
    if name == "otimista":
        return replace(base, vol_mult=1.35, preco_mult=1.10,
                       churn_retainer_por_ano={k: max(0.0, v - 0.005) for k, v in base.churn_retainer_por_ano.items()},
                       churn_software_por_ano={k: max(0.0, v - 0.005) for k, v in base.churn_software_por_ano.items()},
                       novos_parceiros_mes_por_ano={k: v * 1.5 for k, v in base.novos_parceiros_mes_por_ano.items()},
                       max_parceiros=130)
    return base


PROBS = {"fracasso": 0.35, "pessimista": 0.30, "base": 0.25, "otimista": 0.10}
# [E] IBGE (Demografia 2022): sobrevivência de empregadoras 76% (1 ano), 60% (2), 37% (5); Sebrae não-MEI ~76% (5 anos);
# nota 06 estima 55–65% em 5 anos para este perfil. Fracasso = parada em ≤12 meses (35% ≈ entre 24% de morte no 1º ano
# e 40% em 2 anos do IBGE); os 65% restantes repartidos por desempenho (pessimista 30 / base 25 / otimista 10).


# ----------------------------------------------------------------------------------
# RENDA FIXA (nota 06, 01/11/2026)
# ----------------------------------------------------------------------------------
def renda_fixa(capital: float, renda_mes: float, g: float) -> List[Dict[str, float]]:
    rows = []
    anos = 5
    ir = 0.15  # > 720 dias
    opts = [
        ("CDI pela curva DI (DI jan/32 15,25% a.a.)", 0.1525, False),
        ("CDI pelo Focus (Selic 13,25%→11,75%→10%; média ~11,0% a.a.)", 0.110, False),
        ("Tesouro Prefixado 2032 (15,38% a.a.)", 0.1538, False),
        ("Tesouro IPCA+ 2029 (7,80% + IPCA ~4,0% ≈ 12,1% a.a.)", 0.121, False),
        ("CDI 13,65% a.a. constante", 0.1365, False),
    ]
    for nome, taxa, _ in opts:
        bruto = capital * (1 + taxa) ** anos
        liquido = capital + (bruto - capital) * (1 - ir)
        # renda atual acumulada 5 anos, reinvestida à mesma taxa líquida (aprox.)
        taxa_liq = (liquido / capital) ** (1 / anos) - 1
        fv_renda = 0.0
        for k in range(anos * 12):
            r_k = renda_mes * (1 + g) ** (k // 12)
            fv_renda += r_k * (1 + taxa_liq) ** ((anos * 12 - k) / 12)
        rows.append(dict(alternativa=nome, taxa_bruta=taxa, valor_bruto_5a=bruto, valor_liquido_5a=liquido,
                         taxa_liquida=taxa_liq, renda_5a_capitalizada=fv_renda, patrimonio_total_5a=liquido + fv_renda))
    return rows


# ----------------------------------------------------------------------------------
# EXECUÇÃO E CSVs
# ----------------------------------------------------------------------------------
def fmt(x, nd=0):
    if isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
        return "n/d"
    if isinstance(x, (int, np.integer)):
        return f"{x:,}".replace(",", ".")
    s = f"{x:,.{nd}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return s


def write_csv(path: str, header: List[str], rows: List[List]):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(header)
        for r in rows:
            w.writerow([(f"{v:.4f}" if abs(v) < 1 else f"{v:.2f}") if isinstance(v, (float, np.floating)) else v for v in r])


def main():
    base = P()
    results = {name: evaluate(scenario(name, base)) for name in ["fracasso", "pessimista", "base", "otimista"]}
    rb = results["base"]
    out, an = rb["out"], rb["an"]

    # ---- mensal 24 meses ----
    hdr = ["t", "mes", "retainers", "novos_ret", "diag", "projetos", "cnpjs", "parceiros", "receita_bruta", "tributos",
           "margem_contrib", "pro_labore_fundador", "pro_labore_socio", "pessoal_clt", "overhead_mkt", "custo_fixo",
           "ebitda", "fcf", "caixa", "analistas", "devs", "cs", "horas_demanda", "horas_cap", "utilizacao",
           "aliq_efetiva", "fator_r", "leads_necessarios", "reunioes", "propostas", "horas_vendas_fundador"]
    rows = []
    for t in range(24):
        rows.append([t + 1, label(t), out["retainers"][t], out["novos_retainers"][t], out["diag_vendidos"][t],
                     out["projetos"][t], out["cnpjs"][t], out["parceiros"][t], out["receita_bruta"][t], out["tributos"][t],
                     out["margem_contrib"][t], out["pro_labore_fundador"][t], out["pro_labore_socio"][t],
                     out["pessoal_analistas"][t] + out["pessoal_dev"][t] + out["pessoal_cs"][t] + out["pessoal_canal"][t],
                     out["overhead"][t] + out["marketing_fixo"][t], out["custo_fixo_total"][t], out["ebitda"][t], out["fcf"][t],
                     out["caixa"][t], int(out["analistas"][t]), int(out["devs"][t]), int(out["cs"][t]), out["horas_demanda"][t],
                     out["horas_capacidade"][t], out["utilizacao"][t], out["aliquota_efetiva"][t], out["fator_r"][t],
                     out["leads_necessarios"][t], out["reunioes_necessarias"][t], out["propostas_necessarias"][t],
                     out["horas_vendas_fundador"][t]])
    write_csv(os.path.join(HERE, "modelo_mensal_24m.csv"), hdr, rows)
    # gates (nota 07) no cenário-base e nos demais
    hdr_g = ["cenario", "contratos_pagos_ate_mar2027", "retainers_jul2027", "mrr_jul2027", "ebitda_mes9_jul2027",
             "caixa_jul2027", "cnpjs_dez2028", "receita_recorrente_pct_2028", "margem_contrib_pct_2028"]
    rows_g = []
    for name, r in results.items():
        o = r["out"]; a = r["an"]
        idx_mar27 = 4; idx_jul27 = 8
        contratos = float(np.sum(o["diag_vendidos"][:idx_mar27 + 1]) + np.sum(o["novos_retainers"][:idx_mar27 + 1]) + np.sum(o["projetos"][:idx_mar27 + 1]))
        mrr = o["rec_retainer"][idx_jul27] + o["rec_software"][idx_jul27]
        rec28 = a[2028]["receita_bruta"]
        rows_g.append([name, contratos, o["retainers"][idx_jul27], mrr, o["ebitda"][idx_jul27], o["caixa"][idx_jul27],
                       a[2028]["cnpjs"], (a[2028]["rec_retainer"] + a[2028]["rec_software"]) / rec28 if rec28 else 0,
                       a[2028]["margem_contrib"] / rec28 if rec28 else 0])
    write_csv(os.path.join(HERE, "modelo_gates.csv"), hdr_g, rows_g)

    # ---- anual ----
    hdr = ["ano", "meses", "rec_retainer", "rec_diag", "rec_projeto", "rec_software", "rec_workshop", "receita_bruta",
           "tributos", "receita_liquida", "custos_variaveis", "margem_contrib", "pro_labore", "pessoal_clt", "overhead",
           "marketing", "custo_fixo", "ebitda", "margem_ebitda", "depreciacao", "ebit", "margem_liquida", "capex",
           "delta_recebiveis", "fcf", "dividendos", "caixa_fim", "retainers_fim", "cnpjs_fim", "parceiros_fim",
           "headcount_fim", "utilizacao_media", "aliq_media", "fator_r_medio", "roic", "reunioes_mes_media", "horas_vendas_mes_media"]
    rows = []
    for y, a in an.items():
        cv = a["taxas_pgto"] + a["provisao"] + a["infra_api"] + a["cac_var"]
        rec = a["receita_bruta"]
        # ROIC do ano: EBIT / (recebíveis fim + PP&E líquido aprox.)
        rows.append([y, a["meses"], a["rec_retainer"], a["rec_diag"], a["rec_projeto"], a["rec_software"], a["rec_workshop"],
                     rec, a["tributos"], a["receita_liquida"], cv, a["margem_contrib"],
                     a["pro_labore_fundador"] + a["pro_labore_socio"],
                     a["pessoal_analistas"] + a["pessoal_dev"] + a["pessoal_cs"] + a["pessoal_canal"], a["overhead"],
                     a["marketing_fixo"], a["custo_fixo_total"], a["ebitda"], (a["ebitda"] / rec if rec else 0.0),
                     a["depreciacao"], a["ebit"], (a["ebit"] / rec if rec else 0.0), a["capex"], a["delta_recebiveis"],
                     a["fcf"], a["dividendos"], a["caixa"], a["retainers"], a["cnpjs"], a["parceiros"], a["headcount"],
                     a["utilizacao"], a["aliquota_efetiva"], a["fator_r"],
                     (a["ebit"] / max(1.0, a["recebiveis"] + 20_000) if rec else 0.0),
                     a["reunioes_necessarias"] / a["meses"], a["horas_vendas_fundador"] / a["meses"]])
    write_csv(os.path.join(HERE, "modelo_anual_2026_2036.csv"), hdr, rows)

    # ---- cenários ----
    hdr = ["cenario", "prob", "vpl_empresa", "tir_empresa", "vpl_fundador", "tir_fundador", "vpl_fundador_sem_custo_oport",
           "payback_fund_meses", "payback_fund_desc_meses", "payback_emp_meses", "payback_emp_desc_meses", "caixa_min",
           "mes_caixa_min", "capital_necessario", "breakeven_mes", "receita_2029", "receita_2033", "receita_2036",
           "ebitda_2036", "retainers_2029", "cnpjs_2029", "cnpjs_2036", "tv_base", "tv_perpetuidade", "tv_multiplo",
           "tv_ebitda", "roic_2036"]
    rows = []
    ev_emp = ev_fund = 0.0
    for name, r in results.items():
        a = r["an"]
        rows.append([name, PROBS[name], r["vpl_emp"], r["tir_emp"], r["vpl_fund"], r["tir_fund"], r["vpl_fund_sem_renda"],
                     (r["payback_fund"] + 1) if r["payback_fund"] is not None else -1,
                     (r["payback_fund_desc"] + 1) if r["payback_fund_desc"] is not None else -1,
                     (r["payback_emp"] + 1) if r["payback_emp"] is not None else -1,
                     (r["payback_emp_desc"] + 1) if r["payback_emp_desc"] is not None else -1,
                     r["caixa_min"], label(r["t_caixa_min"]), r["capital_necessario"],
                     (r["breakeven_t"] + 1) if r["breakeven_t"] is not None else -1,
                     a[2029]["receita_bruta"], a[2033]["receita_bruta"], a[2036]["receita_bruta"], a[2036]["ebitda"],
                     a[2029]["retainers"], a[2029]["cnpjs"], a[2036]["cnpjs"], r["tv_base"], r["tv"]["tv_perpetuidade"],
                     r["tv"]["tv_multiplo"], r["tv"]["tv_ebitda"], r["tv"]["roic"]])
        ev_emp += PROBS[name] * r["vpl_emp"]
        ev_fund += PROBS[name] * r["vpl_fund"]
    rows.append(["valor_esperado", 1.0, ev_emp, "", ev_fund, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    write_csv(os.path.join(HERE, "modelo_cenarios.csv"), hdr, rows)

    # ---- sensibilidade preço × volume ----
    hdr = ["preco_mult", "vol_mult", "vpl_empresa", "vpl_fundador", "capital_necessario", "receita_2029", "cnpjs_2029"]
    rows = []
    for pmv in [0.8, 0.9, 1.0, 1.1, 1.2]:
        for vm in [0.6, 0.8, 1.0, 1.2, 1.4]:
            r = evaluate(replace(base, preco_mult=pmv, vol_mult=vm))
            rows.append([pmv, vm, r["vpl_emp"], r["vpl_fund"], r["capital_necessario"], r["an"][2029]["receita_bruta"],
                         r["an"][2029]["cnpjs"]])
    write_csv(os.path.join(HERE, "modelo_sens_preco_volume.csv"), hdr, rows)

    # ---- sensibilidade CAC × churn ----
    hdr = ["cac_mult", "churn_mensal", "vpl_empresa", "vpl_fundador", "cnpjs_2033", "retainers_2033"]
    rows = []
    for cm in [0.5, 1.0, 2.0, 3.0]:
        for ch in [0.01, 0.015, 0.025, 0.035]:
            pp = replace(base, cac_mult=cm,
                         churn_retainer_por_ano={k: (ch if k <= 2029 else ch + 0.005) for k in base.churn_retainer_por_ano},
                         churn_software_por_ano={k: ch for k in base.churn_software_por_ano})
            r = evaluate(pp)
            rows.append([cm, ch, r["vpl_emp"], r["vpl_fund"], r["an"][2033]["cnpjs"], r["an"][2033]["retainers"]])
    write_csv(os.path.join(HERE, "modelo_sens_cac_churn.csv"), hdr, rows)

    # ---- sensibilidade taxa × g ----
    hdr = ["curva_taxa", "g", "vpl_empresa", "vpl_fundador", "tv_perpetuidade_pv"]
    rows = []
    curvas = {
        "35%→20% (base)": None, "30%→18%": {y: max(0.18, 0.30 - 0.03 * (y - 2027)) for y in range(2026, 2037)},
        "40%→25%": {y: max(0.25, 0.40 - 0.03 * (y - 2027)) for y in range(2026, 2037)},
        "25% flat": {y: 0.25 for y in range(2026, 2037)}, "35% flat": {y: 0.35 for y in range(2026, 2037)}}
    for nome, curva in curvas.items():
        for g in [0.02, 0.03, 0.04]:
            pp = replace(base, g_perpetuidade=g)
            if curva is not None:
                pp = replace(pp, taxa_desconto_por_ano=curva, taxa_madura=curva[2036])
            r = evaluate(pp)
            rows.append([nome, g, r["vpl_emp"], r["vpl_fund"], r["tv"]["tv_perpetuidade"] * r["f_end"][-1]])
    write_csv(os.path.join(HERE, "modelo_sens_taxa_g.csv"), hdr, rows)

    # ---- sensibilidade atraso ----
    hdr = ["atraso_meses", "capital_necessario", "caixa_min_com_100k", "mes_caixa_min", "vpl_empresa", "vpl_fundador",
           "breakeven_mes", "receita_2029"]
    rows = []
    for d in [0, 6, 12, 24]:
        r = evaluate(replace(base, atraso_meses=d))
        rows.append([d, r["capital_necessario"], r["caixa_min"], label(r["t_caixa_min"]), r["vpl_emp"], r["vpl_fund"],
                     (r["breakeven_t"] + 1) if r["breakeven_t"] is not None else -1, r["an"][2029]["receita_bruta"]])
    write_csv(os.path.join(HERE, "modelo_sens_atraso.csv"), hdr, rows)

    # ---- ranking de premissas (tornado) ----
    def with_churn(p0, add):
        return replace(p0, churn_retainer_por_ano={k: max(0.0, v + add) for k, v in p0.churn_retainer_por_ano.items()},
                       churn_software_por_ano={k: max(0.0, v + add) for k, v in p0.churn_software_por_ano.items()})

    premissas = [
        ("Preço do retainer (R$ 1.200 / 1.800)", replace(base, preco_retainer=1_200), replace(base, preco_retainer=1_800)),
        ("Preço do diagnóstico (R$ 3.200 / 4.800)", replace(base, preco_diagnostico=3_200), replace(base, preco_diagnostico=4_800)),
        ("Volume de diagnósticos (−30% / +30%)",
         replace(base, diag_por_ano={k: v * 0.7 for k, v in base.diag_por_ano.items()}),
         replace(base, diag_por_ano={k: v * 1.3 for k, v in base.diag_por_ano.items()})),
        ("Conversão diagnóstico→retainer (25% / 50%)", replace(base, conv_diag_para_retainer=0.25), replace(base, conv_diag_para_retainer=0.50)),
        ("Churn mensal (+1 p.p. / −0,5 p.p.)", with_churn(base, 0.01), with_churn(base, -0.005)),
        ("Preço líquido do software (R$ 110 / 170)", replace(base, preco_software_cnpj_liq=110), replace(base, preco_software_cnpj_liq=170)),
        ("CNPJs por parceiro/mês (−40% / +40%)",
         replace(base, cnpjs_por_parceiro_mes_por_ano={k: v * 0.6 for k, v in base.cnpjs_por_parceiro_mes_por_ano.items()}),
         replace(base, cnpjs_por_parceiro_mes_por_ano={k: v * 1.4 for k, v in base.cnpjs_por_parceiro_mes_por_ano.items()})),
        ("Parceiros ativados/mês (−40% / +40%)",
         replace(base, novos_parceiros_mes_por_ano={k: v * 0.6 for k, v in base.novos_parceiros_mes_por_ano.items()}),
         replace(base, novos_parceiros_mes_por_ano={k: v * 1.4 for k, v in base.novos_parceiros_mes_por_ano.items()})),
        ("Custo do analista (+15% / −15%)", replace(base, custo_analista=base.custo_analista * 1.15), replace(base, custo_analista=base.custo_analista * 0.85)),
        ("Overhead (+30% / −30%)", replace(base, overhead_base=base.overhead_base * 1.3, overhead_por_funcionario=base.overhead_por_funcionario * 1.3),
         replace(base, overhead_base=base.overhead_base * 0.7, overhead_por_funcionario=base.overhead_por_funcionario * 0.7)),
        ("Pró-labore do fundador (+25% / −25%)",
         replace(base, pro_labore_fundador_por_ano={k: v * 1.25 for k, v in base.pro_labore_fundador_por_ano.items()}),
         replace(base, pro_labore_fundador_por_ano={k: v * 0.75 for k, v in base.pro_labore_fundador_por_ano.items()})),
        ("Lançamento do software (+12 meses / −3 meses)", replace(base, software_lancamento_t=base.software_lancamento_t + 12),
         replace(base, software_lancamento_t=base.software_lancamento_t - 3)),
        ("Atraso regulatório da demanda (12 meses / 0)", replace(base, atraso_meses=12), base),
        ("Taxa de desconto (+5 p.p. / −5 p.p.)",
         replace(base, taxa_desconto_por_ano={k: v + 0.05 for k, v in base.taxa_desconto_por_ano.items()}, taxa_madura=0.25),
         replace(base, taxa_desconto_por_ano={k: v - 0.05 for k, v in base.taxa_desconto_por_ano.items()}, taxa_madura=0.15)),
        ("Múltiplo de saída do software (1,5× / 4,0× ARR)", replace(base, mult_arr_software=1.5), replace(base, mult_arr_software=4.0)),
        ("Horas por retainer (8 h / 4 h)", replace(base, horas_retainer=8), replace(base, horas_retainer=4)),
    ]
    rows = []
    for nome, lo, hi in premissas:
        r_lo, r_hi = evaluate(lo), evaluate(hi)
        rows.append([nome, r_lo["vpl_emp"], r_hi["vpl_emp"], r_hi["vpl_emp"] - r_lo["vpl_emp"], r_lo["vpl_fund"], r_hi["vpl_fund"],
                     abs(r_hi["vpl_fund"] - r_lo["vpl_fund"])])
    rows.sort(key=lambda r: -abs(r[3]))
    write_csv(os.path.join(HERE, "modelo_ranking_premissas.csv"),
              ["premissa", "vpl_emp_baixo", "vpl_emp_alto", "delta_vpl_emp", "vpl_fund_baixo", "vpl_fund_alto", "delta_vpl_fund_abs"], rows)

    # ---- renda fixa ----
    rf = renda_fixa(base.capital_inicial, base.renda_atual_mes, base.renda_atual_g)
    write_csv(os.path.join(HERE, "modelo_renda_fixa.csv"), list(rf[0].keys()), [list(r.values()) for r in rf])

    # ---- ponto de empate: multiplicador de volume que zera o VPL do fundador ----
    lo, hi = 0.1, 1.5
    for _ in range(40):
        mid = (lo + hi) / 2
        r = evaluate(replace(base, vol_mult=mid))
        if r["vpl_fund"] > 0:
            hi = mid
        else:
            lo = mid
    r_be = evaluate(replace(base, vol_mult=hi))
    empate = dict(vol_mult=hi, retainers_2029=r_be["an"][2029]["retainers"], cnpjs_2029=r_be["an"][2029]["cnpjs"],
                  receita_2029=r_be["an"][2029]["receita_bruta"], receita_2033=r_be["an"][2033]["receita_bruta"],
                  vpl_fund=r_be["vpl_fund"], vpl_emp=r_be["vpl_emp"])
    write_csv(os.path.join(HERE, "modelo_ponto_empate.csv"), list(empate.keys()), [list(empate.values())])

    # ---- fluxo do sócio anual (base) ----
    hdr = ["ano", "aporte", "pro_labore_fundador", "dividendos_fundador_70pct", "renda_atual_perdida", "fluxo_liquido_fundador",
           "fluxo_acumulado", "fluxo_descontado_acum"]
    rows = []
    acum = acumd = 0.0
    anos = out["ano"].astype(int)
    for y in sorted(set(anos)):
        idx = np.where(anos == y)[0]
        ap = float(np.sum(out["aporte"][idx]))
        pl = float(np.sum(out["pro_labore_fundador"][idx]))
        dv = float(np.sum(out["dividendos"][idx])) * base.stake_fundador
        rd = float(np.sum(rb["renda"][idx]))
        fl = float(np.sum(rb["fund_flows"][idx]))
        acum += fl
        acumd += float(np.sum(rb["fund_flows"][idx] * rb["f_mid"][idx]))
        rows.append([y, ap, pl, dv, rd, fl, acum, acumd])
    rows.append(["TV+caixa 2036 (70%)", 0, 0, base.stake_fundador * (rb["tv_base"] + rb["caixa_final"]), 0,
                 base.stake_fundador * (rb["tv_base"] + rb["caixa_final"]), acum + base.stake_fundador * (rb["tv_base"] + rb["caixa_final"]),
                 acumd + base.stake_fundador * (rb["tv_base"] + rb["caixa_final"]) * rb["f_end"][-1]])
    write_csv(os.path.join(HERE, "modelo_fluxo_socio.csv"), hdr, rows)

    # ---- unit economics (base, R$ de 2027) ----
    aliq1 = aliquota_simples(300_000, ANEXO_III)
    ue = [
        ["Retainer PME", base.preco_retainer, base.horas_retainer * 90, base.preco_retainer * aliq1, base.taxa_pagamento_consultoria,
         base.preco_retainer * base.provisao_perdas, base.preco_retainer - base.horas_retainer * 90 - base.preco_retainer * aliq1 - 3 - base.preco_retainer * base.provisao_perdas],
        ["Diagnóstico", base.preco_diagnostico, base.horas_diagnostico * 90, base.preco_diagnostico * aliq1, 3,
         base.preco_diagnostico * base.provisao_perdas, base.preco_diagnostico - base.horas_diagnostico * 90 - base.preco_diagnostico * aliq1 - 3 - base.preco_diagnostico * base.provisao_perdas],
        ["Projeto média empresa", base.preco_projeto_media, base.horas_projeto_media * 90, base.preco_projeto_media * aliq1, 3, 0,
         base.preco_projeto_media - base.horas_projeto_media * 90 - base.preco_projeto_media * aliq1 - 3],
        ["Software por CNPJ (mês, líquido do desconto ao contador)", base.preco_software_cnpj_liq, base.infra_por_cnpj,
         base.preco_software_cnpj_liq * aliq1, base.preco_software_cnpj_liq * base.taxa_pagamento_software, 0,
         base.preco_software_cnpj_liq - base.infra_por_cnpj - base.preco_software_cnpj_liq * aliq1 - base.preco_software_cnpj_liq * base.taxa_pagamento_software],
    ]
    write_csv(os.path.join(HERE, "modelo_unit_economics.csv"),
              ["produto", "preco", "custo_direto_horas_ou_infra", "tributo_simples", "taxa_pgto", "provisao", "contribuicao"], ue)

    # ---- LTV/CAC ----
    contrib_sw = ue[3][-1]
    contrib_ret = ue[0][-1]
    ltv_rows = []
    for ch in [0.01, 0.015, 0.025, 0.035]:
        ltv_rows.append(["software", ch, contrib_sw / ch, base.cac_cnpj, (contrib_sw / ch) / base.cac_cnpj, base.cac_cnpj / contrib_sw])
        ltv_rows.append(["retainer", ch, contrib_ret / ch, base.cac_retainer + base.cac_diagnostico / base.conv_diag_para_retainer,
                         (contrib_ret / ch) / (base.cac_retainer + base.cac_diagnostico / base.conv_diag_para_retainer),
                         (base.cac_retainer + base.cac_diagnostico / base.conv_diag_para_retainer) / contrib_ret])
    write_csv(os.path.join(HERE, "modelo_ltv_cac.csv"), ["produto", "churn_mensal", "ltv_nao_descontado", "cac", "ltv_cac", "payback_cac_meses"], ltv_rows)

    # ---- resumo no terminal ----
    print("=" * 100)
    print("RESUMO — CENÁRIO BASE")
    print("=" * 100)
    for t in range(24):
        print(f"{t+1:>2} {label(t):>7} ret {out['retainers'][t]:5.1f} diag {out['diag_vendidos'][t]:4.1f} cnpj {out['cnpjs'][t]:6.1f} "
              f"rec {out['receita_bruta'][t]:9,.0f} fixo {out['custo_fixo_total'][t]:8,.0f} ebitda {out['ebitda'][t]:9,.0f} "
              f"caixa {out['caixa'][t]:9,.0f} anal {int(out['analistas'][t])} dev {int(out['devs'][t])} h {out['horas_demanda'][t]:5.0f}/{out['horas_capacidade'][t]:5.0f} "
              f"aliq {out['aliquota_efetiva'][t]*100:4.1f}% fR {out['fator_r'][t]:4.2f} reun {out['reunioes_necessarias'][t]:4.1f} hV {out['horas_vendas_fundador'][t]:4.0f}")
    print("-" * 100)
    for y, a in an.items():
        print(f"{y} rec {a['receita_bruta']:12,.0f} | ret {a['rec_retainer']:10,.0f} diag {a['rec_diag']:9,.0f} proj {a['rec_projeto']:9,.0f} "
              f"sw {a['rec_software']:10,.0f} | ebitda {a['ebitda']:10,.0f} ({a['ebitda']/max(1,a['receita_bruta'])*100:5.1f}%) "
              f"fcf {a['fcf']:10,.0f} div {a['dividendos']:10,.0f} caixa {a['caixa']:9,.0f} | ret {a['retainers']:5.1f} cnpj {a['cnpjs']:6.1f} parc {a['parceiros']:4.1f} hc {int(a['headcount'])} "
              f"util {a['utilizacao']*100:4.0f}% aliq {a['aliquota_efetiva']*100:4.1f}% fR {a['fator_r']:4.2f}")
    print("-" * 100)
    print("TV:", {k: (round(v, 3) if isinstance(v, float) else v) for k, v in rb["tv"].items()})
    for name, r in results.items():
        print(f"{name:>10}: VPL emp {r['vpl_emp']:12,.0f} TIR emp {r['tir_emp']*100 if not math.isnan(r['tir_emp']) else float('nan'):7.1f}% | "
              f"VPL fund {r['vpl_fund']:12,.0f} TIR fund {r['tir_fund']*100 if not math.isnan(r['tir_fund']) else float('nan'):7.1f}% | "
              f"caixa min {r['caixa_min']:9,.0f} em {label(r['t_caixa_min'])} | cap nec {r['capital_necessario']:9,.0f} | "
              f"BE mês {(r['breakeven_t']+1) if r['breakeven_t'] is not None else -1} | PB fund {(r['payback_fund']+1) if r['payback_fund'] is not None else -1} "
              f"PBd fund {(r['payback_fund_desc']+1) if r['payback_fund_desc'] is not None else -1} | PB emp {(r['payback_emp']+1) if r['payback_emp'] is not None else -1}")
    print(f"Valor esperado ponderado: VPL empresa {ev_emp:,.0f} | VPL fundador {ev_fund:,.0f}")
    print("Ponto de empate (VPL fundador = 0):", {k: round(v, 2) for k, v in empate.items()})
    print("Renda fixa:")
    for r in rf:
        print(f"  {r['alternativa']:<70} liq 5a {r['valor_liquido_5a']:10,.0f} | +renda {r['patrimonio_total_5a']:12,.0f}")
    print("CSVs gravados em", HERE)


if __name__ == "__main__":
    main()
