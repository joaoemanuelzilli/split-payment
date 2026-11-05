import { exigirUsuario } from '@/lib/auth';
import { listarParceiros, type Parceiro } from '@/lib/dados';
import Cabecalho from '@/components/Cabecalho';
import { salvarParceiroAcao } from '../../acoes';

export const metadata = { title: 'Parceiros' };
const MSG: Record<string, string> = { nome: 'Informe o nome do escritório.', slug: 'Esse endereço já está em uso. Escolha outro.' };

function Form({ p }: { p?: Parceiro }) {
  return (
    <form action={salvarParceiroAcao} className="grid gap-3 sm:grid-cols-2">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div><label className="rotulo">Escritório</label><input name="nome" defaultValue={p?.nome} required className="campo" /></div>
      <div><label className="rotulo">Endereço da página (/p/…)</label><input name="slug" defaultValue={p?.slug} placeholder="gerado do nome" className="campo" /></div>
      <div><label className="rotulo">Contato</label><input name="contato_nome" defaultValue={p?.contato_nome ?? ''} className="campo" /></div>
      <div><label className="rotulo">Cidade</label><input name="cidade" defaultValue={p?.cidade ?? ''} className="campo" /></div>
      <div><label className="rotulo">E-mail</label><input name="email" type="email" defaultValue={p?.email ?? ''} className="campo" /></div>
      <div><label className="rotulo">Telefone</label><input name="telefone" defaultValue={p?.telefone ?? ''} className="campo" /></div>
      <div><label className="rotulo">Cor da marca</label><input name="cor" type="color" defaultValue={p?.cor ?? '#0F5C5A'} className="h-10 w-20 rounded border border-linha" /></div>
      <div><label className="rotulo">Repasse do honorário (%)</label><input name="repasse_pct" type="number" min={0} max={100} step={1} defaultValue={p?.repasse_pct ?? 20} className="campo" /></div>
      <div className="sm:col-span-2"><label className="rotulo">Endereço do logo (URL da imagem)</label><input name="logo_url" defaultValue={p?.logo_url ?? ''} className="campo" /></div>
      {p && <div><label className="rotulo">Situação</label><select name="ativo" defaultValue={p.ativo ? 'on' : 'off'} className="campo"><option value="on">Ativo</option><option value="off">Pausado</option></select></div>}
      <div className="flex items-end"><button className="btn-primario">{p ? 'Salvar' : 'Cadastrar parceiro'}</button></div>
    </form>
  );
}

export default async function Parceiros({ searchParams }: { searchParams: Promise<{ erro?: string; ok?: string }> }) {
  await exigirUsuario(['admin']);
  const sp = await searchParams;
  const lista = listarParceiros();
  return (
    <>
      <Cabecalho titulo="Escritórios parceiros" descricao="Cada parceiro tem uma página com a própria marca e a calculadora. Os contatos que chegam por ela ficam marcados com o parceiro. Para dar acesso ao painel, crie um usuário do tipo parceiro em Configurações." />
      <div className="space-y-6 px-4 py-6 md:px-8">
        {sp.erro && <p role="alert" className="text-sm text-risco">{MSG[sp.erro] ?? 'Não foi possível salvar.'}</p>}
        {sp.ok && <p role="status" className="text-sm text-ok">Parceiro salvo.</p>}
        {lista.map(p => (
          <details key={p.id} className="painel p-4">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-semibold">{p.nome}{!p.ativo && <span className="ml-2 text-xs text-tinta-3">pausado</span>}</span>
              <span className="text-sm text-tinta-2">{p.total_empresas} contatos · {p.em_acompanhamento} em diagnóstico ou depois · repasse {p.repasse_pct}% · <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer" className="text-marca hover:underline">/p/{p.slug}</a></span>
            </summary>
            <div className="mt-4 border-t border-linha pt-4"><Form p={p} /></div>
          </details>
        ))}
        <section className="painel p-4">
          <h2 className="h3 mb-3">Novo parceiro</h2>
          <Form />
        </section>
      </div>
    </>
  );
}
