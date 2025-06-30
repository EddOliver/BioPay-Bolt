import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '@txnlab/use-wallet-react';
import { Wallet, X, Smartphone, Globe, Shield } from 'lucide-react-native';

interface WalletConnectorProps {
  onConnect?: () => void;
}

export default function WalletConnector({ onConnect }: WalletConnectorProps) {
  const { providers, activeAccount } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (providerId: string) => {
    setConnecting(providerId);
    try {
      const provider = providers?.find(p => p.metadata.id === providerId);
      if (provider) {
        await provider.connect();
        setShowModal(false);
        onConnect?.();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      const activeProvider = providers?.find(p => p.isActive);
      if (activeProvider) {
        await activeProvider.disconnect();
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const getWalletIcon = (providerId: string) => {
    switch (providerId) {
      case 'pera':
        return <Smartphone size={24} color="#FFFFFF" />;
      case 'lute':
        return <Globe size={24} color="#FFFFFF" />;
      default:
        return <Wallet size={24} color="#FFFFFF" />;
    }
  };

  if (activeAccount) {
    return (
      <View style={styles.connectedContainer}>
        <View style={styles.accountInfo}>
          <View style={styles.accountIcon}>
            <Shield size={20} color="#10B981" />
          </View>
          <View style={styles.accountDetails}>
            <Text style={styles.accountLabel}>Connected</Text>
            <Text style={styles.accountAddress}>
              {`${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-6)}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={handleDisconnect}
        >
          <Text style={styles.disconnectText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => setShowModal(true)}
      >
        <LinearGradient
          colors={['#3B82F6', '#1E40AF']}
          style={styles.connectGradient}
        >
          <Wallet size={20} color="#FFFFFF" />
          <Text style={styles.connectText}>Connect Wallet</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connect Wallet</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.walletList}>
              {providers?.map((provider) => (
                <TouchableOpacity
                  key={provider.metadata.id}
                  style={[
                    styles.walletOption,
                    { opacity: connecting === provider.metadata.id ? 0.7 : 1 }
                  ]}
                  onPress={() => handleConnect(provider.metadata.id)}
                  disabled={connecting === provider.metadata.id}
                >
                  <View style={styles.walletIcon}>
                    {getWalletIcon(provider.metadata.id)}
                  </View>
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletName}>
                      {provider.metadata.name}
                    </Text>
                    <Text style={styles.walletDescription}>
                      {connecting === provider.metadata.id
                        ? 'Connecting...'
                        : `Connect with ${provider.metadata.name}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>
                By connecting a wallet, you agree to BioPay's Terms of Service
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  connectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 2,
  },
  accountAddress: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  disconnectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  disconnectText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletList: {
    paddingHorizontal: 24,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  walletDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});