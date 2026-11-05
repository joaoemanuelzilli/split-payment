'use client';
export default function BotaoImprimir({ rotulo = 'Salvar em PDF' }: { rotulo?: string }) {
  return <button type="button" className="btn-secundario nao-imprimir" onClick={() => window.print()}>{rotulo}</button>;
}
