import React, { createContext, useContext, ReactNode } from 'react';
import { WalletProvider, useInitializeProviders, PROVIDER_ID } from '@txnlab/use-wallet-react';
import { PeraWalletConnect } from '@perawallet/connect';
import { LuteConnect } from 'lute-connect';
import { DEFAULT_NETWORK } from '@/config/algorand';

interface AlgorandProviderProps {
  children: ReactNode;
}

const AlgorandContext = createContext<{
  network: typeof DEFAULT_NETWORK;
}>({
  network: DEFAULT_NETWORK,
});

export const useAlgorand = () => {
  const context = useContext(AlgorandContext);
  if (!context) {
    throw new Error('useAlgorand must be used within AlgorandProvider');
  }
  return context;
};

export function AlgorandProvider({ children }: AlgorandProviderProps) {
  const providers = useInitializeProviders({
    providers: [
      {
        id: PROVIDER_ID.PERA,
        clientStatic: PeraWalletConnect,
        clientOptions: {
          chainId: DEFAULT_NETWORK.isMainNet ? 416001 : 416002,
        },
      },
      {
        id: PROVIDER_ID.LUTE,
        clientStatic: LuteConnect,
        clientOptions: {
          siteName: 'BioPay',
        },
      },
    ],
    nodeConfig: {
      network: DEFAULT_NETWORK.isMainNet ? 'mainnet' : 'testnet',
      nodeServer: DEFAULT_NETWORK.algodUrl,
      nodeToken: '',
      nodePort: '443',
    },
    algosdkStatic: require('algosdk'),
  });

  return (
    <WalletProvider value={providers}>
      <AlgorandContext.Provider value={{ network: DEFAULT_NETWORK }}>
        {children}
      </AlgorandContext.Provider>
    </WalletProvider>
  );
}