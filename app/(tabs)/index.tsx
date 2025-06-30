import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Download, RefreshCw } from 'lucide-react-native';
import { useWalletStore } from '@/stores/walletStore';
import WalletSetup from '@/components/WalletSetup';
import AssetCard from '@/components/AssetCard';
import TransactionItem from '@/components/TransactionItem';

export default function HomeScreen() {
  const {
    isConnected,
    address,
    assets,
    transactions,
    totalUsdValue,
    refreshBalance,
  } = useWalletStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  }, [refreshBalance]);

  if (!isConnected) {
    return <WalletSetup onComplete={() => {}} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          {/* Badge and Logo Section */}
          <View style={styles.badgeContainer}>
            <View style={styles.badgeRow}>
              <Image
                source={{ uri: 'https://github.com/kickiniteasy/bolt-hackathon-badge/blob/main/black-circle-badge.png?raw=true' }}
                style={styles.hackathonBadge}
                resizeMode="contain"
                onError={(error) => console.log('Badge image failed to load:', error.nativeEvent.error)}
              />
              <Image
                source={{ uri: 'https://github.com/kickiniteasy/bolt-hackathon-badge/blob/main/algorand-logo.png?raw=true' }}
                style={styles.algorandLogo}
                resizeMode="contain"
                onError={(error) => console.log('Logo image failed to load:', error.nativeEvent.error)}
              />
            </View>
            <Text style={styles.badgeText}>Powered by Algorand • Bolt Hackathon</Text>
          </View>

          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.address}>
            {typeof address === 'string' ? `${address.slice(0, 6)}...${address.slice(-6)}` : ''}
          </Text>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
            <Text style={styles.balance}>${totalUsdValue.toFixed(2)}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Receive</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Assets Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assets</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.assetsScroll}
              contentContainerStyle={styles.assetsScrollContent}
            >
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  name={asset.name}
                  symbol={asset.symbol}
                  balance={asset.balance}
                  usdValue={asset.usdValue}
                  decimals={asset.decimals}
                />
              ))}
            </ScrollView>
          </View>

          {/* Recent Transactions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  id={transaction.id}
                  type={transaction.type}
                  amount={transaction.amount}
                  asset={transaction.asset}
                  timestamp={transaction.timestamp}
                  address={transaction.address}
                />
              ))}
            </View>
          </View>

          {/* Quick Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{assets.length}</Text>
                <Text style={styles.statLabel}>Assets</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{transactions.length}</Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {totalUsdValue > 0 ? '+12.5%' : '0%'}
                </Text>
                <Text style={styles.statLabel}>24h Change</Text>
              </View>
            </View>
          </View>

          {/* Network Info Section */}
          <View style={styles.section}>
            <View style={styles.networkCard}>
              <Text style={styles.networkTitle}>Network Information</Text>
              <View style={styles.networkInfo}>
                <View style={styles.networkItem}>
                  <Text style={styles.networkLabel}>Network:</Text>
                  <Text style={styles.networkValue}>Algorand Mainnet</Text>
                </View>
                <View style={styles.networkItem}>
                  <Text style={styles.networkLabel}>Block Time:</Text>
                  <Text style={styles.networkValue}>~4.5 seconds</Text>
                </View>
                <View style={styles.networkItem}>
                  <Text style={styles.networkLabel}>Transaction Fee:</Text>
                  <Text style={styles.networkValue}>0.001 ALGO</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 20,
  },
  hackathonBadge: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    padding: 4,
  },
  algorandLogo: {
    width: 160,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    minWidth: 80,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  assetsScroll: {
    marginHorizontal: -4,
  },
  assetsScrollContent: {
    paddingHorizontal: 4,
  },
  transactionsList: {
    gap: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  networkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  networkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  networkInfo: {
    gap: 8,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  networkLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  networkValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});