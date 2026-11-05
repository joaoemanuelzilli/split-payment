'use client';
import { useState } from 'react';
import { brl, brlCurto } from '@/lib/format';

export interface PontoAno { ano: number; favoravel: number; prudente: number }

/** Barras agrupadas por ano: favorável (azul) e prudente (laranja). Um eixo, linhas de grade discretas, dica ao passar o mouse. */
export default function GraficoAnos({ dados, altura = 260, titulo }: { dados: PontoAno[]; altura?: number; titulo: string }) {
  const [foco, setFoco] = useState<number | null>(null);
  const L = 720, pad = { e: 64, d: 12, t: 16, b: 34 };
  const w = L - pad.e - pad.d, h = altura - pad.t - pad.b;
  const max = Math.max(1, ...dados.flatMap(d => [d.favoravel, d.prudente]));
  const passo = escala(max);
  const topo = Math.ceil(max / passo) * passo;
  const y = (v: number) => pad.t + h - (h * v) / topo;
  const grupo = w / dados.length;
  const larg = Math.min(26, grupo * 0.3);
  const ticks: number[] = [];
  for (let v = 0; v <= topo + 1e-6; v += passo) ticks.push(v);

  return (
    <figure className="w-full">
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="h3">{titulo}</span>
        <span className="flex gap-4 text-xs text-tinta-2">
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-fav" />Favorável</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-prud" />Prudente</span>
        </span>
      </figcaption>
      <div className="relative">
        <svg viewBox={`0 0 ${L} ${altura}`} className="h-auto w-full" role="img" aria-label={titulo} onMouseLeave={() => setFoco(null)}>
          {ticks.map(t => (
            <g key={t}>
              <line x1={pad.e} x2={L - pad.d} y1={y(t)} y2={y(t)} stroke="#E3E9E7" strokeWidth={1} />
              <text x={pad.e - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#6E8183">{brlCurto(t)}</text>
            </g>
          ))}
          {dados.map((d, i) => {
            const cx = pad.e + grupo * i + grupo / 2;
            const ativo = foco === i;
            return (
              <g key={d.ano} onMouseEnter={() => setFoco(i)} onFocus={() => setFoco(i)} tabIndex={0} aria-label={`${d.ano}: favorável ${brl(d.favoravel)}, prudente ${brl(d.prudente)}`}>
                <rect x={pad.e + grupo * i} y={pad.t} width={grupo} height={h} fill={ativo ? '#EEF3F2' : 'transparent'} />
                <Barra x={cx - larg - 1} y={y(d.favoravel)} w={larg} h={pad.t + h - y(d.favoravel)} cor="#2a78d6" />
                <Barra x={cx + 1} y={y(d.prudente)} w={larg} h={pad.t + h - y(d.prudente)} cor="#eb6834" />
                <text x={cx} y={altura - 12} textAnchor="middle" fontSize={12} fill="#43585A" fontWeight={ativo ? 700 : 400}>{d.ano}</text>
              </g>
            );
          })}
          <line x1={pad.e} x2={L - pad.d} y1={pad.t + h} y2={pad.t + h} stroke="#B9C6C3" strokeWidth={1} />
        </svg>
        {foco !== null && (
          <div className="pointer-events-none absolute top-2 rounded border border-linha bg-white px-3 py-2 text-xs shadow-sm"
            style={{ left: `${Math.min(70, ((pad.e + grupo * foco + grupo) / L) * 100)}%` }}>
            <div className="mb-1 font-semibold">{dados[foco].ano}</div>
            <div className="flex justify-between gap-4"><span className="text-tinta-2">Favorável</span><span className="tabular-nums">{brl(dados[foco].favoravel)}</span></div>
            <div className="flex justify-between gap-4"><span className="text-tinta-2">Prudente</span><span className="tabular-nums">{brl(dados[foco].prudente)}</span></div>
          </div>
        )}
      </div>
    </figure>
  );
}

function Barra({ x, y, w, h, cor }: { x: number; y: number; w: number; h: number; cor: string }) {
  if (h <= 0.5) return null;
  const r = Math.min(4, h / 2, w / 2);
  // topo arredondado, base reta apoiada no eixo
  const d = `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
  return <path d={d} fill={cor} />;
}

function escala(max: number) {
  const bruto = max / 4;
  const p = Math.pow(10, Math.floor(Math.log10(bruto)));
  const n = bruto / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
