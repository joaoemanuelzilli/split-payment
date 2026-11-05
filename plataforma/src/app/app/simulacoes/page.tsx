import Link from 'next/link';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { listarSimulacoes, simulacaoDesatualizada } from '@/lib/dados';
import { brl, dataHoraBR, pct } from '@/lib/format';
import Cabecalho from '@/components/Cabecalho';
import Semaforo from '@/components/Semaforo';

export const metadata = { title: 'Simulações' };

export default async function Simulacoes() {
  const u = await exigirUsuario();
  const sims = listarSimulacoes(u);
  return (
    <>
      <Cabecalho titulo="Simulações" descricao="Todas as simulações salvas, inclusive as que chegaram pela calculadora pública" acoes={<Link href="/app/simulador" className="btn-primario">Nova simulação</Link>} />
      <div className="px-5 py-6 md:px-8 xl:px-10">
        <div className="painel overflow-x-auto">
          {sims.length === 0 ? <p className="p-6 text-sm text-tinta-2">Nenhuma simulação salva ainda</p> : (
            <table className="tabela">
              <thead><tr><th>Simulação</th><th>Cliente</th><th className="num">Faixa no ano do teste</th><th className="num">2028, % de um mês</th><th>Caixa</th><th>Atualizada</th><th></th></tr></thead>
              <tbody>
                {sims.map(s => (
                  <tr key={s.id}>
                    <td><Link href={`/app/simulador/${s.id}`} className="font-medium hover:text-marca">{s.nome}</Link><span className="block text-xs text-tinta-3">{getNicho(s.nicho_id)?.nicho}</span></td>
                    <td>{s.empresa_id ? <Link href={`/app/empresas/${s.empresa_id}`} className="hover:text-marca">{s.empresa_nome}</Link> : <span className="text-tinta-3">rascunho</span>}</td>
                    <td className="num whitespace-nowrap">{s.resumo.modo === 'motor' ? `${brl(s.resumo.favoravelTeste)} a ${brl(s.resumo.necessidadeTeste)}` : 'Simples puro'}</td>
                    <td className="num whitespace-nowrap">{pct(s.resumo.pct2028.favoravel)} a {pct(s.resumo.pct2028.prudente)}</td>
                    <td><Semaforo veredito={s.resumo.semaforo} pequeno /></td>
                    <td className="whitespace-nowrap text-tinta-2">{dataHoraBR(s.atualizado_em + 'Z')}{simulacaoDesatualizada(s) && <span className="block text-xs text-atencao">premissas antigas</span>}</td>
                    <td><Link href={`/app/simulacoes/${s.id}/relatorio`} className="btn-texto text-xs">Relatório</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
