import { create } from 'zustand';
import algosdk from 'algosdk';

interface Asset {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
  usdValue: number;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  asset: string;
  timestamp: Date;
  address: string;
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  mnemonic: string | null;
  account: algosdk.Account | null;
  balance: number;
  assets: Asset[];
  transactions: Transaction[];
  totalUsdValue: number;
  
  // Actions
  createWallet: () => Promise<void>;
  importWallet: (mnemonic: string) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  sendPayment: (to: string, amount: number, assetId?: number) => Promise<string>;
}

// Mock price data for demo purposes
const MOCK_PRICES = {
  ALGO: 1.60,
  USDC: 1.00,
};

// Mock Algorand client for demo (in production, use real client)
const createMockClient = () => ({
  accountInformation: async (address: string) => ({
    account: {
      amount: Math.floor(Math.random() * 50000000) + 10000000, // 10-60 ALGO
      assets: [
        {
          'asset-id': 31566704,
          amount: Math.floor(Math.random() * 100000000) + 50000000, // 50-150 USDC
        }
      ]
    }
  }),
  pendingTransactionInformation: async (txId: string) => ({
    'confirmed-round': Math.floor(Math.random() * 1000000) + 1000000,
  }),
});

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  address: null,
  mnemonic: null,
  account: null,
  balance: 0,
  assets: [],
  transactions: [],
  totalUsdValue: 0,

  createWallet: async () => {
    try {
      // Generate a new Algorand account
      const account = algosdk.generateAccount();
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      
      // Mock some initial data for demo
      const mockAssets: Asset[] = [
        {
          id: 0,
          name: 'Algorand',
          symbol: 'ALGO',
          balance: 25000000, // 25 ALGO (6 decimals)
          decimals: 6,
          usdValue: 25 * MOCK_PRICES.ALGO,
        },
        {
          id: 31566704,
          name: 'USD Coin',
          symbol: 'USDC',
          balance: 100000000, // 100 USDC (6 decimals)
          decimals: 6,
          usdValue: 100 * MOCK_PRICES.USDC,
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: 'DEMO_TXN_1',
          type: 'received',
          amount: 10,
          asset: 'ALGO',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          address: 'SENDER123...DEMO',
        },
        {
          id: 'DEMO_TXN_2',
          type: 'sent',
          amount: 5,
          asset: 'USDC',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          address: 'RECEIVER456...DEMO',
        },
        {
          id: 'DEMO_TXN_3',
          type: 'received',
          amount: 15,
          asset: 'ALGO',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          address: 'SENDER789...DEMO',
        },
      ];

      const totalValue = mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
      
      set({
        isConnected: true,
        address: account.addr,
        mnemonic,
        account,
        balance: mockAssets[0].balance,
        assets: mockAssets,
        transactions: mockTransactions,
        totalUsdValue: totalValue,
      });

      console.log('Wallet created successfully!');
      console.log('Address:', account.addr);
      console.log('Mnemonic:', mnemonic);
      
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }
  },

  importWallet: async (mnemonicPhrase: string) => {
    try {
      // Validate and import the mnemonic
      const account = algosdk.mnemonicToSecretKey(mnemonicPhrase.trim());
      
      // In a real app, you'd fetch actual balance from the network
      // For demo, we'll use mock data
      const mockAssets: Asset[] = [
        {
          id: 0,
          name: 'Algorand',
          symbol: 'ALGO',
          balance: 15500000, // 15.5 ALGO
          decimals: 6,
          usdValue: 15.5 * MOCK_PRICES.ALGO,
        },
        {
          id: 31566704,
          name: 'USD Coin',
          symbol: 'USDC',
          balance: 75000000, // 75 USDC
          decimals: 6,
          usdValue: 75 * MOCK_PRICES.USDC,
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: 'IMPORTED_TXN_1',
          type: 'received',
          amount: 20,
          asset: 'ALGO',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          address: 'SENDER111...DEMO',
        },
        {
          id: 'IMPORTED_TXN_2',
          type: 'sent',
          amount: 10,
          asset: 'USDC',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          address: 'RECEIVER222...DEMO',
        },
        {
          id: 'IMPORTED_TXN_3',
          type: 'received',
          amount: 5.5,
          asset: 'ALGO',
          timestamp: new Date(Date.now() - 43200000), // 12 hours ago
          address: 'SENDER333...DEMO',
        },
      ];

      const totalValue = mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
      
      set({
        isConnected: true,
        address: account.addr,
        mnemonic: mnemonicPhrase.trim(),
        account,
        balance: mockAssets[0].balance,
        assets: mockAssets,
        transactions: mockTransactions,
        totalUsdValue: totalValue,
      });

      console.log('Wallet imported successfully!');
      console.log('Address:', account.addr);
      
    } catch (error) {
      console.error('Error importing wallet:', error);
      throw new Error('Invalid recovery phrase');
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      address: null,
      mnemonic: null,
      account: null,
      balance: 0,
      assets: [],
      transactions: [],
      totalUsdValue: 0,
    });
    console.log('Wallet disconnected');
  },

  refreshBalance: async () => {
    const state = get();
    if (!state.address || !state.account) return;

    try {
      // In a real app, you'd query the Algorand network
      // For demo, we'll simulate balance changes
      const updatedAssets = state.assets.map(asset => {
        const randomChange = (Math.random() - 0.5) * 0.1; // ±5% change
        const newBalance = Math.max(0, asset.balance * (1 + randomChange));
        const newUsdValue = (newBalance / Math.pow(10, asset.decimals)) * 
          (asset.symbol === 'ALGO' ? MOCK_PRICES.ALGO : MOCK_PRICES.USDC);
        
        return {
          ...asset,
          balance: Math.floor(newBalance),
          usdValue: newUsdValue,
        };
      });

      const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

      set({
        assets: updatedAssets,
        balance: updatedAssets[0].balance,
        totalUsdValue: totalValue,
      });

      console.log('Balance refreshed');
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  },

  sendPayment: async (to: string, amount: number, assetId = 0) => {
    const state = get();
    if (!state.account) {
      throw new Error('No wallet connected');
    }

    try {
      // In a real app, you'd create and submit a transaction to the network
      // For demo, we'll simulate the transaction
      const txId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newTransaction: Transaction = {
        id: txId,
        type: 'sent',
        amount,
        asset: assetId === 0 ? 'ALGO' : 'USDC',
        timestamp: new Date(),
        address: `${to.slice(0, 6)}...${to.slice(-6)}`,
      };
      
      // Update transactions list
      set({
        transactions: [newTransaction, ...state.transactions.slice(0, 9)], // Keep last 10
      });

      console.log('Payment sent:', {
        to,
        amount,
        assetId,
        txId,
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return txId;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw new Error('Failed to send payment');
    }
  },
}));