import Link from 'next/link';
import { exigirUsuario } from '@/lib/auth';
import { categorias } from '@/lib/base';
import { pct } from '@/lib/format';
import Cabecalho from '@/components/Cabecalho';

export const metadata = { title: 'Nova simulação' };

export default async function EscolherSetor({ searchParams }: { searchParams: Promise<{ empresa?: string; p?: string }> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const so1 = sp.p === '1';
  const cats = categorias(n => !so1 || n.prioridade === 1);
  const q = sp.empresa ? `&empresa=${sp.empresa}` : '';
  return (
    <>
      <Cabecalho titulo="Nova simulação" descricao="Escolha o setor. O formulário abre com uma empresa típica preenchida."
        acoes={<Link href={`/app/simulador?${so1 ? '' : 'p=1'}${q}`} className="btn-secundario">{so1 ? 'Mostrar todos os setores' : 'Só prioridade 1'}</Link>} />
      <div className="grid gap-x-10 gap-y-8 px-4 py-6 md:grid-cols-2 md:px-8 xl:grid-cols-3">
        {cats.map(c => (
          <section key={c.codigo}>
            <h2 className="border-b border-tinta pb-1.5 text-sm font-bold">{c.nome}</h2>
            <ul className="divide-y divide-linha text-sm">
              {c.nichos.map(n => (
                <li key={n.id}>
                  <Link href={`/app/simulador/novo?nicho=${n.id}${q}`} className="flex justify-between gap-3 py-2 hover:text-marca">
                    <span>{n.nicho}{n.prioridade === 1 && <span className="ml-2 text-xs text-marca">P1</span>}</span>
                    <span className="tabular-nums text-tinta-3">{pct(n.resultado_exemplo.pct_um_mes_receita_2028.prudente)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
