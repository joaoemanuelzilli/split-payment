import { exigirUsuario } from '@/lib/auth';
import Cabecalho from '@/components/Cabecalho';
import { trocarSenhaAcao } from '../../acoes';

export const metadata = { title: 'Minha conta' };

export default async function Conta({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  const u = await exigirUsuario();
  const sp = await searchParams;
  return (
    <>
      <Cabecalho titulo="Minha conta" descricao={`${u.nome}, ${u.email}`} />
      <div className="max-w-md px-4 py-6 md:px-8">
        {sp.ok && <p role="status" className="mb-4 text-sm text-ok">Senha trocada.</p>}
        {sp.erro && <p role="alert" className="mb-4 text-sm text-risco">A senha atual não confere ou a nova tem menos de 8 caracteres.</p>}
        <form action={trocarSenhaAcao} className="painel space-y-4 p-5">
          <div><label className="rotulo" htmlFor="atual">Senha atual</label><input id="atual" name="atual" type="password" required autoComplete="current-password" className="campo" /></div>
          <div><label className="rotulo" htmlFor="nova">Nova senha</label><input id="nova" name="nova" type="password" minLength={8} required autoComplete="new-password" className="campo" /></div>
          <button className="btn-primario">Trocar senha</button>
        </form>
      </div>
    </>
  );
}
