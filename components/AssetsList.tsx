import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useWallet } from '@txnlab/use-wallet-react';
import { getAlgodConfigFromViteEnvironment } from '@algorandfoundation/algokit-utils';
import { Coins, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import { AssetInfo } from '@/types/algorand';

interface AssetsListProps {
  network: {
    algodUrl: string;
    indexerUrl: string;
    isMainNet: boolean;
  };
}

export default function AssetsList({ network }: AssetsListProps) {
  const { activeAccount } = useWallet();
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssets = async () => {
    if (!activeAccount) return;

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would use algokit-utils to fetch account information
      // For now, we'll simulate the data structure
      const mockAssets: AssetInfo[] = [
        {
          id: 0,
          name: 'Algorand',
          unitName: 'ALGO',
          decimals: 6,
          total: 0,
          balance: Math.floor(Math.random() * 100000000) + 1000000, // 1-100 ALGO
          frozen: false,
        },
        {
          id: 31566704,
          name: 'USD Coin',
          unitName: 'USDC',
          decimals: 6,
          total: 0,
          balance: Math.floor(Math.random() * 50000000) + 10000000, // 10-60 USDC
          frozen: false,
        },
      ];

      setAssets(mockAssets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAssets();
    setRefreshing(false);
  };

  useEffect(() => {
    if (activeAccount) {
      fetchAssets();
    } else {
      setAssets([]);
      setError(null);
    }
  }, [activeAccount, network]);

  const formatBalance = (balance: number, decimals: number): string => {
    return (balance / Math.pow(10, decimals)).toFixed(decimals > 2 ? 2 : decimals);
  };

  const getAssetValue = (asset: AssetInfo): number => {
    // Mock USD values for demo
    const prices: Record<string, number> = {
      'ALGO': 1.60,
      'USDC': 1.00,
    };
    
    const balance = asset.balance / Math.pow(10, asset.decimals);
    return balance * (prices[asset.unitName] || 0);
  };

  if (!activeAccount) {
    return (
      <View style={styles.emptyContainer}>
        <Coins size={48} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>No Wallet Connected</Text>
        <Text style={styles.emptyText}>
          Connect your wallet to view your assets
        </Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading assets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Failed to Load Assets</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const totalValue = assets.reduce((sum, asset) => sum + getAssetValue(asset), 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Assets</Text>
        <View style={styles.totalValue}>
          <Text style={styles.totalLabel}>Total Value</Text>
          <Text style={styles.totalAmount}>${totalValue.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.assetsList}>
        {assets.map((asset) => (
          <View key={asset.id} style={styles.assetCard}>
            <View style={styles.assetHeader}>
              <View style={[
                styles.assetIcon,
                { backgroundColor: asset.unitName === 'ALGO' ? '#3B82F6' : '#10B981' }
              ]}>
                <Text style={styles.assetSymbol}>
                  {asset.unitName.slice(0, 2)}
                </Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetUnit}>{asset.unitName}</Text>
              </View>
              <View style={styles.assetBalance}>
                <Text style={styles.balanceAmount}>
                  {formatBalance(asset.balance, asset.decimals)}
                </Text>
                <Text style={styles.balanceValue}>
                  ${getAssetValue(asset).toFixed(2)}
                </Text>
              </View>
            </View>

            {asset.frozen && (
              <View style={styles.frozenBanner}>
                <AlertCircle size={16} color="#F59E0B" />
                <Text style={styles.frozenText}>Asset is frozen</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.networkInfo}>
        <Text style={styles.networkLabel}>Network: {network.isMainNet ? 'MainNet' : 'TestNet'}</Text>
        <Text style={styles.addressLabel}>
          Address: {`${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-6)}`}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  totalValue: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  assetsList: {
    padding: 24,
    gap: 16,
  },
  assetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  assetSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  assetUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  assetBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  frozenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    gap: 6,
  },
  frozenText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  networkInfo: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  networkLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});