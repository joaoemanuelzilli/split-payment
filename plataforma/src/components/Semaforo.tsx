const MAPA = {
  verde: { rotulo: 'O caixa aguenta', cor: 'text-ok border-ok bg-[#E8F3EC]', icone: '✓' },
  amarelo: { rotulo: 'Aguenta, com custo', cor: 'text-atencao border-atencao bg-[#FBF3E6]', icone: '!' },
  vermelho: { rotulo: 'Falta caixa ou custa caro', cor: 'text-risco border-risco bg-[#FCECEA]', icone: '×' },
} as const;

export default function Semaforo({ veredito, pequeno = false }: { veredito: string; pequeno?: boolean }) {
  const m = MAPA[veredito as keyof typeof MAPA];
  if (!m) return <span className="rounded border border-linha px-2 py-1 text-xs text-tinta-2">Sem teste de caixa</span>;
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap gap-2 rounded-full border font-semibold ${m.cor} ${pequeno ? 'px-2.5 py-0.5 text-xs' : 'px-4 py-1.5 text-sm'}`}>
      <span aria-hidden className={`grid place-items-center rounded-full bg-current ${pequeno ? 'h-4 w-4 text-[10px]' : 'h-5 w-5 text-xs'}`}>
        <span className="text-white">{m.icone}</span>
      </span>
      {m.rotulo}
    </span>
  );
}
