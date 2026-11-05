'use client';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Nicho, ParametrosGlobais, ValorCampo } from '@/lib/types';
import { calcular, type Caixa } from '@/lib/calc';
import type { Valores } from '@/lib/derive/core';
import CampoInput, { MoedaInput, NumeroInput } from './CampoInput';
import Resultado, { AvisosObrigatorios, Manchete, TesteCaixaPainel } from './Resultado';
import Semaforo from './Semaforo';
import { brl, pct } from '@/lib/format';

export interface DadosSimulacao { valores: Valores; caixa: Caixa; parametros: ParametrosGlobais }
export type SalvarFn = (d: DadosSimulacao & { id?: number; nicho_id: string; nome: string; empresa_id: number | null }) => Promise<{ ok: boolean; id?: number; erro?: string }>;
export type CapturarFn = (d: DadosSimulacao & { nicho_id: string; contato: Record<string, string>; parceiro?: string }) => Promise<{ ok: boolean; token?: string; erro?: string }>;

interface Props {
  nicho: Nicho;
  inicial: DadosSimulacao;
  modo: 'publico' | 'consultor';
  simulacaoId?: number;
  nomeInicial?: string;
  empresaId?: number | null;
  empresas?: { id: number; nome: string }[];
  salvar?: SalvarFn;
  capturar?: CapturarFn;
  exigirCadastro?: boolean;
  parceiro?: string;
}

const CAIXA_CAMPOS: { id: keyof Caixa; rotulo: string; ajuda: string; tipo: 'moeda' | 'pct' }[] = [
  { id: 'caixa', rotulo: 'Caixa hoje', ajuda: 'Saldo em conta e aplicações de liquidez imediata.', tipo: 'moeda' },
  { id: 'caixa_minimo', rotulo: 'Caixa mínimo de segurança', ajuda: 'Abaixo disso a empresa não aceita ficar.', tipo: 'moeda' },
  { id: 'limites', rotulo: 'Limites de crédito aprovados e não usados', ajuda: 'Conta garantida, capital de giro pré-aprovado. Sem antecipação de recebíveis.', tipo: 'moeda' },
  { id: 'custo_credito_pct_am', rotulo: 'Custo do crédito', ajuda: 'Taxa mensal média das linhas de capital de giro.', tipo: 'pct' },
  { id: 'geracao_caixa_mes', rotulo: 'Geração de caixa por mês', ajuda: 'Quanto sobra do operacional, em média, por mês.', tipo: 'moeda' },
];

export default function Simulador(p: Props) {
  const [valores, setValores] = useState<Valores>(p.inicial.valores);
  const [caixa, setCaixa] = useState<Caixa>(p.inicial.caixa);
  const [par, setPar] = useState<ParametrosGlobais>(p.inicial.parametros);
  const [nome, setNome] = useState(p.nomeInicial ?? `Diagnóstico ${p.nicho.nicho}`);
  const [empresaId, setEmpresaId] = useState<number | null>(p.empresaId ?? null);
  const [simId, setSimId] = useState<number | undefined>(p.simulacaoId);
  const [msg, setMsg] = useState<string | null>(null);
  const [pendente, start] = useTransition();
  const router = useRouter();

  const r = useMemo(() => calcular(p.nicho, { valores, caixa, parametros: par }), [p.nicho, valores, caixa, par]);
  const set = (id: string, v: ValorCampo) => setValores(x => ({ ...x, [id]: v }));
  const consultor = p.modo === 'consultor';
  const bloqueado = p.modo === 'publico' && p.exigirCadastro !== false;

  function restaurar() {
    const v: Valores = {};
    for (const f of p.nicho.campos_especificos) v[f.id] = f.padrao;
    setValores(v);
    setCaixa({ ...p.nicho.caixa_exemplo });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <fieldset className="painel space-y-4 p-4 md:p-5">
          <legend className="sr-only">Dados do negócio</legend>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="h3">Como a empresa vende e compra</h2>
            <button type="button" className="btn-texto text-xs" onClick={restaurar}>Voltar ao exemplo</button>
          </div>
          <p className="ajuda -mt-2">Os campos vêm preenchidos com uma empresa típica do setor. Troque pelos números reais.</p>
          {p.nicho.campos_especificos.map(f => <CampoInput key={f.id} campo={f} valor={valores[f.id]} onChange={v => set(f.id, v)} />)}
        </fieldset>

        <fieldset className="painel space-y-4 p-4 md:p-5">
          <h2 className="h3">Teste de caixa</h2>
          <p className="ajuda -mt-2">Para saber se o caixa de hoje cobre a necessidade e quanto custa.</p>
          {CAIXA_CAMPOS.map(c => (
            <div key={c.id}>
              <label htmlFor={`cx-${c.id}`} className="rotulo">{c.rotulo}</label>
              {c.tipo === 'moeda'
                ? <MoedaInput id={`cx-${c.id}`} valor={caixa[c.id]} onChange={v => setCaixa(x => ({ ...x, [c.id]: v }))} min={0} />
                : <NumeroInput id={`cx-${c.id}`} valor={caixa[c.id]} sufixo="% a.m." min={0} max={20} passo={0.1} onChange={v => setCaixa(x => ({ ...x, [c.id]: v }))} />}
              <p className="ajuda">{c.ajuda}</p>
            </div>
          ))}
        </fieldset>

        <details className="painel p-4 md:p-5" open={consultor}>
          <summary className="h3 cursor-pointer">Premissas da reforma</summary>
          <p className="ajuda mt-1">Valores de 04/11/2026. Mude quando sair uma norma nova ou para testar cenários.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <ParNum id="cbs_referencia_pct" rotulo="CBS de referência" sufixo="%" par={par} setPar={setPar} max={20} passo={0.05} />
            <ParNum id="ibs_cheio_pct" rotulo="IBS cheio (2033)" sufixo="%" par={par} setPar={setPar} max={30} passo={0.1} />
            <ParNum id="adesao_2027_pct" rotulo="Adesão ao split em 2027" sufixo="%" par={par} setPar={setPar} max={100} />
            <ParNum id="adesao_2028_em_diante_pct" rotulo="Adesão a partir de 2028" sufixo="%" par={par} setPar={setPar} max={100} />
            <ParNum id="cdi_pct_aa" rotulo="CDI" sufixo="% a.a." par={par} setPar={setPar} max={40} passo={0.05} />
            <div>
              <label className="rotulo" htmlFor="p-ress">Prazo extra do ressarcimento</label>
              <select id="p-ress" className="campo" value={par.ressarcimento_dias_extra} onChange={e => setPar({ ...par, ressarcimento_dias_extra: Number(e.target.value) })}>
                <option value={45}>45 dias (programa de conformidade)</option>
                <option value={75}>75 dias (pedido no art. 40)</option>
                <option value={165}>165 dias (demais casos)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="rotulo" htmlFor="p-ano">Ano do teste de caixa</label>
              <select id="p-ano" className="campo" value={par.ano_teste} onChange={e => setPar({ ...par, ano_teste: Number(e.target.value) })}>
                {[2027, 2028, 2029, 2030, 2031, 2032, 2033].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </details>

        {consultor && p.salvar && (
          <div className="painel space-y-3 p-4 md:p-5">
            <h2 className="h3">Salvar</h2>
            <div>
              <label htmlFor="s-nome" className="rotulo">Nome da simulação</label>
              <input id="s-nome" className="campo" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div>
              <label htmlFor="s-emp" className="rotulo">Cliente</label>
              <select id="s-emp" className="campo" value={empresaId ?? ''} onChange={e => setEmpresaId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">Sem cliente (rascunho)</option>
                {(p.empresas ?? []).map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primario" disabled={pendente} onClick={() => start(async () => {
                const res = await p.salvar!({ id: simId, nicho_id: p.nicho.id, nome, empresa_id: empresaId, valores, caixa, parametros: par });
                if (res.ok && res.id) { setSimId(res.id); setMsg('Simulação salva.'); router.replace(`/app/simulador/${res.id}`); router.refresh(); }
                else setMsg(res.erro ?? 'Não foi possível salvar.');
              })}>{simId ? 'Salvar alterações' : 'Salvar simulação'}</button>
              {simId && <a className="btn-secundario" href={`/app/simulacoes/${simId}/relatorio`} target="_blank" rel="noreferrer">Abrir relatório em PDF</a>}
            </div>
            {msg && <p role="status" className="text-sm text-tinta-2">{msg}</p>}
          </div>
        )}
      </form>

      <section aria-live="polite" className="min-w-0 space-y-6">
        {r.derivacao.modo === 'motor' ? <div className="painel p-4 md:p-6"><Manchete r={r} /></div> : null}
        {bloqueado ? <ResultadoPublico r={r} p={p} dados={{ valores, caixa, parametros: par }} /> : <Resultado r={r} nicho={p.nicho} />}
        <AvisosObrigatorios nicho={p.nicho} />
      </section>
    </div>
  );
}

function ParNum({ id, rotulo, sufixo, par, setPar, max, passo = 1 }: { id: keyof ParametrosGlobais; rotulo: string; sufixo: string; par: ParametrosGlobais; setPar: (p: ParametrosGlobais) => void; max: number; passo?: number }) {
  return (
    <div>
      <label htmlFor={`p-${id}`} className="rotulo">{rotulo}</label>
      <NumeroInput id={`p-${id}`} valor={par[id] as number} sufixo={sufixo} min={0} max={max} passo={passo} onChange={v => setPar({ ...par, [id]: v })} />
    </div>
  );
}

/** Versão pública: mostra a faixa e o semáforo; o detalhe e o PDF vêm depois do cadastro. */
function ResultadoPublico({ r, p, dados }: { r: ReturnType<typeof calcular>; p: Props; dados: DadosSimulacao }) {
  const [pendente, start] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();
  const t = r.teste;
  return (
    <>
      {r.derivacao.modo === 'motor' ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="painel p-4 md:p-6">
            <h3 className="h3">Ano a ano, cenário prudente</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {r.anos.map(a => (
                <li key={a.ano} className="flex items-center gap-3">
                  <span className="w-10 font-semibold">{a.ano}</span>
                  <span className="h-2 flex-1 rounded bg-papel-3"><span className="block h-2 rounded bg-prud" style={{ width: `${(100 * a.prudente) / Math.max(1, r.anos[6].prudente)}%` }} /></span>
                  <span className="w-16 text-right tabular-nums text-tinta-2">{pct(r.pctMes(a.ano, 'prudente'))}</span>
                </li>
              ))}
            </ul>
            <p className="ajuda mt-3">Em % de um mês de faturamento. O salto de 2033 vem do IBS cheio.</p>
          </div>
          <TesteCaixaPainel r={r} />
        </div>
      ) : (
        <div className="painel p-4 md:p-6">
          <h3 className="h3">No Simples puro, o split quase não mexe no caixa</h3>
          <p className="mt-2 text-sm">{r.derivacao.textoModo}</p>
          <p className="mt-2 text-sm">A pergunta é outra: continuar no Simples puro ou recolher IBS e CBS por fora para não perder clientes PJ. O diagnóstico completo mostra a conta dos dois lados.</p>
        </div>
      )}
      {r.derivacao.mensagens.filter(m => m.nivel === 'alerta').map((m, i) => (
        <p key={i} className="rounded border-l-4 border-atencao bg-[#FBF3E6] px-3 py-2 text-sm">{m.texto}</p>
      ))}
      <form className="painel space-y-4 border-marca p-4 md:p-6" onSubmit={e => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const contato = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
        start(async () => {
          setErro(null);
          const res = await p.capturar!({ ...dados, nicho_id: p.nicho.id, contato, parceiro: p.parceiro });
          if (res.ok && res.token) router.push(`/relatorio/${res.token}`);
          else setErro(res.erro ?? 'Não foi possível enviar. Confira os campos.');
        });
      }}>
        <div>
          <h3 className="h2">Receba o diagnóstico completo</h3>
          <p className="mt-1 text-sm text-tinta-2">De onde vem cada real, o teste de caixa ano a ano e o relatório em PDF para levar aos sócios.{t.verdict === 'vermelho' ? ' No seu caso o semáforo está vermelho: vale conversar antes de 2027.' : ''}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Entrada nome="nome" rotulo="Seu nome" obrigatorio autoComplete="name" />
          <Entrada nome="empresa" rotulo="Empresa" obrigatorio autoComplete="organization" />
          <Entrada nome="email" rotulo="E-mail" tipo="email" obrigatorio autoComplete="email" />
          <Entrada nome="telefone" rotulo="WhatsApp" tipo="tel" obrigatorio autoComplete="tel" />
          <Entrada nome="cnpj" rotulo="CNPJ (opcional)" />
          <Entrada nome="cidade" rotulo="Cidade e UF (opcional)" />
        </div>
        <label className="flex items-start gap-2 text-xs text-tinta-2">
          <input type="checkbox" name="consentimento" required className="mt-0.5 h-4 w-4 accent-[var(--marca)]" />
          Autorizo o uso destes dados para receber o diagnóstico e ser contatado sobre ele. Os números da simulação ficam guardados para a conversa.
        </label>
        {erro && <p role="alert" className="text-sm text-risco">{erro}</p>}
        <button className="btn-primario w-full sm:w-auto" disabled={pendente}>{pendente ? 'Gerando…' : 'Ver o diagnóstico completo'}</button>
      </form>
      <p className="text-center text-xs text-tinta-3">Prévia: necessidade prudente em {t.ano} de {brl(t.need)}. <Semaforo veredito={t.verdict} pequeno /></p>
    </>
  );
}

function Entrada({ nome, rotulo, tipo = 'text', obrigatorio, autoComplete }: { nome: string; rotulo: string; tipo?: string; obrigatorio?: boolean; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={`c-${nome}`} className="rotulo">{rotulo}</label>
      <input id={`c-${nome}`} name={nome} type={tipo} required={obrigatorio} autoComplete={autoComplete} className="campo" />
    </div>
  );
}
