import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfilTipi = 'diyetisyen' | 'danisan' | null;

type AppState = {
  diyetisyenStep: string;
  setDiyetisyenStep: (step: string) => void;

  profilTipi: ProfilTipi;
  setProfilTipi: (tip: ProfilTipi) => void;

  danisanAvatar: string;
  setDanisanAvatar: (avatar: string) => void;

  diyetisyenAvatar: string;
  setDiyetisyenAvatar: (avatar: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  diyetisyenStep: 'login',
  setDiyetisyenStep: (step) => set({ diyetisyenStep: step }),

  profilTipi: null,
  setProfilTipi: (tip) => set({ profilTipi: tip }),

  danisanAvatar: 'default',
  setDanisanAvatar: async (avatar) => {
    await AsyncStorage.setItem('danisanAvatar', avatar);
    set({ danisanAvatar: avatar });
  },

  diyetisyenAvatar: 'default',
  setDiyetisyenAvatar: async (avatar) => {
    await AsyncStorage.setItem('diyetisyenAvatar', avatar);
    set({ diyetisyenAvatar: avatar });
  },
}));
