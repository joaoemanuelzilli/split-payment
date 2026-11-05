const MAPA = {
  verde: { rotulo: 'O caixa aguenta', cor: 'text-ok bg-[#E8F3EC]' },
  amarelo: { rotulo: 'Aguenta, com custo', cor: 'text-atencao bg-[#FBF0DC]' },
  vermelho: { rotulo: 'Falta caixa ou custa caro', cor: 'text-risco bg-[#FCECEA]' },
} as const;

export default function Semaforo({ veredito, pequeno = false }: { veredito: string; pequeno?: boolean }) {
  const m = MAPA[veredito as keyof typeof MAPA];
  if (!m) return <span className="whitespace-nowrap text-xs text-tinta-3">Sem teste de caixa</span>;
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded font-semibold ${m.cor} ${pequeno ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'}`}>
      <span aria-hidden className={`rounded-full bg-current ${pequeno ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
      {m.rotulo}
    </span>
  );
}
