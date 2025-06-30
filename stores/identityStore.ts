import { create } from 'zustand';

interface IdentityState {
  isVerified: boolean;
  trustScore: number;
  rewardPoints: number;
  verificationLevel: 'none' | 'basic' | 'enhanced' | 'premium';
  faceId: string | null;
  
  // Actions
  startVerification: () => Promise<void>;
  completeFaceVerification: () => Promise<void>;
  claimRewards: (amount: number) => Promise<void>;
}

export const useIdentityStore = create<IdentityState>((set, get) => ({
  isVerified: false,
  trustScore: 0,
  rewardPoints: 0,
  verificationLevel: 'none',
  faceId: null,

  startVerification: async () => {
    // Mock verification process
    set({
      verificationLevel: 'basic',
      trustScore: 25,
    });
  },

  completeFaceVerification: async () => {
    // Mock face verification
    set({
      isVerified: true,
      verificationLevel: 'enhanced',
      trustScore: 85,
      rewardPoints: 100,
      faceId: 'face_id_' + Date.now(),
    });
  },

  claimRewards: async (amount: number) => {
    const state = get();
    if (state.rewardPoints >= amount) {
      set({
        rewardPoints: state.rewardPoints - amount,
      });
    }
  },
}));