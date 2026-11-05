'use client';
export default function BotaoConfirmar({ children, pergunta, className }: { children: React.ReactNode; pergunta: string; className?: string }) {
  return <button className={className} onClick={e => { if (!window.confirm(pergunta)) e.preventDefault(); }}>{children}</button>;
}
