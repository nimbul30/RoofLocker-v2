// Translation helper for English and Spanish dynamic switching
export function t(en: string, es: string, lang: 'en' | 'es'): string {
  return lang === 'es' ? es : en;
}

export type Language = 'en' | 'es';
