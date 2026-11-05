import { notFound } from 'next/navigation';
import { getNicho } from '@/lib/base';
import { PaginaNicho } from '@/components/PaginasPublicas';

export default async function SetorParceiro({ params }: { params: Promise<{ parceiro: string; slug: string }> }) {
  const { parceiro, slug } = await params;
  const n = getNicho(slug);
  if (!n) notFound();
  return <PaginaNicho nicho={n} parceiro={parceiro} base={`/p/${parceiro}`} />;
}
