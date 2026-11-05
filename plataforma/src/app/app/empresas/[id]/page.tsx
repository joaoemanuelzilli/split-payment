import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigirUsuario } from '@/lib/auth';
import { getNicho } from '@/lib/base';
import { todos } from '@/lib/db';
import { calcular, custoAcumulado, precoSugerido } from '@/lib/calc';
import { ETAPAS, getEmpresa, getFaixas, listarChecklist, listarNotas, listarParceiros, listarSimulacoes, podeVer, simulacaoDesatualizada, getParametros } from '@/lib/dados';
import { brl, dataBR, dataHoraBR, pct } from '@/lib/format';
import Cabecalho from '@/components/Cabecalho';
import FormEmpresa from '@/components/FormEmpresa';
import Semaforo from '@/components/Semaforo';
import BotaoConfirmar from '@/components/BotaoConfirmar';
import { adicionarNotaAcao, atualizarEmpresaAcao, checklistAcao, excluirEmpresaAcao, mudarEtapaAcao } from '../../../acoes';

export default async function FichaEmpresa({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const e = await getEmpresa(Number((await params).id));
  if (!e || !podeVer(u, e)) notFound();
  const n = e.nicho_id ? getNicho(e.nicho_id) : undefined;
  const sims = await listarSimulacoes(u, e.id);
  const check = await listarChecklist(e.id);
  const notas = await listarNotas(e.id);
  const atuais = await getParametros();
  const admin = u.papel === 'admin';
  const ultima = sims[0];
  const rUlt = ultima && n ? calcular(getNicho(ultima.nicho_id)!, { valores: ultima.valores, caixa: ultima.caixa, parametros: ultima.parametros }) : undefined;
  const receita = rUlt?.receitaMensal ?? e.faturamento_mensal ?? 0;
  const preco = precoSugerido(receita, await getFaixas());
  const usuarios = await todos<{ id: number; nome: string }>("SELECT id, nome FROM usuarios WHERE papel != 'parceiro' AND ativo = 1 ORDER BY nome");
  const perguntas = check.filter(c => c.tipo === 'pergunta');
  const documentos = check.filter(c => c.tipo === 'documento');
  const tarefas = check.filter(c => c.tipo === 'tarefa');

  return (
    <>
      <Cabecalho titulo={e.nome} descricao={<>{n ? `${n.categoria}: ${n.nicho}` : 'Setor não definido'}{e.parceiro_nome ? ` · veio pelo parceiro ${e.parceiro_nome}` : ''} · cadastrado em {dataBR(e.criado_em + 'Z')}</>}
        acoes={<>
          <Link href={`/app/simulador/novo?empresa=${e.id}${e.nicho_id ? `&nicho=${e.nicho_id}` : ''}`} className="btn-primario">Nova simulação</Link>
          {ultima && <Link href={`/app/empresas/${e.id}/proposta`} className="btn-secundario">Proposta</Link>}
        </>} />
      <div className="grid gap-8 px-5 py-6 md:px-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:px-10 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="min-w-0 space-y-8">
          <form action={mudarEtapaAcao} className="painel flex flex-wrap items-end gap-3 p-4">
            <input type="hidden" name="id" value={e.id} />
            <div className="min-w-[240px] flex-1">
              <label htmlFor="etapa" className="rotulo">Etapa da conversa</label>
              <select id="etapa" name="etapa" defaultValue={e.etapa} className="campo">{ETAPAS.map(x => <option key={x.id} value={x.id}>{x.nome}</option>)}</select>
            </div>
            <button className="btn-secundario">Mudar etapa</button>
            <p className="w-full text-xs text-tinta-3">{[e.contato_nome, e.cargo, e.email, e.telefone].filter(Boolean).join(' · ') || 'Sem contato cadastrado'}</p>
          </form>

          <section className="painel overflow-hidden">
            <h2 className="h3 border-b border-linha px-4 py-3">Simulações</h2>
            {sims.length === 0 ? (
              <p className="p-4 text-sm text-tinta-2">Nenhuma simulação. Comece pela calculadora do setor com os números que o cliente já passou</p>
            ) : (
              <ul className="divide-y divide-linha">
                {sims.map(s => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <Link href={`/app/simulador/${s.id}`} className="font-medium hover:text-marca">{s.nome}</Link>
                      <p className="text-xs text-tinta-3">{dataHoraBR(s.atualizado_em + 'Z')}{simulacaoDesatualizada(s, atuais) ? ' · premissas antigas' : ''}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {s.resumo.modo === 'motor' ? (
                        <>
                          <span className="tabular-nums">{brl(s.resumo.favoravelTeste)} a {brl(s.resumo.necessidadeTeste)} em {s.resumo.anoTeste}</span>
                          <Semaforo veredito={s.resumo.semaforo} pequeno />
                        </>
                      ) : <span className="text-tinta-2">Simples puro: comparação de regime</span>}
                      <Link href={`/app/simulacoes/${s.id}/relatorio`} className="btn-texto text-xs">Relatório</Link>
                      <a href={`/relatorio/${s.token}`} target="_blank" rel="noreferrer" className="btn-texto text-xs">Link do cliente</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {check.length > 0 && (
            <section className="painel p-4">
              <h2 className="h3">Roteiro da reunião</h2>
              <p className="ajuda">Perguntas sobre o que a empresa já faz. Anote a resposta e marque quando estiver respondida</p>
              <ol className="mt-3 lista-limpa">
                {perguntas.map((c, i) => (
                  <li key={c.id} className="py-3">
                    <div className="flex items-start gap-3">
                      <form action={checklistAcao}>
                        <input type="hidden" name="empresa_id" value={e.id} /><input type="hidden" name="item" value={c.id} /><input type="hidden" name="acao" value="alternar" />
                        <button aria-label={c.feito ? 'Marcar como não respondida' : 'Marcar como respondida'} className={`mt-0.5 grid h-5 w-5 place-items-center rounded border ${c.feito ? 'border-ok bg-ok text-white' : 'border-tinta-3 bg-white hover:border-marca'}`}>{c.feito && <Visto />}</button>
                      </form>
                      <div className="flex-1">
                        <p className={`text-sm ${c.feito ? 'text-tinta-3' : ''}`}><span className="mr-1 font-semibold">{i + 1}.</span>{c.texto}</p>
                        <form action={checklistAcao} className="mt-2 flex gap-2">
                          <input type="hidden" name="empresa_id" value={e.id} /><input type="hidden" name="item" value={c.id} /><input type="hidden" name="acao" value="responder" />
                          <input name="resposta" defaultValue={c.resposta ?? ''} placeholder="Resposta do cliente" className="campo py-1.5 text-xs" />
                          <button className="btn-secundario px-3 py-1 text-xs">Guardar</button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <h3 className="h3 mt-6">Documentos a pedir</h3>
              <ul className="mt-2 space-y-1">
                {[...documentos, ...tarefas].map(c => (
                  <li key={c.id}>
                    <form action={checklistAcao} className="flex items-start gap-2 text-sm">
                      <input type="hidden" name="empresa_id" value={e.id} /><input type="hidden" name="item" value={c.id} /><input type="hidden" name="acao" value="alternar" />
                      <button aria-label={c.feito ? 'Desmarcar' : 'Marcar como feito'} className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${c.feito ? 'border-ok bg-ok text-white' : 'border-tinta-3 bg-white hover:border-marca'}`}>{c.feito && <Visto />}</button>
                      <span className={c.feito ? 'text-tinta-3 line-through' : ''}>{c.texto}</span>
                    </form>
                  </li>
                ))}
              </ul>
              <form action={checklistAcao} className="mt-3 flex gap-2">
                <input type="hidden" name="empresa_id" value={e.id} /><input type="hidden" name="acao" value="nova" />
                <input name="texto" placeholder="Acrescentar item" className="campo py-1.5 text-sm" />
                <button className="btn-secundario px-3 py-1.5 text-sm">Acrescentar</button>
              </form>
            </section>
          )}

          <section className="painel p-4">
            <h2 className="h3">Histórico</h2>
            <form action={adicionarNotaAcao} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={e.id} />
              <textarea name="texto" rows={2} placeholder="O que foi conversado, próximos passos, pendências" className="campo" />
              <button className="btn-secundario">Registrar</button>
            </form>
            <ul className="mt-4 space-y-3">
              {notas.map(nt => (
                <li key={nt.id} className="border-t border-linha pt-3 text-sm first:border-t-0 first:pt-0">
                  <p className="whitespace-pre-line">{nt.texto}</p>
                  <p className="text-xs text-tinta-3">{nt.usuario_nome ?? 'Sistema'} · {dataHoraBR(nt.criado_em + 'Z')}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="painel p-4">
            <h2 className="h3">O que oferecer</h2>
            {rUlt && rUlt.derivacao.modo === 'motor' ? (
              <p className="mt-1 text-sm text-tinta-2">Carregar a necessidade prudente de 2027 a 2033 custa cerca de <strong className="text-tinta">{brl(custoAcumulado(rUlt))}</strong> em juros e CDI. Em {rUlt.teste.ano}, {pct(Number.isFinite(rUlt.teste.pctFco) ? 100 * rUlt.teste.pctFco : 0)} da geração de caixa</p>
            ) : <p className="mt-1 text-sm text-tinta-2">Faça uma simulação para ancorar o preço no custo de não fazer nada</p>}
            <ol className="mt-4 lista-limpa border-y border-linha text-sm">
              <li className="py-3"><p className="flex items-baseline justify-between gap-3 font-semibold"><span>Diagnóstico com os números reais</span><span className="whitespace-nowrap tabular-nums">{brl(preco.diagnostico)}</span></p><p className="mt-0.5 text-tinta-2">Duas a três semanas, enquadramento conferido e reunião com os sócios</p></li>
              <li className="py-3"><p className="flex items-baseline justify-between gap-3 font-semibold"><span>Projeto de execução</span><span className="whitespace-nowrap font-normal text-tinta-3">sob escopo</span></p><p className="mt-0.5 text-tinta-2">Prazos com fornecedores e clientes, antecipação, limite contratado antes de precisar, preço e contratos</p></li>
              <li className="py-3"><p className="flex items-baseline justify-between gap-3 font-semibold"><span>Acompanhamento mensal, 2027 a 2033</span><span className="whitespace-nowrap tabular-nums">{brl(preco.acompanhamento)}/mês</span></p><p className="mt-0.5 text-tinta-2">Atualizar a conta a cada norma, saldo credor e ressarcimento, plano de cada ano da rampa</p></li>
            </ol>
            <p className="ajuda mt-3">Preços sugeridos pela faixa de faturamento ({receita ? brl(receita) : 'não informado'} por mês). Ajuste em Configurações</p>
          </section>

          {n && (
            <section className="painel p-4">
              <h2 className="h3">Tese para este setor</h2>
              <p className="mt-2 text-sm leading-relaxed">{n.tese_consultoria}</p>
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium text-marca">Leitura crítica do setor</summary>
                <p className="mt-2 leading-relaxed text-tinta-2">{n.analise_critica}</p>
              </details>
              <Link href={`/app/setores/${n.id}`} className="btn-texto mt-2 px-0 text-xs">Enquadramento, premissas e fontes</Link>
            </section>
          )}

          <details className="painel p-4">
            <summary className="h3 cursor-pointer">Dados do cliente</summary>
            <div className="mt-4"><FormEmpresa e={e} acao={atualizarEmpresaAcao} admin={admin} parceiros={admin ? await listarParceiros() : undefined} usuarios={admin ? usuarios : undefined} rotuloBotao="Salvar dados" /></div>
            {u.papel !== 'parceiro' && (
              <form action={excluirEmpresaAcao} className="mt-6 border-t border-linha pt-4">
                <input type="hidden" name="id" value={e.id} />
                <BotaoConfirmar pergunta="Excluir este cliente, as simulações e o histórico? Não dá para desfazer." className="text-sm text-risco hover:underline">Excluir cliente e simulações</BotaoConfirmar>
              </form>
            )}
          </details>
        </aside>
      </div>
    </>
  );
}

function Visto() {
  return <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden><path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
