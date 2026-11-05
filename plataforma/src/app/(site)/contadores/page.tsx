import Link from 'next/link';
import { getMarca } from '@/lib/dados';

export const metadata = { title: 'Para escritórios de contabilidade' };

export default function Contadores() {
  const m = getMarca();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="h1">A pergunta do caixa vai chegar ao seu escritório</h1>
      <p className="mt-4 text-lg leading-relaxed text-tinta-2">Em 2028 o split payment vai tirar dos seus clientes o imposto que hoje fica um mês no caixa. Eles vão perguntar ao contador quanto isso custa e o que fazer. A parceria dá ao escritório uma resposta pronta, sem montar uma área de finanças.</p>
      <h2 className="h2 mt-10">Como funciona</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
        <li>O escritório ganha uma página com a própria marca e a calculadora dos 123 setores.</li>
        <li>O cliente preenche, recebe o diagnóstico em PDF com o nome do escritório, e o contato entra no painel do parceiro.</li>
        <li>Quando o cliente contrata o diagnóstico com os números reais, o escritório recebe parte do honorário. O contador segue dono da relação.</li>
        <li>No painel, o escritório acompanha cada cliente, as simulações e a etapa da conversa.</li>
      </ol>
      <h2 className="h2 mt-10">O que fica com cada um</h2>
      <p className="mt-3 leading-relaxed text-tinta-2">A contabilidade continua com o escritório: apuração, obrigações, enquadramento fiscal. A consultoria cuida do caixa: necessidade de capital, prazos com clientes e fornecedores, crédito antes de precisar e preço. Quando o enquadramento for duvidoso, quem assina é o profissional habilitado.</p>
      <div className="mt-10 rounded-lg bg-marca-claro p-6">
        <p className="font-semibold">Fale com a gente para abrir a página do seu escritório</p>
        <p className="mt-1 text-sm text-tinta-2">{m.email} · {m.telefone}</p>
        <Link href="/setores" className="btn-primario mt-4">Ver a calculadora</Link>
      </div>
    </div>
  );
}
