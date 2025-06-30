import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '@txnlab/use-wallet-react';
import { Wallet, Send, Code, ArrowRight } from 'lucide-react-native';
import { DEFAULT_NETWORK } from '@/config/algorand';
import WalletConnector from '@/components/WalletConnector';
import NetworkSwitcher from '@/components/NetworkSwitcher';
import PaymentForm from '@/components/PaymentForm';
import ContractInteraction from '@/components/ContractInteraction';

type TabType = 'payment' | 'contract';

export default function ChargeScreen() {
  const { activeAccount } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('payment');
  const [currentNetwork, setCurrentNetwork] = useState(DEFAULT_NETWORK);

  if (!activeAccount) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <Text style={styles.title}>Payments & Contracts</Text>
          <Text style={styles.subtitle}>
            Send payments and interact with smart contracts
          </Text>
        </LinearGradient>

        <View style={styles.connectSection}>
          <Wallet size={64} color="#9CA3AF" />
          <Text style={styles.connectTitle}>Connect Your Wallet</Text>
          <Text style={styles.connectDescription}>
            Connect your Algorand wallet to send payments and interact with smart contracts on the blockchain.
          </Text>
          <WalletConnector onConnect={() => {}} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What You Can Do</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Send ALGO to any Algorand address instantly
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Low transaction fees (≈ 0.001 ALGO)
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Interact with Algorand smart contracts
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Support for MainNet and TestNet
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Payments & Contracts</Text>
            <Text style={styles.subtitle}>
              Send payments and interact with smart contracts
            </Text>
          </View>
          <NetworkSwitcher
            currentNetwork={currentNetwork}
            onNetworkChange={setCurrentNetwork}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'payment' && styles.activeTab
            ]}
            onPress={() => setActiveTab('payment')}
          >
            <Send size={20} color={activeTab === 'payment' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[
              styles.tabText,
              activeTab === 'payment' && styles.activeTabText
            ]}>
              Send Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'contract' && styles.activeTab
            ]}
            onPress={() => setActiveTab('contract')}
          >
            <Code size={20} color={activeTab === 'contract' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[
              styles.tabText,
              activeTab === 'contract' && styles.activeTabText
            ]}>
              Smart Contract
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.contentContainer}>
          {activeTab === 'payment' ? (
            <PaymentForm onTransactionComplete={(result) => {
              console.log('Transaction completed:', result);
            }} />
          ) : (
            <ContractInteraction network={currentNetwork} />
          )}
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
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  connectSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
});