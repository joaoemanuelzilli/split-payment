'use client';
import { useEffect, useState } from 'react';
import type { CampoEspecifico, ValorCampo } from '@/lib/types';
import { opcoesDe } from '@/lib/derive/core';

const fmtMoeda = (v: number) => (Number.isFinite(v) ? Math.round(v).toLocaleString('pt-BR') : '');

export function MoedaInput({ id, valor, onChange, min, max }: { id: string; valor: number; onChange: (v: number) => void; min?: number; max?: number }) {
  const [txt, setTxt] = useState(fmtMoeda(valor));
  useEffect(() => { setTxt(fmtMoeda(valor)); }, [valor]);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-tinta-3">R$</span>
      <input id={id} inputMode="numeric" className="campo pl-9 text-right tabular-nums" value={txt}
        onChange={e => {
          const dig = e.target.value.replace(/\D/g, '');
          setTxt(dig ? Number(dig).toLocaleString('pt-BR') : '');
          let n = dig ? Number(dig) : 0;
          if (max !== undefined) n = Math.min(n, max);
          if (min !== undefined) n = Math.max(n, min);
          onChange(n);
        }} />
    </div>
  );
}

export function NumeroInput({ id, valor, onChange, sufixo, min, max, passo = 1 }: { id: string; valor: number; onChange: (v: number) => void; sufixo?: string; min?: number; max?: number; passo?: number }) {
  const [txt, setTxt] = useState(String(valor).replace('.', ','));
  useEffect(() => { setTxt(String(valor).replace('.', ',')); }, [valor]);
  return (
    <div className="relative">
      <input id={id} inputMode="decimal" className={`campo text-right tabular-nums ${sufixo ? 'pr-14' : ''}`} value={txt} step={passo}
        onChange={e => {
          const t = e.target.value.replace(/[^\d,.-]/g, '');
          setTxt(t);
          const n = Number(t.replace(/\./g, '').replace(',', '.'));
          if (Number.isFinite(n)) onChange(n);
        }}
        onBlur={() => {
          let n = Number(txt.replace(/\./g, '').replace(',', '.'));
          if (!Number.isFinite(n)) n = valor;
          if (min !== undefined) n = Math.max(min, n);
          if (max !== undefined) n = Math.min(max, n);
          onChange(n);
          setTxt(String(n).replace('.', ','));
        }} />
      {sufixo && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-tinta-3">{sufixo}</span>}
    </div>
  );
}

const SUFIXO: Record<string, string> = { percentual: '%', dias: 'dias', meses: 'meses' };

export default function CampoInput({ campo, valor, onChange }: { campo: CampoEspecifico; valor: ValorCampo; onChange: (v: ValorCampo) => void }) {
  const id = `f-${campo.id}`;
  let controle: React.ReactNode;
  if (campo.tipo === 'selecao') {
    const ops = opcoesDe(campo);
    controle = (
      <select id={id} className="campo" value={String(valor)} onChange={e => {
        const o = ops.find(x => String(x.valor) === e.target.value);
        onChange(o ? o.valor : e.target.value);
      }}>
        {ops.map(o => <option key={String(o.valor)} value={String(o.valor)}>{o.rotulo}</option>)}
      </select>
    );
  } else if (campo.tipo === 'booleano') {
    controle = (
      <label className="flex cursor-pointer items-center gap-3 rounded border border-linha bg-white px-3 py-2 text-sm">
        <input id={id} type="checkbox" className="h-4 w-4 accent-[var(--marca)]" checked={valor === true} onChange={e => onChange(e.target.checked)} />
        {valor === true ? 'Sim' : 'Não'}
      </label>
    );
  } else if (campo.tipo === 'moeda') {
    controle = <MoedaInput id={id} valor={Number(valor)} onChange={onChange} min={campo.min} max={campo.max} />;
  } else {
    controle = <NumeroInput id={id} valor={Number(valor)} onChange={onChange} sufixo={campo.unidade || SUFIXO[campo.tipo]} min={campo.min} max={campo.max} passo={campo.tipo === 'percentual' ? 0.5 : 1} />;
  }
  return (
    <div>
      <label htmlFor={id} className="rotulo">{campo.rotulo}</label>
      {controle}
      {campo.ajuda && <p className="ajuda">{campo.ajuda}</p>}
    </div>
  );
}
