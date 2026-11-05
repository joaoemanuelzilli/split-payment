import Link from 'next/link';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { ETAPAS, getParametros, listarEmpresas, listarSimulacoes, painel, simulacaoDesatualizada } from '@/lib/dados';
import { brl, dataBR } from '@/lib/format';
import { parametrosBase } from '@/lib/base';
import Cabecalho from '@/components/Cabecalho';
import Semaforo from '@/components/Semaforo';

const ACOMPANHAR = [
  { quando: '10/11/2026', oque: 'Audiência na CAE do Senado sobre a alíquota da CBS', efeito: 'Nada muda ainda.' },
  { quando: 'Até 15/12/2026', oque: 'Senado fixa a CBS de 2027. Sem resolução, vale 11,35% do TCU', efeito: 'Atualizar a CBS de referência em Configurações e recalcular as simulações.' },
  { quando: 'Sem data', oque: 'MP do Imposto Seletivo e conversão em lei até 31/12/2026', efeito: 'Afeta os setores com Imposto Seletivo; não entra no cálculo do caixa.' },
  { quando: 'Sem data', oque: 'Regra de compensação do crédito: em 48 horas ou só na apuração', efeito: 'Define qual cenário vira o principal. Hoje os dois aparecem.' },
  { quando: 'Sem data', oque: 'Ato conjunto com os percentuais do crédito presumido de 2027', efeito: 'Muda 19 linhas de compra em 16 setores (agro e alimentos).' },
  { quando: '2º semestre de 2027', oque: 'Split facultativo, previsto', efeito: 'Ajustar a adesão de 2027 em Configurações.' },
];

export default async function Painel() {
  const u = await exigirUsuario();
  const p = painel(u);
  const empresas = listarEmpresas(u).slice(0, 8);
  const sims = listarSimulacoes(u);
  const atuais = getParametros();
  const desatualizadas = sims.filter(s => simulacaoDesatualizada(s, atuais)).length;
  const mudouBase = JSON.stringify(atuais) !== JSON.stringify(parametrosBase());
  const cont = (id: string) => p.porEtapa.find(x => x.etapa === id)?.n ?? 0;

  return (
    <>
      <Cabecalho titulo={`Olá, ${u.nome.split(' ')[0]}`} descricao="O funil de clientes, os contatos que chegaram pela calculadora e as datas que mudam os números."
        acoes={<><Link href="/app/empresas/nova" className="btn-secundario">Novo cliente</Link><Link href="/app/simulador" className="btn-primario">Nova simulação</Link></>} />
      <div className="space-y-8 px-4 py-6 md:px-8">
        {desatualizadas > 0 && (
          <p className="rounded border-l-4 border-atencao bg-[#FBF3E6] px-4 py-3 text-sm">
            {desatualizadas} {desatualizadas === 1 ? 'simulação usa' : 'simulações usam'} premissas diferentes das atuais.{' '}
            {u.papel === 'admin' ? <Link href="/app/configuracoes#parametros" className="font-semibold underline">Recalcular em Configurações</Link> : 'Peça ao administrador para recalcular.'}
          </p>
        )}

        <section>
          <h2 className="h3">Funil</h2>
          <ol className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-linha bg-linha sm:grid-cols-4 lg:grid-cols-7">
            {ETAPAS.map(e => (
              <li key={e.id} className="bg-white">
                <Link href={`/app/empresas?etapa=${e.id}`} className="block p-3 hover:bg-papel">
                  <span className="block text-2xl font-bold tabular-nums">{cont(e.id)}</span>
                  <span className="text-xs text-tinta-2">{e.nome}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="ajuda mt-2">Nos últimos 30 dias: {p.novos30} clientes novos, {p.doSite} deles pela calculadora do site ou de parceiros.</p>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="painel overflow-hidden">
            <div className="flex items-center justify-between border-b border-linha px-4 py-3">
              <h2 className="h3">Clientes com movimento recente</h2>
              <Link href="/app/empresas" className="btn-texto text-xs">Ver todos</Link>
            </div>
            {empresas.length === 0 ? (
              <p className="p-6 text-sm text-tinta-2">Nenhum cliente ainda. Cadastre o primeiro ou divulgue a calculadora: cada contato que pedir o diagnóstico completo aparece aqui.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="tabela">
                  <thead><tr><th>Empresa</th><th>Setor</th><th className="num">Necessidade</th><th>Caixa</th><th>Etapa</th></tr></thead>
                  <tbody>
                    {empresas.map(e => (
                      <tr key={e.id}>
                        <td><Link href={`/app/empresas/${e.id}`} className="font-medium hover:text-marca">{e.nome}</Link><span className="block text-xs text-tinta-3">{e.origem === 'site' ? 'Calculadora do site' : e.origem === 'parceiro' ? `Parceiro ${e.parceiro_nome ?? ''}` : 'Cadastro manual'} · {dataBR(e.atualizado_em + 'Z')}</span></td>
                        <td className="text-tinta-2">{e.nicho_id ? getNicho(e.nicho_id)?.nicho : '—'}</td>
                        <td className="num">{e.ultima_necessidade != null ? brl(e.ultima_necessidade) : '—'}</td>
                        <td>{e.semaforo && e.semaforo !== 'n/a' ? <Semaforo veredito={e.semaforo} pequeno /> : <span className="text-xs text-tinta-3">sem simulação</span>}</td>
                        <td className="text-tinta-2">{ETAPAS.find(x => x.id === e.etapa)?.nome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="painel p-4">
            <h2 className="h3">O que acompanhar</h2>
            <p className="ajuda">Normas que mudam o número. {mudouBase ? 'As premissas atuais já diferem das da base de 04/11/2026.' : 'As premissas atuais são as da base de 04/11/2026.'}</p>
            <ol className="mt-3 divide-y divide-linha">
              {ACOMPANHAR.map(a => (
                <li key={a.oque} className="py-3">
                  <p className="text-xs font-semibold text-marca">{a.quando}</p>
                  <p className="text-sm font-medium">{a.oque}</p>
                  <p className="text-xs text-tinta-2">{a.efeito}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}
