#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Revisão independente — recálculo do zero (seção 12 do prompt).

Escrito pelo revisor sem copiar o modelo_financeiro.py. Usa só numpy e stdlib.
Insumos: números das notas 03 (mercado), 05 (operação/custos), 06 (tributos/macro) e 09, e as
premissas declaradas na tabela 6.2 do relatório. Onde a minha regra de operação difere da do
modelo original, isso está dito no próprio código (comentário "DIFERE").

Blocos:
  A) TAM / SAM / SOM
  B) Unit economics por produto, com Simples Anexo III por faixa, encargos e comissão de canal
  C) Ponto de equilíbrio em clientes e em meses
  D) Modelo mensal próprio (122 meses) -> caixa, fundo do vale, VPL, TIR, payback, cenários, valor esperado
  E) Re-desconto dos fluxos do modelo ORIGINAL com funções próprias de VPL/TIR (checa a aritmética)
  F) Diagnósticos de auditoria do modelo original: horas do fundador, Fator R legal, IRRF 10% sobre
     dividendos (Lei 15.270/2025), break-even econômico, raízes da TIR do pessimista
Saída: texto no terminal e arquivo revisao_recalculo_saida.txt na mesma pasta.
"""
import math
import os
import sys
from dataclasses import dataclass, field, replace
from typing import Dict, List, Tuple

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_LINES: List[str] = []


def p(*args):
    s = " ".join(str(a) for a in args)
    print(s)
    OUT_LINES.append(s)


def br(x, nd=0):
    if isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
        return "n/d"
    s = f"{x:,.{nd}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return s


# ======================================================================================
# A) TAM / SAM / SOM — insumos das notas 03 e 09
# ======================================================================================
def bloco_A():
    p("\n" + "=" * 100)
    p("A) TAM / SAM / SOM (recálculo com os insumos das notas 03 e 09)")
    p("=" * 100)
    LR, LP, SN = 230_237, 1_514_871, 7_348_088          # nota 03 (AmdJus/RFB)
    SN_B2B = SN * 0.70                                    # >70% do Simples opera B2B (IBPT via InfoMoney)
    tam_pontual = LR * 25_000 + LP * 6_000 + SN_B2B * 1_500
    p(f"TAM pontual acumulado 2026-29: LR {br(LR*25_000/1e9,2)} bi + LP {br(LP*6_000/1e9,2)} bi + Simples B2B "
      f"{br(SN_B2B*1_500/1e9,2)} bi = {br(tam_pontual/1e9,2)} bi -> {br(tam_pontual/4/1e9,2)} bi/ano  "
      f"(relatório: 5,76 + 9,09 + 7,72 = 22,6 bi; 5,6 bi/ano)")
    tam_rec = (LR * 2_000 + LP * 300 + SN_B2B * 30) * 12
    p(f"TAM recorrente teórico: {br(tam_rec/1e9,2)} bi/ano (relatório 12,8)")
    setor = 60e9 * 1.513
    p(f"Top-down: setor contábil 60 bi (2018) x 1,513 = {br(setor/1e9,1)} bi; 10% = {br(setor*0.1/1e9,1)} bi/ano "
      f"(relatório 91 / 9); checagem 71.000 x 93 x 1.142 x 12 = {br(71_000*93*1_142*12/1e9,1)} bi")
    p(f"Top-down adequação: 689 x 9,1 mi = {br(689*9.1e6/1e9,2)} bi/ano (relatório 6,3)")
    alvo_sam = 150_000 + LP + SN_B2B
    sam_lo = alvo_sam * 0.05 * 3_000 / 4
    sam_hi = alvo_sam * 0.10 * 3_000 / 4
    rec_lo = 71_000 * 0.05 * 500 * 12 + 6.8e6 * 0.03 * 600
    rec_hi = 71_000 * 0.10 * 500 * 12 + 6.8e6 * 0.03 * 600
    p(f"SAM: alvo {br(alvo_sam)} empresas; consultoria {br(sam_lo/1e9,2)}-{br(sam_hi/1e9,2)} bi/ano; recorrente "
      f"{br(rec_lo/1e6)}-{br(rec_hi/1e6)} mi/ano; total {br((sam_lo+rec_lo)/1e9,2)}-{br((sam_hi+rec_hi)/1e9,2)} bi/ano "
      f"(relatório 0,4-0,7)")
    # Local (Uberlândia)
    simples_udi, mei_udi = 114_528, 81_900
    me_epp = simples_udi - mei_udi
    lp_udi = me_epp * LP / SN
    lr_udi = me_epp * LR / SN
    nao_mei = me_epp + lp_udi + lr_udi
    alvo_local = lp_udi + lr_udi + 0.7 * me_epp
    p(f"Uberlândia: ME/EPP {br(me_epp)}; LP {br(lp_udi)}; LR {br(lr_udi)}; não-MEI {br(nao_mei)}; alvo {br(alvo_local)} "
      f"(relatório 32.628 / 6.727 / 1.022 / 40.377 / 30.588)")
    sam_local_cons = alvo_local * 0.075 * 3_000 / 4
    sam_local_rec = nao_mei * 0.03 * 600
    escritorios_a = simples_udi / 23_201_805 * 71_000
    escritorios_b = nao_mei / 93
    p(f"SAM local: consultoria {br(sam_local_cons/1e6,2)} mi/ano + recorrente {br(sam_local_rec/1e6,2)} mi/ano = "
      f"{br((sam_local_cons+sam_local_rec)/1e6,2)} mi/ano; escritórios {br(escritorios_a)} a {br(escritorios_b)} "
      f"(relatório 1,7 + 0,7; 350 a 430)")
    # Triângulo (9 cidades) — ME/EPP das 9 cidades (nota 03 §9)
    me_epp_tri = me_epp + 14_003 + 7_286 + 4_689 + 3_508 + 3_396 + 2_902 + 2_650 + 1_381
    nao_mei_tri = me_epp_tri * (1 + LP / SN + LR / SN)
    alvo_tri = me_epp_tri * (LP / SN + LR / SN + 0.7)
    sam_tri = alvo_tri * 0.075 * 3_000 / 4 + nao_mei_tri * 0.03 * 600
    p(f"Triângulo (9 cidades): ME/EPP {br(me_epp_tri)}; não-MEI {br(nao_mei_tri)}; alvo {br(alvo_tri)} (relatório 67.915); "
      f"SAM regional total ~{br(sam_tri/1e6,1)} mi/ano")
    som_lo = 30 * 4_000 + 20 * 40 * 25 * 12
    som_hi = 100 * 5_000 + 300 * 150 * 12
    p(f"SOM local bottom-up: {br(som_lo/1e6,2)} a {br(som_hi/1e6,2)} mi/ano (relatório 0,4 a 0,9)")
    p(f"Coerência: SOM 0,5-3 mi = {br(0.5e6/0.7e9*100,2)}% a {br(3e6/0.4e9*100,2)}% do SAM; SAM/TAM = "
      f"{br(0.4/6*100,1)}% a {br(0.7/5*100,1)}%  (relatório 0,1-0,7% e 7-14%)")
    p("ACHADO: a receita do modelo-base em 2033 (R$ 4,0 mi) supera o SAM local de Uberlândia "
      f"(~R$ {br((sam_local_cons+sam_local_rec)/1e6,1)} mi/ano) e equivale a ~{br(4.0e6/sam_tri*100)}% do SAM "
      f"regional (~R$ {br(sam_tri/1e6,1)} mi/ano). Só é coerente com venda remota (canal contador) fora do Triângulo, "
      "o que o texto da seção 2.7 limita a R$ 1-3 mi/ano nos anos 1-3 e não explicita para 2030-2036.")
    return dict(sam_local=sam_local_cons + sam_local_rec, sam_tri=sam_tri)


# ======================================================================================
# B) Unit economics — Simples por faixa, encargos, comissão de canal
# ======================================================================================
ANEXO_III = [(180_000, 0.060, 0), (360_000, 0.112, 9_360), (720_000, 0.135, 17_640),
             (1_800_000, 0.160, 35_640), (3_600_000, 0.210, 125_640), (4_800_000, 0.330, 648_000)]
ANEXO_V = [(180_000, 0.155, 0), (360_000, 0.180, 4_500), (720_000, 0.195, 9_900),
           (1_800_000, 0.205, 17_100), (3_600_000, 0.230, 62_100), (4_800_000, 0.305, 540_000)]


def aliq_efetiva(rbt12: float, anexo) -> float:
    """LC 123, art. 18, §1º-A: (RBT12 x nominal - dedução) / RBT12."""
    rbt12 = max(rbt12, 1.0)
    for teto, nom, ded in anexo:
        if rbt12 <= teto:
            return (rbt12 * nom - ded) / rbt12
    return (rbt12 * anexo[-1][1] - anexo[-1][2]) / rbt12


def custo_clt_simples(salario: float, beneficios: float = 1_400.0) -> float:
    """Nota 05: FGTS 8% + 13º 8,33% + férias 8,33% + 1/3 2,78% = 27,44%; CPP dentro do DAS."""
    return salario * 1.2744 + beneficios


def bloco_B():
    p("\n" + "=" * 100)
    p("B) Unit economics (R$ de 2027)")
    p("=" * 100)
    c_analista = custo_clt_simples(6_000)
    p(f"Custo analista fiscal pleno: 6.000 x 1,2744 + 1.400 = {br(c_analista)} (nota 05: 9.046); custo-hora a 100 h = "
      f"{br(c_analista/100,1)}; a 75 h = {br(c_analista/75,1)}")
    for rbt in [200_000, 300_000, 600_000, 800_000, 1_500_000, 3_000_000, 4_000_000]:
        p(f"  RBT12 {br(rbt):>10}: Anexo III {aliq_efetiva(rbt, ANEXO_III)*100:5.2f}% | Anexo V {aliq_efetiva(rbt, ANEXO_V)*100:5.2f}%")
    p("  (relatório, tabela 5.4: 800 mil Anexo V = 18,26% -> correto é 18,36%)")
    hora = 90.0
    produtos = [
        # nome, preço, horas, infra, taxa pgto fixa, taxa pgto %, provisão, comissão de canal (sobre preço)
        ("Retainer PME (6 h)", 1_500, 6, 0, 3, 0.0, 0.03, 0.0),
        ("Diagnóstico (25 h)", 4_000, 25, 0, 3, 0.0, 0.03, 0.0),
        ("Projeto média (80 h)", 25_000, 80, 0, 3, 0.0, 0.0, 0.0),
        ("Software líquido R$ 140 (revenda c/ desconto)", 140, 0, 8, 0, 0.01, 0.0, 0.0),
        ("Software lista R$ 199 c/ comissão 20% ao contador", 199, 0, 8, 0, 0.01, 0.0, 0.20),
        ("Software lista R$ 199 c/ comissão 30% ao contador", 199, 0, 8, 0, 0.01, 0.0, 0.30),
        ("Software lista R$ 199 c/ comissão 30% + API R$ 15", 199, 0, 8 + 15, 0, 0.01, 0.0, 0.30),
    ]
    for rbt in [300_000, 720_000, 1_800_000]:
        a3 = aliq_efetiva(rbt, ANEXO_III)
        p(f"-- RBT12 {br(rbt)} (Anexo III {a3*100:.2f}%)")
        for nome, preco, h, infra, tf, tp, prov, com in produtos:
            trib = preco * a3  # tributo incide sobre a receita bruta (preço cheio, inclusive a parte comissionada)
            contrib = preco - h * hora - infra - tf - preco * tp - preco * prov - preco * com - trib
            p(f"   {nome:<52} contribuição {br(contrib,0):>7} ({contrib/preco*100:4.0f}%)")
    p("  Relatório (RBT12 300 mil, 8,08%): retainer 791 (53%), diagnóstico 1.304 (33%), projeto 15.777 (63%), software 119 (85%) -> batem.")
    p("  Comissão explícita de 20-30% sobre R$ 199 deixa R$ 115-135 de contribuição: equivalente ao modelo de revenda a R$ 140 líquidos.")
    # LTV / CAC
    contrib_ret = 1_500 - 6 * hora - 1_500 * aliq_efetiva(300_000, ANEXO_III) - 3 - 45
    contrib_sw = 140 - 8 - 140 * aliq_efetiva(300_000, ANEXO_III) - 1.4
    for ch in [0.01, 0.015, 0.025, 0.035]:
        p(f"  churn {ch*100:.1f}%/mês: LTV retainer {br(contrib_ret/ch)} (CAC 1.800 -> {contrib_ret/ch/1_800:.1f}x); "
          f"LTV software {br(contrib_sw/ch)} (CAC 300 -> {contrib_sw/ch/300:.1f}x)")
    p("  (relatório: 52.720 / 29,3x e 7.953 / 26,5x a 1,5% -> batem)")


# ======================================================================================
# C) Ponto de equilíbrio
# ======================================================================================
def bloco_C():
    p("\n" + "=" * 100)
    p("C) Ponto de equilíbrio em clientes e em meses")
    p("=" * 100)
    a3 = aliq_efetiva(300_000, ANEXO_III)
    c_analista = custo_clt_simples(6_000)
    estruturas = {
        "sócios sem pró-labore, sem CLT (overhead 3 mil + mkt 1,5 mil)": 4_500,
        "pró-labore 8 mil + 4 mil, sem CLT, overhead 5 mil + mkt 1,5 mil": 18_500,
        "pró-labore 12 mil + 1 analista + overhead 5,8 mil + mkt 1,5 mil": 12_000 + c_analista + 5_800 + 1_500,
    }
    for nome, fixo in estruturas.items():
        for preco in [1_500, 2_000]:
            contrib = preco * (1 - a3 - 0.03) - 3 - 6 * 90  # contribuição após horas do analista
            liq = preco * (1 - a3 - 0.03) - 3                # se as horas forem dos sócios (custo já no fixo)
            p(f"  {nome}: retainer {preco} -> {math.ceil(fixo/liq)} clientes (horas dos sócios) | "
            f"{math.ceil(fixo/contrib)} clientes (horas de analista a R$ 90)")
    p("  Relatório (4.6): 8 retainers de 2 mil sem pró-labore; 15 com; 20 a 22 de 1.500 com pró-labore cheio -> ordem de grandeza compatível "
      "(a nota 05 usa fixo de 27 mil com analista; aqui 18,5 mil sem analista).")
    # meses até o equilíbrio com rampa de 1 e 2 retainers/mês
    for novos in [1.0, 2.0]:
        for fixo, rot in [(4_500, "sem pró-labore"), (18_500, "com pró-labore 12 mil")]:
            n = 0.0
            for m in range(1, 61):
                if m >= 3:
                    n = n * (1 - 0.015) + novos
                liq = 1_500 * (1 - a3 - 0.03) - 3
                if n * liq >= fixo:
                    p(f"  {novos:.0f} retainer(s)/mês de R$ 1.500, {rot}: equilíbrio no mês {m} com {n:.1f} clientes")
                    break
            else:
                p(f"  {novos:.0f} retainer(s)/mês de R$ 1.500, {rot}: sem equilíbrio em 60 meses")
    p("  Leitura: o 'break-even de EBITDA no mês 4' do modelo só existe porque o pró-labore do fundador é 30% da receita "
      "(R$ 2,4 a 5,5 mil) e não há CLT; com pró-labore de 12 mil o equilíbrio por retainers vem no mês 10-17.")


# ======================================================================================
# D) Modelo mensal próprio (independente)
# ======================================================================================
START = (2026, 11)
T = 122


def cal(t: int) -> Tuple[int, int]:
    m0 = START[0] * 12 + START[1] - 1 + t
    return m0 // 12, m0 % 12 + 1


def lab(t: int) -> str:
    y, m = cal(t)
    return f"{['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][m-1]}/{str(y)[2:]}"


@dataclass
class Prem:
    capital: float = 100_000
    renda_atual: float = 10_000
    renda_g: float = 0.04
    stake: float = 0.70
    # preços (R$ 2027), inflação 4% a partir de 2028
    retainer: float = 1_500
    diagnostico: float = 4_000
    projeto: float = 25_000
    sw: Dict[int, float] = field(default_factory=lambda: {y: (140 if y <= 2028 else 155 if y <= 2030 else 165) for y in range(2026, 2037)})
    workshops: float = 1_500
    infl_p: float = 0.04
    infl_c: float = 0.045
    # demanda
    diag_ano: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [2, 27, 40, 50, 40, 35, 35, 45, 20, 15, 12])))
    saz: List[float] = field(default_factory=lambda: [1.1, 1.1, 1.3, 0.8, 0.8, 0.8, 0.8, 1.0, 1.2, 1.2, 1.0, 0.9])
    conv: float = 0.40
    ret_direto: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, .5, .5, .8, .5, .5, .5, .6, .2, .2, .2])))
    proj_ano: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, 2, 5, 8, 6, 6, 7, 8, 4, 3, 3])))
    churn_ret: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, .015, .015, .015, .02, .02, .02, .025, .03, .03, .03])))
    churn_sw: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, .015, .015, .015, .015, .015, .015, .02, .02, .02, .02])))
    sw_t0: int = 10
    parc_mes: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, .75, .75, 1, 1, .75, .5, .5, .25, .25, .25])))
    max_parc: int = 85
    cnpj_parc: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, .5, .5, .6, .6, .6, .4, .4, .25, .25, .25])))
    cnpj_dir: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, 0, .5, 2, 2.5, 2.5, 2.5, 2.5, 1.5, 1.5, 1.5])))
    adocao_ret: float = 0.10
    churn_parc: float = 0.005
    # horas
    h_ret: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [6, 6, 6, 5, 4, 4, 3.5, 3.5, 3.5, 3.5, 3.5])))
    h_diag: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [25, 25, 20, 15, 15, 15, 15, 15, 15, 15, 15])))
    h_proj: float = 80
    h_onb: float = 3
    h_sup: float = 0.25
    cap_fund: float = 50
    cap_socio: float = 60
    cap_anal: float = 100
    socio_t0: int = 3
    # custos
    pl_fund: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, 8_000, 8_000, 10_000, 10_000, 12_000, 12_000, 14_000, 14_000, 15_000, 15_000])))
    pl_socio: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [0, 4_000, 7_000, 9_000, 9_000, 10_000, 10_000, 12_000, 12_000, 12_000, 12_000])))
    pl_fund_t0: int = 6
    fator_r_alvo: float = 0.30
    c_anal: float = 9_046
    c_dev: float = 10_831
    c_cs: float = 6_243
    c_ger: float = 7_135 + 2_500 * 1.2744
    overhead1: float = 3_000
    overhead2: float = 5_000
    overhead_hc: float = 800
    mkt: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [500, 1_500, 3_000, 5_000, 5_000, 5_000, 5_000, 5_000, 4_000, 4_000, 4_000])))
    cac_ret: float = 800
    cac_diag: float = 400
    cac_cnpj: float = 300
    taxa_fixa: float = 3
    taxa_sw: float = 0.01
    provisao: float = 0.03
    infra: float = 8
    api_2029: float = 15
    abertura: float = 8_000
    capex0: float = 8_000
    capex_ano: float = 4_000
    capex_hc: float = 3_000
    vida: int = 36
    reserva_meses: float = 3
    taxa: Dict[int, float] = field(default_factory=lambda: dict(zip(range(2026, 2037), [.35, .35, .32, .28, .24, .20, .20, .20, .20, .20, .20])))
    g: float = 0.03
    # cenário
    vol: float = 1.0
    preco_mult: float = 1.0
    stop_t: int = -1
    software: bool = True
    irrf_modo: str = "nenhum"   # "nenhum" | "timing" (10% retido em dez, devolvido 9 meses depois) | "custo" (10% perdido)


def simular(q: Prem) -> Dict[str, np.ndarray]:
    k = ["rec", "rec_ret", "rec_sw", "trib", "var", "fixo", "ebitda", "capex", "dep", "fcf", "caixa", "div",
         "pl_f", "pl_s", "ret", "cnpj", "parc", "anal", "dev", "cs", "ger", "horas", "cap", "fator_r", "aliq", "anexo",
         "receb", "diag", "novos_ret", "proj", "novos_cnpj"]
    o = {c: np.zeros(T) for c in k}
    caixa = 0.0; ret = 0.0; cnpj = 0.0; parc = 0.0
    anal = dev = cs = ger = 0
    receb = 0.0
    rec_h: List[float] = []; folha_h: List[float] = []
    capex_h: List[Tuple[int, float]] = []
    pend: Dict[int, float] = {}
    acima = 0
    abaixo = 0
    for t in range(T):
        y, m = cal(t)
        parado = q.stop_t >= 0 and t >= q.stop_t
        ip = (1 + q.infl_p) ** max(0, y - 2027)
        ic = (1 + q.infl_c) ** max(0, y - 2027)
        # demanda
        if parado:
            diag = proj = rd = 0.0
        else:
            diag = (q.diag_ano[y] / 12 * q.saz[m - 1]) * q.vol
            if t == 1:
                diag = q.diag_ano[2026] * q.vol
            elif y == 2026:
                diag = 0.0
            proj = q.proj_ano[y] / 12 * q.vol
            rd = q.ret_direto[y] * q.vol if t >= 5 else 0.0
        diag_prev = o["diag"][t - 1] if t > 0 else 0.0
        novos_ret = q.conv * diag_prev + rd
        ch_r = 1.0 if parado else q.churn_ret[y]
        ret0 = ret
        ret = max(0.0, ret0 * (1 - ch_r) + novos_ret)
        ret_m = (ret0 + ret) / 2
        novos_cnpj = 0.0
        if q.software and not parado and t >= q.sw_t0:
            parc = min(q.max_parc, parc * (1 - q.churn_parc) + q.parc_mes[y] * q.vol)
            novos_cnpj = (parc * q.cnpj_parc[y] + ret0 * q.adocao_ret / 12 + q.cnpj_dir[y]) * q.vol
        ch_s = 1.0 if parado else q.churn_sw[y]
        cnpj0 = cnpj
        cnpj = max(0.0, cnpj0 * (1 - ch_s) + novos_cnpj)
        cnpj_m = (cnpj0 + cnpj) / 2
        # receita
        pm = q.preco_mult
        r_ret = ret_m * q.retainer * ip * pm
        r_diag = diag * q.diagnostico * ip * pm
        r_proj = proj * q.projeto * ip * pm
        r_sw = cnpj_m * q.sw[y] * ip * pm
        r_ws = q.workshops * pm if (2027 <= y <= 2029 and not parado) else 0.0
        rec = r_ret + r_diag + r_proj + r_sw + r_ws
        rec_h.append(rec)
        # horas e equipe. DIFERE do original: contrato quando a demanda supera a capacidade por 1 mês
        # (não 2) e não demito (o original demite após 3 meses de folga).
        horas = ret_m * q.h_ret[y] + diag * q.h_diag[y] + proj * q.h_proj + novos_cnpj * q.h_onb + (cnpj_m * q.h_sup if cs == 0 else 0)
        cap_s = q.cap_socio if t >= q.socio_t0 else 0.0
        req = max(0, math.ceil((horas - q.cap_fund - cap_s) / q.cap_anal)) if not parado else 0
        if req > anal:
            acima += 1
            if acima >= 1:
                anal += 1; acima = 0
        else:
            acima = 0
        # demissão: 3 meses seguidos com um analista a mais do que o necessário (regra de operador; igual à do original)
        if req < anal:
            abaixo += 1
            if abaixo >= 3:
                anal -= 1; abaixo = 0
        else:
            abaixo = 0
        if parado:
            anal = dev = cs = ger = 0
        else:
            fixo_prev = o["fixo"][t - 1] if t > 0 else 10_000
            caixa_ok = caixa >= 3 * fixo_prev
            mrr_sw = cnpj * q.sw[y] * ip * pm
            if dev == 0 and cnpj >= 25 and caixa_ok:
                dev = 1
            if dev == 1 and cnpj >= 500 and caixa_ok and mrr_sw >= 4 * q.c_dev * ic:
                dev = 2
            req_cs = math.ceil(cnpj / 400) if cnpj >= 150 else 0
            if req_cs > cs and caixa_ok:
                cs += 1
            if ger == 0 and cnpj >= 200 and caixa_ok and mrr_sw >= 2.5 * q.c_ger * ic:
                ger = 1
            if ger == 1 and cnpj >= 700 and caixa_ok and mrr_sw >= 6 * q.c_ger * ic:
                ger = 2
        cap = q.cap_fund + cap_s + anal * q.cap_anal
        # custos fixos
        if parado:
            pl_f = pl_s = c_a = c_d = c_c = c_g = oh = mk = 0.0
        else:
            # DIFERE: sem a regra "pró-labore só sobe se margem 12m >= 5%" (simplificação)
            pl_s = q.pl_socio[y] if t >= q.socio_t0 else 0.0
            pl_f = q.pl_fund[y] if t >= q.pl_fund_t0 else max(0.0, q.fator_r_alvo * rec - pl_s)
            c_a = anal * q.c_anal * ic; c_d = dev * q.c_dev * ic; c_c = cs * q.c_cs * ic; c_g = ger * q.c_ger * ic
            hc = anal + dev + cs + ger
            oh = (q.overhead1 if t < 6 else q.overhead2) * ic + hc * q.overhead_hc * ic
            mk = q.mkt[y] * ic
            if y >= 2028 and len(rec_h) > 1:
                mk = min(mk, max(1_500 * ic, 0.06 * sum(rec_h[-13:-1]) / 12))
        hc = anal + dev + cs + ger
        fixo = pl_f + pl_s + c_a + c_d + c_c + c_g + oh + mk
        # tributos: Fator R LEGAL = folha dos 12 meses ANTERIORES / receita dos 12 meses anteriores
        # (Res. CGSN 140, art. 26); no 1º mês de atividade usa-se o próprio mês.  DIFERE do original (janela inclusiva).
        folha = pl_f + pl_s + 0.9 * (c_a + c_d + c_c + c_g)
        folha_h.append(folha)
        if len(rec_h) <= 1 or sum(rec_h[:-1]) == 0:
            f12, r12 = folha, rec
        else:
            f12, r12 = sum(folha_h[-13:-1]), sum(rec_h[-13:-1])
        fator_r = f12 / r12 if r12 > 0 else 1.0
        n = len(rec_h)
        rbt12 = sum(rec_h[-12:]) * (12 / min(12, n))
        if rbt12 > 4_800_000:
            aliq, anexo = 0.17, 2
        elif fator_r >= 0.28:
            aliq, anexo = aliq_efetiva(rbt12, ANEXO_III), 0
        else:
            aliq, anexo = aliq_efetiva(rbt12, ANEXO_V), 1
        trib = rec * aliq
        var = ((ret_m + diag + proj) * q.taxa_fixa + r_sw * q.taxa_sw + (r_ret + r_diag + r_ws) * q.provisao
               + cnpj_m * (q.infra + (q.api_2029 if y >= 2029 else 0)) * ic
               + (novos_ret * q.cac_ret + diag * q.cac_diag + novos_cnpj * q.cac_cnpj) * ic)
        ebitda = rec - trib - var - fixo - (q.abertura if t == 0 else 0)
        # capex / depreciação
        capex = (q.capex0 if t == 0 else 0) + (q.capex_ano * ic if (m == 1 and y >= 2028 and not parado) else 0)
        if t > 0 and hc > o["dev"][t - 1] + o["anal"][t - 1] + o["cs"][t - 1] + o["ger"][t - 1] and not parado:
            capex += (hc - (o["dev"][t - 1] + o["anal"][t - 1] + o["cs"][t - 1] + o["ger"][t - 1])) * q.capex_hc * ic
        if capex > 0:
            capex_h.append((t, capex))
        dep = sum(c / q.vida for tt, c in capex_h if 0 <= t - tt < q.vida)
        # caixa por prazos: retainer e workshop à vista; diagnóstico 50/50 (t, t+1); projeto 50/50 (t, t+2); software t+1
        pend[t] = pend.get(t, 0) + r_ret + r_ws + 0.5 * r_diag + 0.5 * r_proj
        pend[t + 1] = pend.get(t + 1, 0) + 0.5 * r_diag + r_sw
        pend[t + 2] = pend.get(t + 2, 0) + 0.5 * r_proj
        recebido = pend.pop(t, 0.0)
        novo_receb = receb + rec - recebido
        d_receb = novo_receb - receb
        receb = novo_receb
        fcf = ebitda - capex - d_receb
        caixa_antes = caixa + (q.capital if t == 0 else 0) + fcf
        div = 0.0
        if parado and t == q.stop_t:
            div = max(0.0, caixa_antes)
        elif m == 12 and y >= 2028 and not parado and caixa_antes > q.reserva_meses * fixo:
            div = caixa_antes - q.reserva_meses * fixo
        caixa = caixa_antes - div
        for kk, vv in dict(rec=rec, rec_ret=r_ret, rec_sw=r_sw, trib=trib, var=var, fixo=fixo, ebitda=ebitda, capex=capex, dep=dep,
                           fcf=fcf, caixa=caixa, div=div, pl_f=pl_f, pl_s=pl_s, ret=ret, cnpj=cnpj, parc=parc, anal=anal, dev=dev,
                           cs=cs, ger=ger, horas=horas, cap=cap, fator_r=fator_r, aliq=aliq, anexo=anexo, receb=receb, diag=diag,
                           novos_ret=novos_ret, proj=proj, novos_cnpj=novos_cnpj).items():
            o[kk][t] = vv
    return o


def fatores(taxa_por_ano: Dict[int, float]) -> Tuple[np.ndarray, np.ndarray]:
    """Fator de desconto de meio de período (fluxos) e de fim de período (valor terminal), taxa anual por ano convertida em mensal."""
    f_mid = np.zeros(T); f_end = np.zeros(T); acc = 1.0
    for t in range(T):
        y, _ = cal(t)
        rm = (1 + taxa_por_ano[y]) ** (1 / 12) - 1
        f_mid[t] = 1 / (acc * (1 + rm) ** 0.5)
        acc *= 1 + rm
        f_end[t] = 1 / acc
    return f_mid, f_end


def tir_mensal(fl: np.ndarray) -> Tuple[float, int]:
    """TIR por bissecção; devolve (taxa mensal, nº de mudanças de sinal do VPL na grade -0,5..1,0)."""
    if not (np.any(fl > 0) and np.any(fl < 0)):
        return float("nan"), 0
    tt = np.arange(len(fl))
    npv = lambda r: float(np.sum(fl / (1 + r) ** tt))
    grade = np.concatenate([np.linspace(-0.5, -0.001, 60), np.linspace(0.0, 1.0, 500)])
    v = np.array([npv(r) for r in grade])
    sinais = int(np.sum(np.sign(v[1:]) != np.sign(v[:-1])))
    raiz = float("nan")
    for i in range(1, len(grade)):
        if v[i - 1] * v[i] < 0:
            lo, hi = grade[i - 1], grade[i]
            for _ in range(80):
                mid = (lo + hi) / 2
                if npv(lo) * npv(mid) <= 0:
                    hi = mid
                else:
                    lo = mid
            raiz = (lo + hi) / 2
            break
    return raiz, sinais


def avaliar(q: Prem) -> Dict[str, object]:
    o = simular(q)
    f_mid, f_end = fatores(q.taxa)
    parado = q.stop_t >= 0
    # valor terminal: perpetuidade sobre NOPAT 2036 (EBIT; IRPJ/CSLL no DAS), reinvestimento g/ROIC com ROIC <= 100%
    idx36 = [t for t in range(T) if cal(t)[0] == 2036]
    ebit36 = float(np.sum(o["ebitda"][idx36] - o["dep"][idx36]))
    ppe = sum(o["capex"][t] * (1 - (T - 1 - t) / q.vida) for t in range(T) if T - 1 - t < q.vida)
    cap_inv = o["receb"][-1] + ppe
    roic = ebit36 / cap_inv if cap_inv > 0 else 10.0
    reinv = q.g / min(roic, 1.0) if roic > 0 else 0
    tv_perp = ebit36 * (1 + q.g) * (1 - reinv) / (0.20 - q.g) if ebit36 > 0 else 0.0
    arr36 = o["cnpj"][-1] * q.sw[2036] * q.preco_mult * (1 + q.infl_p) ** 9 * 12   # preço de 2036 (não o de 2027)
    rec_cons36 = float(np.sum(o["rec"][idx36] - o["rec_sw"][idx36]))
    tv_mult = 2.5 * arr36 + 0.8 * rec_cons36
    tv = 0.0 if parado else min(tv_perp, tv_mult)
    caixa_final = 0.0 if parado else o["caixa"][-1]
    # empresa
    emp = o["fcf"].copy(); emp[0] -= q.capital
    vpl_emp = float(np.sum(emp * f_mid)) + tv * f_end[-1]
    emp_irr = emp.copy(); emp_irr[-1] += tv
    r_e, s_e = tir_mensal(emp_irr)
    # fundador
    renda = np.array([q.renda_atual * (1 + q.renda_g) ** max(0, cal(t)[0] - 2027) if (not parado or t <= q.stop_t) else 0.0 for t in range(T)])
    div_f = q.stake * o["div"]
    if parado:
        div_f[q.stop_t] = o["div"][q.stop_t]   # na liquidação o caixa volta a quem aportou
    # IRRF 10% sobre dividendos > R$ 50 mil no mês (Lei 15.270/2025, art. 6º-A da Lei 9.250)
    irrf = np.where(div_f > 50_000, 0.10 * div_f, 0.0)
    fund = -np.where(np.arange(T) == 0, q.capital, 0.0) + o["pl_f"] + div_f - renda
    if q.irrf_modo == "custo":
        fund = fund - irrf
    elif q.irrf_modo == "timing":
        fund = fund - irrf
        for t in range(T):
            if irrf[t] > 0:
                tr = t + 9   # restituição na DIRPF do ano seguinte (lotes de maio a setembro)
                if tr < T:
                    fund[tr] += irrf[t]
                else:
                    fund[-1] += irrf[t]
    vpl_fund = float(np.sum(fund * f_mid)) + q.stake * (tv + caixa_final) * f_end[-1]
    fund_irr = fund.copy(); fund_irr[-1] += q.stake * (tv + caixa_final)
    r_f, s_f = tir_mensal(fund_irr)
    cum = np.cumsum(fund); pb = next((t + 1 for t in range(1, T) if cum[t] >= 0), None)
    cumd = np.cumsum(fund * f_mid); pbd = next((t + 1 for t in range(1, T) if cumd[t] >= 0), None)
    cum_e = np.cumsum(emp); pb_e = next((t + 1 for t in range(1, T) if cum_e[t] >= 0), None)
    cumd_e = np.cumsum(emp * f_mid); pbd_e = next((t + 1 for t in range(1, T) if cumd_e[t] >= 0), None)
    caixa_antes = o["caixa"] + o["div"]
    serie = caixa_antes if not parado else caixa_antes[:q.stop_t]
    tmin = int(np.argmin(serie))
    be = next((t + 1 for t in range(2, T) if o["ebitda"][t] > 0 and o["ebitda"][t - 1] > 0 and o["ebitda"][t - 2] > 0), None)
    return dict(o=o, vpl_emp=vpl_emp, tir_emp=(1 + r_e) ** 12 - 1 if not math.isnan(r_e) else float("nan"), sinais_emp=s_e,
                vpl_fund=vpl_fund, tir_fund=(1 + r_f) ** 12 - 1 if not math.isnan(r_f) else float("nan"), sinais_fund=s_f,
                pb=pb, pbd=pbd, pb_e=pb_e, pbd_e=pbd_e, caixa_min=float(serie.min()), t_min=tmin, cap_nec=max(0.0, q.capital - float(serie.min())),
                be=be, tv=tv, tv_perp=tv_perp, tv_mult=tv_mult, irrf_total=float(np.sum(irrf)), f_mid=f_mid, f_end=f_end, fund=fund, emp=emp)


def cenario(nome: str, b: Prem) -> Prem:
    if nome == "fracasso":
        return replace(b, vol=0.5, software=False, stop_t=10)
    if nome == "pessimista":
        return replace(b, vol=0.8, preco_mult=0.9, sw_t0=b.sw_t0 + 6,
                       churn_ret={k: min(.04, v + .005) for k, v in b.churn_ret.items()},
                       churn_sw={k: min(.04, v + .005) for k, v in b.churn_sw.items()},
                       parc_mes={k: v * .6 for k, v in b.parc_mes.items()},
                       cnpj_parc={k: v * .8 for k, v in b.cnpj_parc.items()})
    if nome == "otimista":
        return replace(b, vol=1.35, preco_mult=1.1, max_parc=130,
                       churn_ret={k: max(0, v - .005) for k, v in b.churn_ret.items()},
                       churn_sw={k: max(0, v - .005) for k, v in b.churn_sw.items()},
                       parc_mes={k: v * 1.5 for k, v in b.parc_mes.items()})
    return b


PROB = {"fracasso": .35, "pessimista": .30, "base": .25, "otimista": .10}
REL = {  # números do relatório para comparação
    "base": dict(vpl_emp=1_241_844, tir_emp=1.03, vpl_fund=652_026, tir_fund=.564, pb=50, pbd=74, pb_e=32, pbd_e=40, caixa_min=77_074, be=4),
    "fracasso": dict(vpl_emp=-144_450, vpl_fund=-127_821, caixa_min=42_169),
    "pessimista": dict(vpl_emp=53_616, vpl_fund=-94_687, caixa_min=39_475, pb=86),
    "otimista": dict(vpl_emp=6_283_384, vpl_fund=3_952_816, caixa_min=60_031, pb=38, pbd=50),
}


def bloco_D():
    p("\n" + "=" * 100)
    p("D) Modelo mensal próprio (regras simplificadas; ver 'DIFERE' no código)")
    p("=" * 100)
    base = Prem()
    res = {n: avaliar(cenario(n, base)) for n in PROB}
    rb = res["base"]; o = rb["o"]
    p("Mensal (24 meses): mês | retainers | cnpjs | receita | fixo | EBITDA | caixa | analistas | horas/cap | alíq | FatorR(legal)")
    for t in range(24):
        p(f"  {t+1:>2} {lab(t):>6} | {o['ret'][t]:5.1f} | {o['cnpj'][t]:5.1f} | {br(o['rec'][t]):>8} | {br(o['fixo'][t]):>7} | {br(o['ebitda'][t]):>8} | "
          f"{br(o['caixa'][t]):>8} | {int(o['anal'][t])} | {o['horas'][t]:4.0f}/{o['cap'][t]:3.0f} | {o['aliq'][t]*100:4.1f}% | {o['fator_r'][t]:4.2f}")
    p("Anual: ano | receita | EBITDA | FCF | dividendos | caixa fim | retainers | cnpjs | headcount")
    anos = sorted(set(cal(t)[0] for t in range(T)))
    for y in anos:
        idx = [t for t in range(T) if cal(t)[0] == y]
        p(f"  {y} | {br(o['rec'][idx].sum()):>10} | {br(o['ebitda'][idx].sum()):>9} | {br(o['fcf'][idx].sum()):>9} | {br(o['div'][idx].sum()):>9} | "
          f"{br(o['caixa'][idx[-1]]):>8} | {o['ret'][idx[-1]]:5.1f} | {o['cnpj'][idx[-1]]:6.1f} | {int(o['anal'][idx[-1]]+o['dev'][idx[-1]]+o['cs'][idx[-1]]+o['ger'][idx[-1]])}")
    p(f"Valor terminal base: perpetuidade {br(rb['tv_perp'])} | múltiplo {br(rb['tv_mult'])} | usado {br(rb['tv'])} (relatório 2.685.679 / 5.441.214)")
    p("\nCenário | VPL emp (rel.) | TIR emp (rel.) | VPL fund (rel.) | TIR fund (rel.) | payback fund s/d (rel.) | caixa mín (rel.) | BE (rel.)")
    ev_e = ev_f = 0.0
    for n, r in res.items():
        R = REL.get(n, {})
        p(f"  {n:<10} | {br(r['vpl_emp']):>10} ({br(R.get('vpl_emp', float('nan')))}) | {r['tir_emp']*100:6.1f}% ({R.get('tir_emp', float('nan'))*100:.0f}%) | "
          f"{br(r['vpl_fund']):>10} ({br(R.get('vpl_fund', float('nan')))}) | {r['tir_fund']*100:6.1f}% ({R.get('tir_fund', float('nan'))*100:.1f}%) | "
          f"{r['pb']}/{r['pbd']} ({R.get('pb','-')}/{R.get('pbd','-')}) | {br(r['caixa_min'])} em {lab(r['t_min'])} ({br(R.get('caixa_min', float('nan')))}) | "
          f"{r['be']} ({R.get('be','-')}) | mudanças de sinal VPL: emp {r['sinais_emp']}, fund {r['sinais_fund']}")
        ev_e += PROB[n] * r["vpl_emp"]; ev_f += PROB[n] * r["vpl_fund"]
    p(f"Valor esperado ponderado: empresa {br(ev_e)} (relatório 904.327) | fundador {br(ev_f)} (relatório 485.145)")
    # IRRF
    for modo in ["timing", "custo"]:
        r = avaliar(replace(base, irrf_modo=modo))
        p(f"IRRF 10% s/ dividendos > 50 mil/mês, modo '{modo}': VPL fundador {br(r['vpl_fund'])} (Δ {br(r['vpl_fund']-rb['vpl_fund'])}); "
          f"retido nominal acumulado {br(r['irrf_total'])}; payback {r['pb']}/{r['pbd']}")
    # sensibilidade: horas do fundador reduzidas a 30 enquanto codifica sem dev (set/27 a out/28)
    r30 = avaliar(replace(base, cap_fund=30))
    p(f"Sensibilidade: fundador com 30 h faturáveis (em vez de 50) o tempo todo -> VPL fund {br(r30['vpl_fund'])}, VPL emp {br(r30['vpl_emp'])}, "
      f"caixa mín {br(r30['caixa_min'])} em {lab(r30['t_min'])}")
    return res


# ======================================================================================
# E) Re-desconto dos fluxos do modelo original com funções próprias
# ======================================================================================
def bloco_E():
    p("\n" + "=" * 100)
    p("E) Re-desconto dos fluxos do modelo ORIGINAL (modelo_financeiro_v1.py) com VPL/TIR próprios")
    p("=" * 100)
    sys.path.insert(0, HERE)
    try:
        import modelo_financeiro_v1 as mf  # type: ignore
    except Exception as e:  # pragma: no cover
        p("não foi possível importar modelo_financeiro_v1.py:", e)
        return
    base = mf.P()
    for nome in ["base", "pessimista", "otimista", "fracasso"]:
        pp = mf.scenario(nome, base)
        r = mf.evaluate(pp)
        taxa = pp.taxa_desconto_por_ano
        f_mid, f_end = fatores({y: taxa.get(y, 0.20) for y in range(2026, 2037)})
        tv = r["tv_base"]; caixa_final = r["caixa_final"]
        vpl_emp = float(np.sum(r["emp_flows"] * f_mid)) + tv * f_end[-1]
        vpl_fund = float(np.sum(r["fund_flows"] * f_mid)) + pp.stake_fundador * (tv + caixa_final) * f_end[-1]
        fe = r["emp_flows"].copy(); fe[-1] += tv
        ff = r["fund_flows"].copy(); ff[-1] += pp.stake_fundador * (tv + caixa_final)
        re_, se = tir_mensal(fe); rf_, sf = tir_mensal(ff)
        p(f"  {nome:<10}: VPL emp próprio {br(vpl_emp)} vs modelo {br(r['vpl_emp'])} | VPL fund próprio {br(vpl_fund)} vs {br(r['vpl_fund'])} | "
          f"TIR emp {((1+re_)**12-1)*100 if not math.isnan(re_) else float('nan'):6.1f}% vs {r['tir_emp']*100 if not math.isnan(r['tir_emp']) else float('nan'):6.1f}% "
          f"(mudanças de sinal: {se}) | TIR fund {((1+rf_)**12-1)*100 if not math.isnan(rf_) else float('nan'):6.1f}% vs {r['tir_fund']*100 if not math.isnan(r['tir_fund']) else float('nan'):6.1f}% ({sf})")
        if nome == "base":
            # checagem do fator de fim de 2036 citado no relatório (0,1126)
            p(f"  fator de desconto fim/2036 = {f_end[-1]:.4f} (relatório 0,1126); VP do valor terminal = {br(tv*f_end[-1])} (relatório 302.486)")
            # payback com fluxos do modelo
            cum = np.cumsum(r["fund_flows"]); pb = next((t + 1 for t in range(1, len(cum)) if cum[t] >= 0), None)
            cumd = np.cumsum(r["fund_flows"] * f_mid); pbd = next((t + 1 for t in range(1, len(cum)) if cumd[t] >= 0), None)
            p(f"  payback fundador recomputado: {pb} simples / {pbd} descontado (relatório 50 / 74)")
    return


# ======================================================================================
# F) Diagnósticos de auditoria sobre o modelo original
# ======================================================================================
def bloco_F():
    p("\n" + "=" * 100)
    p("F) Diagnósticos de auditoria sobre o modelo original (cenário-base)")
    p("=" * 100)
    sys.path.insert(0, HERE)
    import modelo_financeiro_v1 as mf  # type: ignore
    base = mf.P()
    r = mf.evaluate(base); o = r["out"]
    # F1 horas do fundador: entrega (até 50 h, mais o excesso não coberto) + vendas
    p("F1) Carga do fundador = horas de venda (reuniões + propostas + prospecção) + 50 h faturáveis + excesso de entrega não coberto:")
    for t in range(0, 36):
        excesso = max(0.0, o["horas_demanda"][t] - o["horas_capacidade"][t])
        carga = o["horas_vendas_fundador"][t] + min(50.0, o["horas_demanda"][t]) + excesso
        flag = " <-- acima de 160 h" if carga > 160 else ""
        if t % 3 == 0 or carga > 160:
            p(f"   {lab(t):>6}: vendas {o['horas_vendas_fundador'][t]:5.0f} h + entrega {min(50.0, o['horas_demanda'][t]):3.0f} h + excesso {excesso:3.0f} h = {carga:5.0f} h; "
              f"devs {int(o['devs'][t])}; software ativo desde set/27{flag}")
    p("   Nenhuma hora de desenvolvimento de produto está reservada ao fundador entre set/2027 (lançamento) e out/2028 (1º dev).")
    # F2 Fator R legal (12 meses anteriores) vs modelo (janela inclusiva)
    rec = o["receita_bruta"]; pl = o["pro_labore_fundador"] + o["pro_labore_socio"]
    clt = o["pessoal_analistas"] + o["pessoal_dev"] + o["pessoal_cs"] + o["pessoal_canal"]
    folha = pl + 0.9 * clt
    viol = []
    for t in range(1, len(rec)):
        f12 = folha[max(0, t - 12):t].sum(); r12 = rec[max(0, t - 12):t].sum()
        fr_legal = f12 / r12 if r12 > 0 else 1.0
        if (fr_legal >= 0.28) != (o["fator_r"][t] >= 0.28):
            viol.append((lab(t), fr_legal, o["fator_r"][t]))
    p(f"F2) Fator R legal (12 meses anteriores) muda o Anexo em {len(viol)} mês(es): {viol[:6]}")
    fr_min = min(o["fator_r"][t] for t in range(2, len(rec)))
    p(f"    Fator R mínimo do modelo de jan/27 em diante: {fr_min:.2f} (limite 0,28). Folga confortável; sem efeito material.")
    # F3 IRRF 10% sobre dividendos
    div_f = base.stake_fundador * o["dividendos"]; div_s = (1 - base.stake_fundador) * o["dividendos"]
    f_mid, f_end = r["f_mid"], r["f_end"]
    ret_f = np.where(div_f > 50_000, 0.10 * div_f, 0.0)
    ret_s = np.where(div_s > 50_000, 0.10 * div_s, 0.0)
    p(f"F3) Dividendos pagos de uma vez em dezembro: do fundador (70%) superam R$ 50 mil em {int(np.sum(div_f > 50_000))} anos "
      f"(de {', '.join(lab(t) for t in np.where(div_f > 50_000)[0])}); do sócio CRC em {int(np.sum(div_s > 50_000))} anos.")
    p(f"    Retenção nominal acumulada (fundador): {br(ret_f.sum())}; valor presente se fosse custo definitivo: {br(float(np.sum(ret_f * f_mid)))} "
      f"({float(np.sum(ret_f * f_mid))/r['vpl_fund']*100:.1f}% do VPL do fundador de {br(r['vpl_fund'])}).")
    devol = np.zeros(len(ret_f))
    for t in range(len(ret_f)):
        if ret_f[t] > 0:
            devol[min(t + 9, len(ret_f) - 1)] += ret_f[t]   # restituição 9 meses depois; fora do horizonte, no último mês
    custo_timing = float(np.sum(ret_f * f_mid)) - float(np.sum(devol * f_mid))
    p(f"    Se a retenção for restituída na DIRPF do ano seguinte (ajuste do IRPFM; renda anual do fundador fica abaixo de R$ 1,2 mi), "
      f"o custo é só de prazo: ~{br(custo_timing)} a valor presente ({custo_timing/r['vpl_fund']*100:.1f}% do VPL). "
      "Alternativa operacional: distribuir em parcelas mensais <= R$ 50 mil por sócio.")
    p("    O relatório (5.4) diz que os dividendos do fundador 'só passam de R$ 600 mil em 2032 e 2033': errado nos dois sentidos "
      f"(máximo anual {br(div_f.max())} em {lab(int(np.argmax(div_f)))}; e o teste legal é mensal, R$ 50 mil, não anual).")
    # F4 break-even econômico (com custo de oportunidade do fundador de R$ 10 mil)
    renda = r["renda"]
    eb_econ = o["ebitda"] - (renda - o["pro_labore_fundador"])
    be_econ = next((t + 1 for t in range(2, len(eb_econ)) if eb_econ[t] > 0 and eb_econ[t - 1] > 0 and eb_econ[t - 2] > 0), None)
    p(f"F4) Break-even de EBITDA contábil: mês {r['breakeven_t']+1} ({lab(r['breakeven_t'])}). Com o custo de oportunidade do fundador "
      f"(R$ 10 mil menos o pró-labore recebido) lançado como custo: mês {be_econ} ({lab(be_econ-1)}).")
    p(f"    Pró-labore do fundador nos meses 2 a 6: {', '.join(br(o['pro_labore_fundador'][t]) for t in range(1, 6))} (30% da receita). "
      "O 'break-even no mês 4' é um resultado do fundador quase não se pagar, não de a operação se sustentar.")
    # F5 TIR do pessimista: raízes múltiplas
    pp = mf.scenario("pessimista", base); rp = mf.evaluate(pp)
    fe = rp["emp_flows"].copy(); fe[-1] += rp["tv_base"]
    raiz, sinais = tir_mensal(fe)
    p(f"F5) Pessimista, fluxo da empresa: mudanças de sinal do VPL na grade = {sinais}; primeira raiz anualizada = "
      f"{((1+raiz)**12-1)*100 if not math.isnan(raiz) else float('nan'):.1f}% (CSV: −23,7%; relatório: 'indefinida'). "
      "Com mais de uma raiz, dizer 'indefinida' é defensável; o CSV deveria dizer o mesmo.")
    # F6 ARR do múltiplo de saída usa preço de 2027 (140) e não o de 2036 (165)
    tv = r["tv"]
    arr_corr = o["cnpjs"][-1] * base.preco_software_por_ano[2036] * (1 + base.inflacao_preco) ** 9 * 12
    p(f"F6) ARR 2036 no múltiplo de saída: modelo {br(tv['arr_2036'])} (preço R$ 140 de 2027); correto {br(arr_corr)} (preço R$ 165 em R$ de 2027). "
      "No base não muda nada (a perpetuidade é o menor valor); no otimista o múltiplo é o que vale e fica subestimado.")
    ro = mf.evaluate(mf.scenario("otimista", base))
    arr_o = ro["out"]["cnpjs"][-1] * base.preco_software_por_ano[2036] * 1.10 * (1 + base.inflacao_preco) ** 9 * 12
    tv_mult_o = base.mult_arr_software * arr_o + base.mult_receita_consultoria * ro["tv"]["rec_consultoria_2036"]
    tv_corr = min(ro["tv"]["tv_perpetuidade"], tv_mult_o)
    d_vpl_emp = (tv_corr - ro["tv_base"]) * ro["f_end"][-1]
    p(f"    Otimista: TV usado {br(ro['tv_base'])} -> corrigido {br(tv_corr)}; ΔVPL empresa +{br(d_vpl_emp)}; ΔVPL fundador +{br(0.7*d_vpl_emp)}; "
      f"Δ valor esperado (10%): +{br(0.1*d_vpl_emp)} (empresa) / +{br(0.07*d_vpl_emp)} (fundador).")
    # F7 utilização > 100% nos meses sem sócio
    for t in range(0, 12):
        if o["horas_demanda"][t] > o["horas_capacidade"][t] + 0.5:
            p(f"F7) {lab(t)}: demanda {o['horas_demanda'][t]:.0f} h > capacidade {o['horas_capacidade'][t]:.0f} h "
              f"(sócio CRC só entra em {lab(base.socio_crc_mes_inicio)}; o veredito exige o sócio antes do primeiro contrato).")


if __name__ == "__main__":
    bloco_A()
    bloco_B()
    bloco_C()
    bloco_D()
    bloco_E()
    bloco_F()
    with open(os.path.join(HERE, "revisao_recalculo_saida.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(OUT_LINES))
    p("\nSaída gravada em", os.path.join(HERE, "revisao_recalculo_saida.txt"))
