import Link from 'next/link';
import { exigirUsuario } from '@/lib/auth';
import { getMarca, getParceiro } from '@/lib/dados';
import { Logo } from '@/components/Site';
import { sair } from '../acoes';
import NavApp from './NavApp';

export const metadata = { robots: { index: false } };

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const u = await exigirUsuario();
  const m = getMarca();
  const parceiro = u.parceiro_id ? getParceiro(u.parceiro_id) : undefined;
  const itens = [
    { href: '/app', rotulo: 'Painel' },
    { href: '/app/empresas', rotulo: 'Clientes' },
    { href: '/app/simulador', rotulo: 'Nova simulação' },
    { href: '/app/simulacoes', rotulo: 'Simulações' },
    { href: '/app/setores', rotulo: 'Setores e teses' },
    ...(u.papel === 'admin' ? [{ href: '/app/parceiros', rotulo: 'Parceiros' }, { href: '/app/configuracoes', rotulo: 'Configurações' }] : []),
  ];
  const estilo = parceiro?.cor ? ({ ['--marca' as string]: parceiro.cor } as React.CSSProperties) : undefined;
  return (
    <div className="min-h-screen md:grid md:grid-cols-[232px_1fr]" style={estilo}>
      <aside className="nao-imprimir border-b border-linha bg-papel-2 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <Link href="/app" className="text-tinta">{parceiro ? <span className="font-bold">{parceiro.nome}</span> : <Logo nome={m.nome} logoUrl={m.logoUrl} />}</Link>
          <p className="hidden text-xs text-tinta-3 md:mt-1 md:block">{u.nome} · {u.papel === 'admin' ? 'Administrador' : u.papel === 'consultor' ? 'Consultor' : 'Escritório parceiro'}</p>
        </div>
        <NavApp itens={itens} />
        <div className="hidden space-y-1 px-3 pb-4 text-sm md:absolute md:bottom-0 md:block md:w-[231px]">
          {parceiro && <a className="block rounded px-3 py-2 text-marca hover:bg-papel-3" href={`/p/${parceiro.slug}`} target="_blank" rel="noreferrer">Minha página pública</a>}
          <Link className="block rounded px-3 py-2 hover:bg-papel-3" href="/app/conta">Minha conta</Link>
          <form action={sair}><button className="w-full rounded px-3 py-2 text-left hover:bg-papel-3">Sair</button></form>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
