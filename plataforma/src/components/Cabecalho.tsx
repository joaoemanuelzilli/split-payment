export default function Cabecalho({ titulo, descricao, acoes }: { titulo: string; descricao?: React.ReactNode; acoes?: React.ReactNode }) {
  return (
    <header className="nao-imprimir flex flex-wrap items-end justify-between gap-4 border-b border-linha bg-papel-2 px-4 py-5 md:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
        {descricao && <p className="mt-1 max-w-3xl text-sm text-tinta-2">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </header>
  );
}
