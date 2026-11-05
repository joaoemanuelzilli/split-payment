import { exigirUsuario } from '@/lib/auth';
import { parametrosBase } from '@/lib/base';
import { todos } from '@/lib/db';
import { getConfigPublica, getFaixas, getMarca, getParametros, listarParceiros } from '@/lib/dados';
import { dataHoraBR } from '@/lib/format';
import Cabecalho from '@/components/Cabecalho';
import BotaoConfirmar from '@/components/BotaoConfirmar';
import { recalcularAcao, salvarMarcaAcao, salvarParametrosAcao, salvarPrecosAcao, salvarUsuarioAcao } from '../../acoes';

export const metadata = { title: 'Configurações' };
const OK: Record<string, string> = { parametros: 'Premissas salvas', recalculo: 'Simulações recalculadas', marca: 'Marca e site salvos', precos: 'Preços salvos', usuario: 'Usuário salvo' };
const ERRO: Record<string, string> = { usuario: 'Preencha nome, e-mail, papel e, para parceiro, o escritório', senha: 'A senha precisa de pelo menos 8 caracteres', email: 'Esse e-mail já está em uso' };

const PARAMS: { id: string; rotulo: string; ajuda: string }[] = [
  { id: 'cbs_referencia_pct', rotulo: 'CBS de referência (%)', ajuda: 'TCU: 11,35%. Atualize quando o Senado publicar a resolução (até 15/12/2026)' },
  { id: 'ibs_cheio_pct', rotulo: 'IBS cheio em 2033 (%)', ajuda: 'Projeção do Comitê Gestor' },
  { id: 'adesao_2027_pct', rotulo: 'Adesão ao split em 2027 (%)', ajuda: 'Etapa facultativa prevista para o 2º semestre' },
  { id: 'adesao_2028_em_diante_pct', rotulo: 'Adesão a partir de 2028 (%)', ajuda: 'Obrigatória prevista' },
  { id: 'ressarcimento_dias_extra', rotulo: 'Prazo extra do ressarcimento (dias)', ajuda: '45, 75 ou 165 conforme o caso' },
  { id: 'dias_antecipacao', rotulo: 'Dias de antecipação de recebíveis', ajuda: 'Quando a empresa antecipa, recebe em D+2' },
  { id: 'cdi_pct_aa', rotulo: 'CDI (% a.a.)', ajuda: 'Custo de oportunidade do caixa próprio' },
  { id: 'ano_teste', rotulo: 'Ano padrão do teste de caixa', ajuda: '2028 é o primeiro ano cheio do split' },
  { id: 'credito_fornecedor_simples_pct_cheia', rotulo: 'Crédito de fornecedor do Simples (% da cheia)', ajuda: 'Usado na comparação de regime' },
];

export default async function Configuracoes({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string; n?: string }> }) {
  await exigirUsuario(['admin']);
  const sp = await searchParams;
  const m = await getMarca(), pub = await getConfigPublica(), p = await getParametros(), pb = parametrosBase(), faixas = await getFaixas();
  const historico = await todos<{ id: number; valores: string; motivo: string; nome: string; criado_em: string }>('SELECT h.*, u.nome FROM parametros_historico h LEFT JOIN usuarios u ON u.id = h.usuario_id ORDER BY h.id DESC LIMIT 10');
  const usuarios = await todos<{ id: number; nome: string; email: string; papel: string; parceiro_id: number | null; parceiro_nome: string | null; ativo: number }>('SELECT u.*, p.nome AS parceiro_nome FROM usuarios u LEFT JOIN parceiros p ON p.id = u.parceiro_id ORDER BY u.nome');
  const parceiros = await listarParceiros();
  return (
    <>
      <Cabecalho titulo="Configurações" descricao="Marca, premissas da reforma, preços e quem acessa" />
      <div className="grid items-start gap-8 px-5 py-6 md:px-8 xl:px-10 min-[1500px]:grid-cols-2">
        {sp.ok && <p role="status" className="rounded bg-[#E8F3EC] px-3 py-2 text-sm text-ok">{OK[sp.ok]}{sp.n ? ` (${sp.n})` : ''}</p>}
        {sp.erro && <p role="alert" className="rounded bg-[#FCECEA] px-3 py-2 text-sm text-risco">{ERRO[sp.erro] ?? 'Não foi possível salvar. Tente de novo'}</p>}

        <section id="parametros" className="painel p-5">
          <h2 className="h2">Premissas da reforma</h2>
          <p className="ajuda">Valem para novas simulações e para a calculadora pública. As simulações salvas guardam as premissas com que foram feitas; use o recálculo para atualizá-las</p>
          <form action={salvarParametrosAcao} className="mt-4 grid gap-4 sm:grid-cols-2">
            {PARAMS.map(x => (
              <div key={x.id}>
                <label className="rotulo" htmlFor={`p-${x.id}`}>{x.rotulo}</label>
                <input id={`p-${x.id}`} name={x.id} type="number" step="0.01" defaultValue={(p as unknown as Record<string, number>)[x.id]} className="campo" />
                <p className="ajuda">{x.ajuda} · base: {(pb as unknown as Record<string, number>)[x.id]}</p>
              </div>
            ))}
            <div className="sm:col-span-2"><label className="rotulo" htmlFor="motivo">Motivo da mudança</label><input id="motivo" name="motivo" placeholder="Ex.: Resolução do Senado de dezembro de 2026" className="campo" /></div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="recalcular" defaultChecked className="h-4 w-4 accent-[var(--marca)]" />Recalcular todas as simulações salvas com as novas premissas</label>
            <div><button className="btn-primario">Salvar premissas</button></div>
          </form>
          <form action={recalcularAcao} className="mt-4"><BotaoConfirmar pergunta="Recalcular todas as simulações salvas com as premissas atuais?" className="btn-secundario">Recalcular simulações agora</BotaoConfirmar></form>
          {historico.length > 0 && (
            <details className="mt-4 text-sm"><summary className="cursor-pointer font-medium">Histórico de mudanças</summary>
              <ul className="mt-2 space-y-1">{historico.map(h => { const v = JSON.parse(h.valores); return <li key={h.id} className="text-xs text-tinta-2">{dataHoraBR(h.criado_em + 'Z')}, {h.nome}: {h.motivo}. CBS {v.cbs_referencia_pct}%, IBS {v.ibs_cheio_pct}%, adesão 2027 {v.adesao_2027_pct}%.</li>; })}</ul>
            </details>
          )}
        </section>

        <section className="painel p-5">
          <h2 className="h2">Marca e site</h2>
          <form action={salvarMarcaAcao} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="rotulo">Nome</label><input name="nome" defaultValue={m.nome} className="campo" /></div>
            <div><label className="rotulo">Cor principal</label><input name="cor" type="color" defaultValue={m.cor} className="h-10 w-20 rounded border border-linha" /></div>
            <div className="sm:col-span-2"><label className="rotulo">Frase de apresentação</label><input name="slogan" defaultValue={m.slogan} className="campo" /></div>
            <div><label className="rotulo">E-mail</label><input name="email" defaultValue={m.email} className="campo" /></div>
            <div><label className="rotulo">Telefone</label><input name="telefone" defaultValue={m.telefone} className="campo" /></div>
            <div><label className="rotulo">Cidade</label><input name="cidade" defaultValue={m.cidade} className="campo" /></div>
            <div><label className="rotulo">Site</label><input name="site" defaultValue={m.site} className="campo" /></div>
            <div className="sm:col-span-2"><label className="rotulo">Endereço do logo (URL da imagem; vazio usa o símbolo padrão)</label><input name="logoUrl" defaultValue={m.logoUrl} className="campo" /></div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="exigirCadastro" defaultChecked={pub.exigirCadastro} className="h-4 w-4 accent-[var(--marca)]" />Na calculadora pública, pedir o contato antes de mostrar o detalhe e o PDF</label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="somentePrioridade1" defaultChecked={pub.somentePrioridade1} className="h-4 w-4 accent-[var(--marca)]" />Mostrar no site só os setores de prioridade 1</label>
            <div><button className="btn-primario">Salvar marca e site</button></div>
          </form>
        </section>

        <section className="painel p-5">
          <h2 className="h2">Preços sugeridos por faixa de faturamento mensal</h2>
          <p className="ajuda">Aparecem na ficha do cliente e na proposta. Valores iniciais são hipótese: calibre com os primeiros diagnósticos</p>
          <form action={salvarPrecosAcao} className="mt-4 space-y-2">
            <div className="hidden grid-cols-3 gap-3 text-xs font-semibold text-tinta-2 sm:grid"><span>Faturamento mensal até (R$)</span><span>Diagnóstico (R$)</span><span>Acompanhamento mensal (R$)</span></div>
            {faixas.map((f, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-3">
                {i < 3 ? <input name={`ate_${i}`} type="number" defaultValue={f.ate ?? ''} className="campo" aria-label="Faturamento até" /> : <span className="self-center text-sm text-tinta-2">Acima disso</span>}
                <input name={`diag_${i}`} type="number" defaultValue={f.diagnostico} className="campo" aria-label="Diagnóstico" />
                <input name={`acomp_${i}`} type="number" defaultValue={f.acompanhamento} className="campo" aria-label="Acompanhamento" />
              </div>
            ))}
            <button className="btn-primario mt-2">Salvar preços</button>
          </form>
        </section>

        <section id="usuarios" className="painel p-5">
          <h2 className="h2">Usuários</h2>
          <ul className="mt-3 divide-y divide-linha">
            {usuarios.map(u => (
              <li key={u.id} className="py-2">
                <details>
                  <summary className="flex cursor-pointer flex-wrap justify-between gap-2 text-sm"><span className="font-medium">{u.nome}{!u.ativo && ' (inativo)'}</span><span className="text-tinta-2">{u.email} · {u.papel}{u.parceiro_nome ? `, ${u.parceiro_nome}` : ''}</span></summary>
                  <FormUsuario u={u} parceiros={parceiros} />
                </details>
              </li>
            ))}
          </ul>
          <h3 className="h3 mt-5">Novo usuário</h3>
          <FormUsuario parceiros={parceiros} />
        </section>
      </div>
    </>
  );
}

function FormUsuario({ u, parceiros }: { u?: { id: number; nome: string; email: string; papel: string; parceiro_id: number | null; ativo: number }; parceiros: { id: number; nome: string }[] }) {
  return (
    <form action={salvarUsuarioAcao} className="mt-3 grid gap-3 sm:grid-cols-2">
      {u && <input type="hidden" name="id" value={u.id} />}
      <div><label className="rotulo">Nome</label><input name="nome" defaultValue={u?.nome} required className="campo" /></div>
      <div><label className="rotulo">E-mail</label><input name="email" type="email" defaultValue={u?.email} required className="campo" /></div>
      <div><label className="rotulo">Papel</label><select name="papel" defaultValue={u?.papel ?? 'consultor'} className="campo"><option value="consultor">Consultor</option><option value="admin">Administrador</option><option value="parceiro">Escritório parceiro</option></select></div>
      <div><label className="rotulo">Escritório (se parceiro)</label><select name="parceiro_id" defaultValue={u?.parceiro_id ?? ''} className="campo"><option value="">Nenhum</option>{parceiros.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
      <div><label className="rotulo">{u ? 'Nova senha (deixe vazio para manter)' : 'Senha (mínimo 8 caracteres)'}</label><input name="senha" type="password" minLength={u ? undefined : 8} autoComplete="new-password" className="campo" /></div>
      {u && <div><label className="rotulo">Situação</label><select name="ativo" defaultValue={u.ativo ? 'on' : 'off'} className="campo"><option value="on">Ativo</option><option value="off">Inativo</option></select></div>}
      <div className="flex items-end"><button className="btn-primario">{u ? 'Salvar usuário' : 'Criar usuário'}</button></div>
    </form>
  );
}
