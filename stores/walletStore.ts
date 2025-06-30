import { create } from 'zustand';

interface WalletState {
  // Legacy state for backward compatibility
  isConnected: boolean;
  address: string | null;
  
  // Actions
  setConnected: (connected: boolean, address?: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,

  setConnected: (connected: boolean, address?: string) => {
    set({
      isConnected: connected,
      address: address || null,
    });
  },

  disconnect: () => {
    set({
      isConnected: false,
      address: null,
    });
  },
}));