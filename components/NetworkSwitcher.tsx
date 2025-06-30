import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Globe, Check, X } from 'lucide-react-native';
import { ALGORAND_NETWORKS } from '@/config/algorand';
import { AlgorandNetwork } from '@/types/algorand';

interface NetworkSwitcherProps {
  currentNetwork: AlgorandNetwork;
  onNetworkChange: (network: AlgorandNetwork) => void;
}

export default function NetworkSwitcher({
  currentNetwork,
  onNetworkChange,
}: NetworkSwitcherProps) {
  const [showModal, setShowModal] = useState(false);

  const handleNetworkSelect = (network: AlgorandNetwork) => {
    onNetworkChange(network);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.networkButton}
        onPress={() => setShowModal(true)}
      >
        <View style={[
          styles.networkIndicator,
          { backgroundColor: currentNetwork.isMainNet ? '#10B981' : '#F59E0B' }
        ]} />
        <Text style={styles.networkText}>{currentNetwork.name}</Text>
        <Globe size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Network</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.networkList}>
              {ALGORAND_NETWORKS.map((network) => (
                <TouchableOpacity
                  key={network.id}
                  style={[
                    styles.networkOption,
                    currentNetwork.id === network.id && styles.selectedNetwork
                  ]}
                  onPress={() => handleNetworkSelect(network)}
                >
                  <View style={styles.networkInfo}>
                    <View style={[
                      styles.networkDot,
                      { backgroundColor: network.isMainNet ? '#10B981' : '#F59E0B' }
                    ]} />
                    <View style={styles.networkDetails}>
                      <Text style={styles.networkName}>{network.name}</Text>
                      <Text style={styles.networkUrl}>
                        {network.algodUrl.replace('https://', '')}
                      </Text>
                    </View>
                  </View>
                  {currentNetwork.id === network.id && (
                    <Check size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>
                MainNet uses real ALGO. TestNet is for development and testing.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  networkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  networkIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
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
  networkList: {
    padding: 20,
  },
  networkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedNetwork: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  networkDetails: {
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  networkUrl: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalFooter: {
    padding: 20,
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