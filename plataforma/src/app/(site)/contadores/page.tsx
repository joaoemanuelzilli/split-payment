import Link from 'next/link';
import { getMarca } from '@/lib/dados';

export const metadata = { title: 'Para escritórios de contabilidade' };

const PASSOS = [
  'O escritório ganha uma página com a própria marca e a calculadora dos 123 setores',
  'O cliente preenche, recebe o diagnóstico em PDF com o nome do escritório, e o contato entra no painel do parceiro',
  'Quando o cliente contrata o diagnóstico com os números reais, o escritório recebe parte do honorário. O contador segue dono da relação',
  'No painel, o escritório acompanha cada cliente, as simulações e a etapa da conversa',
];

export default async function Contadores() {
  const m = await getMarca();
  return (
    <div className="recipiente py-12 md:py-16">
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <h1 className="h1 max-w-[18ch]">A pergunta do caixa vai chegar ao seu escritório</h1>
          <p className="mt-5 max-w-[36rem] text-lg leading-relaxed text-tinta-2">Em 2028 o split payment vai tirar dos seus clientes o imposto que hoje fica um mês no caixa. Eles vão perguntar ao contador quanto isso custa e o que fazer. A parceria dá ao escritório uma resposta pronta, sem montar uma área de finanças.</p>
        </div>
        <div>
          <h2 className="h2">Como funciona</h2>
          <ol className="mt-4 border-t border-linha">
            {PASSOS.map((p, i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-linha py-4 leading-relaxed">
                <span className="font-semibold tabular-nums text-marca">{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="mt-16 grid gap-x-16 gap-y-8 border-t border-linha pt-12 md:grid-cols-3">
        <h2 className="h2">O que fica com cada um</h2>
        <div>
          <p className="font-semibold">Escritório</p>
          <p className="mt-2 leading-relaxed text-tinta-2">A contabilidade: apuração, obrigações e enquadramento fiscal. Quando o enquadramento for duvidoso, quem assina é o profissional habilitado</p>
        </div>
        <div>
          <p className="font-semibold">Consultoria</p>
          <p className="mt-2 leading-relaxed text-tinta-2">O caixa: necessidade de capital, prazos com clientes e fornecedores, crédito antes de precisar e preço</p>
        </div>
      </section>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-marca-claro px-6 py-8 md:px-10">
        <div>
          <p className="text-lg font-semibold">Fale com a gente para abrir a página do seu escritório</p>
          <p className="mt-1 text-tinta-2">{m.email} · {m.telefone}</p>
        </div>
        <Link href="/setores" className="btn-primario px-6 py-3 text-base">Ver a calculadora</Link>
      </div>
    </div>
  );
}
