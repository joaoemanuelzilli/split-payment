import { CabecalhoSite, RodapeSite } from '@/components/Site';

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CabecalhoSite />
      <main>{children}</main>
      <RodapeSite />
    </>
  );
}
