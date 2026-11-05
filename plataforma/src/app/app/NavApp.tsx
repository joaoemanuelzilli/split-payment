'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavApp({ itens }: { itens: { href: string; rotulo: string }[] }) {
  const atual = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:flex-col md:overflow-visible">
      {itens.map(i => {
        const ativo = i.href === '/app' ? atual === '/app' : atual.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={ativo ? 'page' : undefined}
            className={`whitespace-nowrap rounded px-3 py-2 ${ativo ? 'bg-marca-claro font-semibold text-tinta' : 'text-tinta-2 hover:bg-papel-3'}`}>
            {i.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
