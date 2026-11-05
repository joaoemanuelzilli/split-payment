import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getNicho } from '@/lib/base';
import { minusculaInicial } from '@/lib/format';
import { PaginaNicho } from '@/components/PaginasPublicas';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = getNicho((await params).slug);
  return n ? { title: `Split payment para ${minusculaInicial(n.nicho)}`, description: `Quanto capital de giro ${minusculaInicial(n.nicho)} vai precisar a mais com o split payment de IBS e CBS. ${n.split.quando}` } : {};
}
export default async function Setor({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNicho((await params).slug);
  if (!n) notFound();
  return <PaginaNicho nicho={n} />;
}
