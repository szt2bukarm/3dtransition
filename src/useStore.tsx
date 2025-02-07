import { create } from 'zustand'

interface Store {
    pageTransition: boolean;
    setPageTransition: (pageTransition: boolean) => void

    fadelayer: any;
    setFadeLayer: (fadelayer: any) => void
}

export const useStore = create<Store>((set) => ({
    pageTransition: false,
    setPageTransition: (pageTransition) => set({ pageTransition }),

    fadelayer: null,
    setFadeLayer: (fadelayer) => set({ fadelayer })
}))