import { create } from 'zustand';

type ProfilTipi = 'diyetisyen' | 'danisan' | null;

type AppState = {
  diyetisyenStep: string;
  setDiyetisyenStep: (step: string) => void;

  profilTipi: ProfilTipi;
  setProfilTipi: (tip: ProfilTipi) => void;
};

export const useAppStore = create<AppState>((set) => ({
  diyetisyenStep: 'login',
  setDiyetisyenStep: (step) => set({ diyetisyenStep: step }),

  profilTipi: null,
  setProfilTipi: (tip) => set({ profilTipi: tip }),
}));
