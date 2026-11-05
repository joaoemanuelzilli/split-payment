import Link from 'next/link';
import { getMarca } from '@/lib/dados';

export function Logo({ nome, logoUrl }: { nome: string; logoUrl?: string }) {
  if (logoUrl) return <img src={logoUrl} alt={nome} className="h-8 w-auto" />;
  return (
    <span className="inline-flex items-center gap-2 font-bold tracking-tight">
      <svg width="26" height="18" viewBox="0 0 26 18" aria-hidden>
        <rect x="0" y="3" width="16" height="12" rx="2" fill="var(--marca)" />
        <rect x="18" y="0" width="8" height="8" rx="2" fill="#9A3B6B" />
        <rect x="18" y="10" width="8" height="8" rx="2" fill="var(--marca)" opacity=".35" />
      </svg>
      {nome}
    </span>
  );
}

export function CabecalhoSite({ parceiro }: { parceiro?: { nome: string; slug: string; logo_url: string | null } }) {
  const m = getMarca();
  const base = parceiro ? `/p/${parceiro.slug}` : '';
  return (
    <header className="border-b border-linha bg-papel-2">
      <div className="recipiente flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href={base || '/'} className="text-tinta">
          {parceiro ? (
            <span className="flex items-center gap-3">
              {parceiro.logo_url ? <img src={parceiro.logo_url} alt={parceiro.nome} className="h-8 w-auto" /> : <span className="font-bold">{parceiro.nome}</span>}
              <span className="text-xs text-tinta-3">com {m.nome}</span>
            </span>
          ) : <Logo nome={m.nome} logoUrl={m.logoUrl} />}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link className="rounded px-3 py-2 hover:bg-papel-3" href={`${base}/setores`}>Setores</Link>
          <Link className="rounded px-3 py-2 hover:bg-papel-3" href="/como-calculamos">Como calculamos</Link>
          {!parceiro && <Link className="hidden rounded px-3 py-2 hover:bg-papel-3 sm:inline" href="/contadores">Para contadores</Link>}
          {!parceiro && <Link className="rounded px-3 py-2 text-marca hover:bg-papel-3" href="/entrar">Entrar</Link>}
        </nav>
      </div>
    </header>
  );
}

export function RodapeSite() {
  const m = getMarca();
  return (
    <footer className="mt-16 border-t border-linha bg-papel-2">
      <div className="recipiente grid gap-8 py-10 text-sm text-tinta-2 md:grid-cols-[1fr_1fr_1.4fr]">
        <div>
          <Logo nome={m.nome} />
          <p className="mt-2 max-w-xs">{m.slogan}</p>
          <p className="text-tinta-3">{m.cidade}</p>
        </div>
        <div>
          <p className="font-semibold text-tinta">Contato</p>
          <p className="mt-1">{m.email}</p>
          <p>{m.telefone}</p>
        </div>
        <p className="max-w-xl text-xs leading-relaxed">
          Diagnóstico financeiro, não parecer jurídico ou contábil. As datas do split payment são previsão da Receita Federal, sem ato normativo publicado. Base de setores versão 1.1, de 04/11/2026
        </p>
      </div>
    </footer>
  );
}
