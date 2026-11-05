'use client';
import { useActionState } from 'react';
import { entrar } from '../acoes';

export default function FormEntrar() {
  const [estado, acao, pendente] = useActionState(entrar, null as { erro?: string } | null);
  return (
    <form action={acao} className="mt-6 space-y-4">
      <div><label className="rotulo" htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" className="campo" /></div>
      <div><label className="rotulo" htmlFor="senha">Senha</label><input id="senha" name="senha" type="password" required autoComplete="current-password" className="campo" /></div>
      {estado?.erro && <p role="alert" className="text-sm text-risco">{estado.erro}</p>}
      <button className="btn-primario w-full" disabled={pendente}>{pendente ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}
