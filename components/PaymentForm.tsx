import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '@txnlab/use-wallet-react';
import { AlgoAmount } from '@algorandfoundation/algokit-utils';
import { Send, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { TransactionResult } from '@/types/algorand';

interface PaymentFormProps {
  onTransactionComplete?: (result: TransactionResult) => void;
}

export default function PaymentForm({ onTransactionComplete }: PaymentFormProps) {
  const { activeAccount, signTransactions, sendTransactions } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<TransactionResult | null>(null);

  const validateInputs = (): boolean => {
    if (!activeAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return false;
    }

    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter a recipient address');
      return false;
    }

    if (recipient.length !== 58) {
      Alert.alert('Error', 'Invalid Algorand address format');
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }

    if (parseFloat(amount) < 0.001) {
      Alert.alert('Error', 'Minimum amount is 0.001 ALGO');
      return false;
    }

    return true;
  };

  const handleSendPayment = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setLastTransaction(null);

    try {
      const algodClient = activeAccount?.providerId === 'pera' 
        ? (window as any).PeraWallet?.algodClient 
        : null;

      if (!algodClient) {
        throw new Error('Algod client not available');
      }

      // Get suggested transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();

      // Create payment transaction
      const txn = {
        from: activeAccount!.address,
        to: recipient.trim(),
        amount: AlgoAmount.Algos(parseFloat(amount)).microAlgos,
        note: note ? new TextEncoder().encode(note) : undefined,
        ...suggestedParams,
      };

      // Sign transaction
      const signedTxns = await signTransactions([txn]);

      // Send transaction
      const result = await sendTransactions(signedTxns);

      const transactionResult: TransactionResult = {
        txId: result.txId,
        confirmedRound: result.confirmedRound,
      };

      setLastTransaction(transactionResult);
      onTransactionComplete?.(transactionResult);

      // Clear form
      setRecipient('');
      setAmount('');
      setNote('');

      Alert.alert(
        'Payment Sent!',
        `Transaction ID: ${result.txId}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Payment failed:', error);
      const errorResult: TransactionResult = {
        txId: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      setLastTransaction(errorResult);
      Alert.alert('Payment Failed', errorResult.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeAccount) {
    return (
      <View style={styles.disconnectedContainer}>
        <AlertCircle size={48} color="#F59E0B" />
        <Text style={styles.disconnectedTitle}>Wallet Not Connected</Text>
        <Text style={styles.disconnectedText}>
          Please connect your wallet to send payments
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Algorand address (58 characters)"
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (ALGO)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.000"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputHint}>
            Minimum: 0.001 ALGO • Fee: ~0.001 ALGO
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Transaction note..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            { opacity: isLoading || !recipient || !amount ? 0.5 : 1 }
          ]}
          onPress={handleSendPayment}
          disabled={isLoading || !recipient || !amount}
        >
          <LinearGradient
            colors={['#3B82F6', '#1E40AF']}
            style={styles.sendButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={20} color="#FFFFFF" />
            )}
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Sending...' : 'Send Payment'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {lastTransaction && (
        <View style={[
          styles.transactionResult,
          { backgroundColor: lastTransaction.error ? '#FEF2F2' : '#F0FDF4' }
        ]}>
          <View style={styles.resultHeader}>
            {lastTransaction.error ? (
              <AlertCircle size={20} color="#DC2626" />
            ) : (
              <CheckCircle size={20} color="#10B981" />
            )}
            <Text style={[
              styles.resultTitle,
              { color: lastTransaction.error ? '#DC2626' : '#10B981' }
            ]}>
              {lastTransaction.error ? 'Transaction Failed' : 'Transaction Sent'}
            </Text>
          </View>
          
          {lastTransaction.error ? (
            <Text style={styles.errorText}>{lastTransaction.error}</Text>
          ) : (
            <View style={styles.successDetails}>
              <Text style={styles.txIdLabel}>Transaction ID:</Text>
              <Text style={styles.txIdValue}>{lastTransaction.txId}</Text>
              {lastTransaction.confirmedRound && (
                <Text style={styles.confirmationText}>
                  Confirmed in round {lastTransaction.confirmedRound}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  disconnectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  disconnectedText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionResult: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
  successDetails: {
    gap: 4,
  },
  txIdLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  txIdValue: {
    fontSize: 12,
    color: '#1F2937',
    fontFamily: 'monospace',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  confirmationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 4,
  },
});