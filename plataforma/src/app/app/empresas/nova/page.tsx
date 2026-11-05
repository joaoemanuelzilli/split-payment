import { exigirUsuario } from '@/lib/auth';
import { db } from '@/lib/db';
import { listarParceiros } from '@/lib/dados';
import Cabecalho from '@/components/Cabecalho';
import FormEmpresa from '@/components/FormEmpresa';
import { criarEmpresaAcao } from '../../../acoes';

export const metadata = { title: 'Novo cliente' };

export default async function NovaEmpresa() {
  const u = await exigirUsuario();
  const admin = u.papel === 'admin';
  const usuarios = db().prepare("SELECT id, nome FROM usuarios WHERE papel != 'parceiro' AND ativo = 1 ORDER BY nome").all() as { id: number; nome: string }[];
  return (
    <>
      <Cabecalho titulo="Novo cliente" descricao="Com o setor preenchido, o roteiro da reunião e a lista de documentos entram na ficha automaticamente" />
      <div className="max-w-5xl px-5 py-6 md:px-8 xl:px-10">
        <div className="painel p-5"><FormEmpresa acao={criarEmpresaAcao} admin={admin} parceiros={admin ? listarParceiros() : undefined} usuarios={admin ? usuarios : undefined} rotuloBotao="Cadastrar cliente" /></div>
      </div>
    </>
  );
}
