const brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const num1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const num0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
export const brl = (v: number) => brl0.format(Math.round(v || 0));
/** Percentual em pt-BR. `casas` fixa o número de decimais; 'auto' mostra até 2 sem zeros à direita (11,35%, 18,7%). */
export const pct = (v: number, casas: number | 'auto' = 1) =>
  (casas === 'auto' ? new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }) : new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })).format(v || 0) + '%';
export const n0 = (v: number) => num0.format(v || 0);
/** R$ compacto: 1,2 mi / 850 mil. */
export function brlCurto(v: number) {
  const a = Math.abs(v);
  if (a >= 1e9) return 'R$ ' + num1.format(v / 1e9) + ' bi';
  if (a >= 1e6) return 'R$ ' + num1.format(v / 1e6) + ' mi';
  if (a >= 1e3) return 'R$ ' + num0.format(v / 1e3) + ' mil';
  return brl(v);
}
export const dataBR = (iso: string | number | Date) => new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
export const dataHoraBR = (iso: string | number | Date) => new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
export function slugify(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Primeira letra minúscula, sem mexer em siglas (TI, GLP, TRR): "Desenvolvimento de software e TI" → "desenvolvimento de software e TI". */
export function minusculaInicial(s: string) {
  return s.length > 1 && s[1] === s[1].toUpperCase() && /[A-Z]/.test(s[1]) ? s : s.charAt(0).toLowerCase() + s.slice(1);
}

/** Tira o ponto final de textos de uma frase só (legendas, ajudas, itens curtos). Texto com mais de uma frase fica como está. */
export function semPonto(s: string) {
  const t = s.trim();
  if (!t.endsWith('.') || /[.!?;]\s/.test(t.slice(0, -1)) || /(\b[a-z]\.[a-z]|etc)\.$/i.test(t)) return t;
  return t.slice(0, -1);
}
