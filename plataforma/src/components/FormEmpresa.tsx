import { categorias } from '@/lib/base';
import type { Empresa, Parceiro } from '@/lib/dados';

export function SelectNicho({ nome = 'nicho_id', valor, obrigatorio }: { nome?: string; valor?: string | null; obrigatorio?: boolean }) {
  return (
    <select id={nome} name={nome} defaultValue={valor ?? ''} required={obrigatorio} className="campo">
      <option value="">Escolha o setor</option>
      {categorias().map(c => (
        <optgroup key={c.codigo} label={c.nome}>
          {c.nichos.map(n => <option key={n.id} value={n.id}>{n.nicho}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

export default function FormEmpresa({ e, acao, parceiros, usuarios, admin, rotuloBotao }: {
  e?: Empresa; acao: (fd: FormData) => Promise<void>; parceiros?: Parceiro[]; usuarios?: { id: number; nome: string }[]; admin: boolean; rotuloBotao: string;
}) {
  const C = ({ nome, rotulo, tipo = 'text', valor, ...r }: { nome: string; rotulo: string; tipo?: string; valor?: string | number | null } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div><label className="rotulo" htmlFor={nome}>{rotulo}</label><input id={nome} name={nome} type={tipo} defaultValue={valor ?? ''} className="campo" {...r} /></div>
  );
  return (
    <form action={acao} className="space-y-4">
      {e && <input type="hidden" name="id" value={e.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <C nome="nome" rotulo="Empresa" valor={e?.nome} required />
        <C nome="cnpj" rotulo="CNPJ" valor={e?.cnpj} />
        <div className="sm:col-span-2"><label className="rotulo" htmlFor="nicho_id">Setor</label><SelectNicho valor={e?.nicho_id} /></div>
        <C nome="faturamento_mensal" rotulo="Faturamento mensal (R$)" valor={e?.faturamento_mensal ? Math.round(e.faturamento_mensal) : ''} inputMode="numeric" />
        <div className="grid grid-cols-[1fr_80px] gap-3"><C nome="cidade" rotulo="Cidade" valor={e?.cidade} /><C nome="uf" rotulo="UF" valor={e?.uf} maxLength={2} /></div>
        <C nome="contato_nome" rotulo="Contato" valor={e?.contato_nome} />
        <C nome="cargo" rotulo="Cargo" valor={e?.cargo} />
        <C nome="email" rotulo="E-mail" tipo="email" valor={e?.email} />
        <C nome="telefone" rotulo="Telefone ou WhatsApp" valor={e?.telefone} />
        {admin && parceiros && (
          <div><label className="rotulo" htmlFor="parceiro_id">Escritório parceiro</label>
            <select id="parceiro_id" name="parceiro_id" defaultValue={e?.parceiro_id ?? ''} className="campo">
              <option value="">Nenhum</option>
              {parceiros.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select></div>
        )}
        {admin && usuarios && (
          <div><label className="rotulo" htmlFor="responsavel_id">Consultor responsável</label>
            <select id="responsavel_id" name="responsavel_id" defaultValue={e?.responsavel_id ?? ''} className="campo">
              <option value="">Ninguém</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select></div>
        )}
        <div className="sm:col-span-2"><label className="rotulo" htmlFor="observacoes">Observações</label><textarea id="observacoes" name="observacoes" rows={3} defaultValue={e?.observacoes ?? ''} className="campo" /></div>
      </div>
      <button className="btn-primario">{rotuloBotao}</button>
    </form>
  );
}
