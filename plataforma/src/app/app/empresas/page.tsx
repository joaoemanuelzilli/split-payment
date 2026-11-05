import Link from 'next/link';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { ETAPAS, listarEmpresas } from '@/lib/dados';
import { brl, dataBR } from '@/lib/format';
import Cabecalho from '@/components/Cabecalho';
import Semaforo from '@/components/Semaforo';

export const metadata = { title: 'Clientes' };

export default async function Empresas({ searchParams }: { searchParams: Promise<{ etapa?: string; q?: string }> }) {
  const u = await exigirUsuario();
  const sp = await searchParams;
  const lista = listarEmpresas(u, { etapa: sp.etapa, q: sp.q });
  return (
    <>
      <Cabecalho titulo="Clientes" descricao="Empresas em conversa, com a última simulação de cada uma." acoes={<Link href="/app/empresas/nova" className="btn-primario">Novo cliente</Link>} />
      <div className="px-4 py-6 md:px-8">
        <form className="flex flex-wrap gap-2">
          <input name="q" defaultValue={sp.q} placeholder="Buscar por nome, CNPJ, contato ou e-mail" className="campo max-w-sm" />
          <select name="etapa" defaultValue={sp.etapa ?? ''} className="campo w-auto">
            <option value="">Todas as etapas</option>
            {ETAPAS.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
          <button className="btn-secundario">Filtrar</button>
        </form>
        <div className="painel mt-4 overflow-x-auto">
          {lista.length === 0 ? <p className="p-6 text-sm text-tinta-2">Nenhum cliente encontrado com esse filtro.</p> : (
            <table className="tabela">
              <thead><tr><th>Empresa</th><th>Setor</th><th className="num">Faturamento/mês</th><th className="num">Necessidade</th><th>Caixa</th><th>Etapa</th><th>Atualizado</th></tr></thead>
              <tbody>
                {lista.map(e => (
                  <tr key={e.id}>
                    <td><Link className="font-medium hover:text-marca" href={`/app/empresas/${e.id}`}>{e.nome}</Link><span className="block text-xs text-tinta-3">{[e.contato_nome, e.cidade].filter(Boolean).join(', ')}{e.parceiro_nome ? ` · ${e.parceiro_nome}` : ''}</span></td>
                    <td className="text-tinta-2">{e.nicho_id ? getNicho(e.nicho_id)?.nicho : '—'}</td>
                    <td className="num">{e.faturamento_mensal ? brl(e.faturamento_mensal) : '—'}</td>
                    <td className="num">{e.ultima_necessidade != null ? brl(e.ultima_necessidade) : '—'}</td>
                    <td>{e.semaforo && e.semaforo !== 'n/a' ? <Semaforo veredito={e.semaforo} pequeno /> : <span className="text-xs text-tinta-3">—</span>}</td>
                    <td className="whitespace-nowrap text-tinta-2">{ETAPAS.find(x => x.id === e.etapa)?.nome}</td>
                    <td className="whitespace-nowrap text-tinta-2">{dataBR(e.atualizado_em + 'Z')}</td>
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
