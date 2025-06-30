import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Download, Eye, EyeOff, Wallet, Shield } from 'lucide-react-native';
import { useWalletStore } from '@/stores/walletStore';

interface WalletSetupProps {
  onComplete: () => void;
}

export default function WalletSetup({ onComplete }: WalletSetupProps) {
  const [mode, setMode] = useState<'select' | 'import' | 'create'>('select');
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { createWallet, importWallet } = useWalletStore();

  const handleCreateWallet = async () => {
    setIsCreating(true);
    try {
      await createWallet();
      Alert.alert(
        'Wallet Created!',
        'Your new Algorand wallet has been created successfully. Make sure to save your recovery phrase in a secure location.',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleImportWallet = async () => {
    if (!mnemonic.trim()) {
      Alert.alert('Error', 'Please enter your recovery phrase');
      return;
    }

    // Basic validation - Algorand uses 25-word mnemonics
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 25) {
      Alert.alert('Error', 'Recovery phrase must be exactly 25 words');
      return;
    }

    setIsImporting(true);
    try {
      await importWallet(mnemonic.trim());
      Alert.alert(
        'Wallet Imported!',
        'Your wallet has been imported successfully.',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid recovery phrase. Please check and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  if (mode === 'import') {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Download size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Import Wallet</Text>
              <Text style={styles.subtitle}>
                Enter your 25-word recovery phrase to restore your Algorand wallet
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Recovery Phrase</Text>
                <TextInput
                  style={styles.mnemonicInput}
                  placeholder="Enter your 25-word recovery phrase..."
                  placeholderTextColor="#9CA3AF"
                  value={mnemonic}
                  onChangeText={setMnemonic}
                  multiline
                  numberOfLines={4}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.inputHint}>
                  Words should be separated by spaces
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, { opacity: isImporting ? 0.7 : 1 }]}
                onPress={handleImportWallet}
                disabled={isImporting}
              >
                <Text style={styles.primaryButtonText}>
                  {isImporting ? 'Importing...' : 'Import Wallet'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMode('select')}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Wallet size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Welcome to BioPay</Text>
            <Text style={styles.subtitle}>
              Your AI-powered identity and payment platform on Algorand
            </Text>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleCreateWallet}
              disabled={isCreating}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.optionGradient}
              >
                <View style={styles.optionIcon}>
                  <Plus size={32} color="#3B82F6" />
                </View>
                <Text style={styles.optionTitle}>Create New Wallet</Text>
                <Text style={styles.optionDescription}>
                  Generate a new Algorand wallet with secure 25-word recovery phrase
                </Text>
                {isCreating && (
                  <Text style={styles.loadingText}>Creating wallet...</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setMode('import')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.optionGradient}
              >
                <View style={styles.optionIcon}>
                  <Download size={32} color="#10B981" />
                </View>
                <Text style={styles.optionTitle}>Import Existing Wallet</Text>
                <Text style={styles.optionDescription}>
                  Restore your wallet using your 25-word recovery phrase
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.securityNote}>
            <Shield size={20} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.securityText}>
              Your keys are stored securely on your device and never leave it
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 8,
    fontWeight: '500',
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  mnemonicInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  securityText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    flex: 1,
  },
});