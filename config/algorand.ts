import { AlgorandNetwork } from '@/types/algorand';

export const ALGORAND_NETWORKS: AlgorandNetwork[] = [
  {
    id: 'mainnet',
    name: 'MainNet',
    algodUrl: 'https://mainnet-api.algonode.cloud',
    indexerUrl: 'https://mainnet-idx.algonode.cloud',
    isMainNet: true,
  },
  {
    id: 'testnet',
    name: 'TestNet',
    algodUrl: 'https://testnet-api.algonode.cloud',
    indexerUrl: 'https://testnet-idx.algonode.cloud',
    isMainNet: false,
  },
];

export const DEFAULT_NETWORK = ALGORAND_NETWORKS[1]; // TestNet for development

export const WALLET_PROVIDERS = [
  'pera',
  'defly',
  'exodus',
  'lute',
] as const;

export type WalletProvider = typeof WALLET_PROVIDERS[number];