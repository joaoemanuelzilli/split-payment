import { notFound } from 'next/navigation';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { getEmpresa, getSimulacao, listarEmpresas, podeVer } from '@/lib/dados';
import Cabecalho from '@/components/Cabecalho';
import Simulador from '@/components/Simulador';
import { excluirSimulacaoAcao, salvarSimulacaoAcao } from '../../../acoes';
import BotaoConfirmar from '@/components/BotaoConfirmar';

export const metadata = { title: 'Simulador' };

export default async function EditarSim({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const s = getSimulacao(Number((await params).id));
  if (!s) notFound();
  const emp = s.empresa_id ? getEmpresa(s.empresa_id) : undefined;
  if (emp && !podeVer(u, emp)) notFound();
  if (!emp && u.papel === 'parceiro' && s.criado_por !== u.id) notFound();
  const n = getNicho(s.nicho_id)!;
  const empresas = listarEmpresas(u).map(e => ({ id: e.id, nome: e.nome }));
  return (
    <>
      <Cabecalho titulo={s.nome} descricao={`${n.categoria}: ${n.nicho}${emp ? ` · cliente ${emp.nome}` : ''}`}
        acoes={<form action={excluirSimulacaoAcao}><input type="hidden" name="id" value={s.id} /><BotaoConfirmar pergunta="Excluir esta simulação?" className="btn-secundario text-risco">Excluir</BotaoConfirmar></form>} />
      <div className="px-5 py-6 md:px-8 xl:px-10">
        <Simulador key={s.atualizado_em} nicho={n} inicial={{ valores: s.valores, caixa: s.caixa, parametros: s.parametros }} modo="consultor"
          simulacaoId={s.id} nomeInicial={s.nome} empresaId={s.empresa_id} empresas={empresas} salvar={salvarSimulacaoAcao} />
      </div>
    </>
  );
}
