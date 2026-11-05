import { ListaSetores } from '@/components/PaginasPublicas';
export default async function InicioParceiro({ params }: { params: Promise<{ parceiro: string }> }) {
  return <ListaSetores base={`/p/${(await params).parceiro}`} />;
}
