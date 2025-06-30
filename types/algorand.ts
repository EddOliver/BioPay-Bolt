export interface AlgorandNetwork {
  id: string;
  name: string;
  algodUrl: string;
  indexerUrl: string;
  isMainNet: boolean;
}

export interface AssetInfo {
  id: number;
  name: string;
  unitName: string;
  decimals: number;
  total: number;
  balance: number;
  frozen: boolean;
  url?: string;
}

export interface TransactionResult {
  txId: string;
  confirmedRound?: number;
  error?: string;
}

export interface ContractMethod {
  name: string;
  args: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  returns: {
    type: string;
    description?: string;
  };
  description?: string;
}

export interface SmartContract {
  appId: number;
  name: string;
  description?: string;
  methods: ContractMethod[];
}