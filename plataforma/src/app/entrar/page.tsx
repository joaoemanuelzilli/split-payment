import { redirect } from 'next/navigation';
import { usuarioAtual } from '@/lib/auth';
import { getMarca } from '@/lib/dados';
import { Logo } from '@/components/Site';
import FormEntrar from './FormEntrar';

export const metadata = { title: 'Entrar' };

export default async function Entrar() {
  if (await usuarioAtual()) redirect('/app');
  const m = getMarca();
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <a href="/" className="text-tinta"><Logo nome={m.nome} logoUrl={m.logoUrl} /></a>
        <h1 className="mt-8 text-2xl font-bold">Entrar na área de trabalho</h1>
        <p className="mt-1 text-sm text-tinta-2">Consultores e escritórios parceiros</p>
        <FormEntrar />
      </div>
    </main>
  );
}
