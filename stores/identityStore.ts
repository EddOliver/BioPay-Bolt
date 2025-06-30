import { create } from 'zustand';

interface IdentityState {
  isVerified: boolean;
  trustScore: number;
  rewardPoints: number;
  verificationLevel: 'none' | 'basic' | 'enhanced' | 'premium';
  faceId: string | null;
  
  // Actions
  completeFaceVerification: () => Promise<void>;
  claimRewards: (amount: number) => Promise<void>;
}

export const useIdentityStore = create<IdentityState>((set, get) => ({
  isVerified: false,
  trustScore: 0,
  rewardPoints: 0,
  verificationLevel: 'none',
  faceId: null,

  completeFaceVerification: async () => {
    // Mock face verification process that handles both start and completion
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