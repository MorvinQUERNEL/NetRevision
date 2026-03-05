import { create } from 'zustand'

type Lang = 'fr' | 'en'

interface LangStore {
  lang: Lang
  toggle: () => void
  setLang: (lang: Lang) => void
}

const getInitialLang = (): Lang => {
  const stored = localStorage.getItem('lang')
  if (stored === 'fr' || stored === 'en') return stored
  return 'fr'
}

export const useLangStore = create<LangStore>((set) => ({
  lang: getInitialLang(),
  toggle: () => set((s) => {
    const next = s.lang === 'fr' ? 'en' : 'fr'
    localStorage.setItem('lang', next)
    document.documentElement.setAttribute('lang', next)
    return { lang: next }
  }),
  setLang: (lang) => {
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('lang', lang)
    set({ lang })
  },
}))
