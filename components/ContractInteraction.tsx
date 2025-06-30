import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '@txnlab/use-wallet-react';
import { Code, Play, AlertCircle, CheckCircle } from 'lucide-react-native';
import { SmartContract, ContractMethod } from '@/types/algorand';

interface ContractInteractionProps {
  network: {
    algodUrl: string;
    indexerUrl: string;
    isMainNet: boolean;
  };
}

// Mock smart contract for demo
const DEMO_CONTRACT: SmartContract = {
  appId: 123456789,
  name: 'Demo Counter Contract',
  description: 'A simple counter smart contract for demonstration',
  methods: [
    {
      name: 'increment',
      args: [],
      returns: { type: 'void', description: 'Increments the counter by 1' },
      description: 'Increment the global counter',
    },
    {
      name: 'decrement',
      args: [],
      returns: { type: 'void', description: 'Decrements the counter by 1' },
      description: 'Decrement the global counter',
    },
    {
      name: 'add',
      args: [
        { name: 'value', type: 'uint64', description: 'Value to add to counter' },
      ],
      returns: { type: 'void', description: 'Adds value to the counter' },
      description: 'Add a specific value to the counter',
    },
    {
      name: 'getCounter',
      args: [],
      returns: { type: 'uint64', description: 'Current counter value' },
      description: 'Get the current counter value',
    },
  ],
};

export default function ContractInteraction({ network }: ContractInteractionProps) {
  const { activeAccount } = useWallet();
  const [selectedMethod, setSelectedMethod] = useState<ContractMethod | null>(null);
  const [methodArgs, setMethodArgs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
    txId?: string;
  } | null>(null);

  const handleMethodSelect = (method: ContractMethod) => {
    setSelectedMethod(method);
    setMethodArgs({});
    setResult(null);
  };

  const handleArgChange = (argName: string, value: string) => {
    setMethodArgs(prev => ({
      ...prev,
      [argName]: value,
    }));
  };

  const validateArgs = (): boolean => {
    if (!selectedMethod) return false;

    for (const arg of selectedMethod.args) {
      const value = methodArgs[arg.name];
      if (!value || value.trim() === '') {
        Alert.alert('Error', `Please provide a value for ${arg.name}`);
        return false;
      }

      if (arg.type === 'uint64') {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 0) {
          Alert.alert('Error', `${arg.name} must be a positive integer`);
          return false;
        }
      }
    }

    return true;
  };

  const executeMethod = async () => {
    if (!activeAccount || !selectedMethod) return;

    if (selectedMethod.args.length > 0 && !validateArgs()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // In a real implementation, you would use algokit-utils to call the smart contract
      // For demo purposes, we'll simulate the contract interaction
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      // Mock successful response
      const mockResult = {
        success: true,
        txId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        data: selectedMethod.name === 'getCounter' 
          ? Math.floor(Math.random() * 1000) 
          : undefined,
      };

      setResult(mockResult);

      Alert.alert(
        'Contract Call Successful',
        `Method: ${selectedMethod.name}\n${mockResult.txId ? `Transaction ID: ${mockResult.txId}` : ''}${mockResult.data !== undefined ? `\nResult: ${mockResult.data}` : ''}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      setResult(errorResult);
      Alert.alert('Contract Call Failed', errorResult.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeAccount) {
    return (
      <View style={styles.disconnectedContainer}>
        <Code size={48} color="#F59E0B" />
        <Text style={styles.disconnectedTitle}>Wallet Not Connected</Text>
        <Text style={styles.disconnectedText}>
          Please connect your wallet to interact with smart contracts
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contractInfo}>
        <Text style={styles.contractTitle}>{DEMO_CONTRACT.name}</Text>
        <Text style={styles.contractDescription}>{DEMO_CONTRACT.description}</Text>
        <View style={styles.contractDetails}>
          <Text style={styles.contractLabel}>App ID: {DEMO_CONTRACT.appId}</Text>
          <Text style={styles.contractLabel}>
            Network: {network.isMainNet ? 'MainNet' : 'TestNet'}
          </Text>
        </View>
      </View>

      <View style={styles.methodsSection}>
        <Text style={styles.sectionTitle}>Available Methods</Text>
        <View style={styles.methodsList}>
          {DEMO_CONTRACT.methods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.methodCard,
                selectedMethod?.name === method.name && styles.selectedMethod
              ]}
              onPress={() => handleMethodSelect(method)}
            >
              <Text style={[
                styles.methodName,
                selectedMethod?.name === method.name && styles.selectedMethodText
              ]}>
                {method.name}
              </Text>
              <Text style={styles.methodDescription}>
                {method.description}
              </Text>
              <View style={styles.methodSignature}>
                <Text style={styles.signatureText}>
                  {method.name}({method.args.map(arg => `${arg.name}: ${arg.type}`).join(', ')})
                  {method.returns.type !== 'void' && ` → ${method.returns.type}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedMethod && (
        <View style={styles.executionSection}>
          <Text style={styles.sectionTitle}>Execute Method</Text>
          
          {selectedMethod.args.length > 0 && (
            <View style={styles.argsSection}>
              <Text style={styles.argsTitle}>Method Arguments</Text>
              {selectedMethod.args.map((arg, index) => (
                <View key={index} style={styles.argInput}>
                  <Text style={styles.argLabel}>
                    {arg.name} ({arg.type})
                  </Text>
                  {arg.description && (
                    <Text style={styles.argDescription}>{arg.description}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter ${arg.name}...`}
                    value={methodArgs[arg.name] || ''}
                    onChangeText={(value) => handleArgChange(arg.name, value)}
                    keyboardType={arg.type === 'uint64' ? 'numeric' : 'default'}
                  />
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.executeButton,
              { opacity: isLoading ? 0.7 : 1 }
            ]}
            onPress={executeMethod}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.executeGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" />
              )}
              <Text style={styles.executeText}>
                {isLoading ? 'Executing...' : `Call ${selectedMethod.name}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={[
          styles.resultSection,
          { backgroundColor: result.success ? '#F0FDF4' : '#FEF2F2' }
        ]}>
          <View style={styles.resultHeader}>
            {result.success ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <AlertCircle size={20} color="#DC2626" />
            )}
            <Text style={[
              styles.resultTitle,
              { color: result.success ? '#10B981' : '#DC2626' }
            ]}>
              {result.success ? 'Method Executed Successfully' : 'Method Execution Failed'}
            </Text>
          </View>

          {result.success ? (
            <View style={styles.successDetails}>
              {result.txId && (
                <>
                  <Text style={styles.resultLabel}>Transaction ID:</Text>
                  <Text style={styles.resultValue}>{result.txId}</Text>
                </>
              )}
              {result.data !== undefined && (
                <>
                  <Text style={styles.resultLabel}>Return Value:</Text>
                  <Text style={styles.resultValue}>{JSON.stringify(result.data)}</Text>
                </>
              )}
            </View>
          ) : (
            <Text style={styles.errorText}>{result.error}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  contractInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contractTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contractDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  contractDetails: {
    gap: 4,
  },
  contractLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  methodsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedMethod: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3F4F6',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedMethodText: {
    color: '#8B5CF6',
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  methodSignature: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  signatureText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
  },
  executionSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  argsSection: {
    marginBottom: 24,
  },
  argsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  argInput: {
    marginBottom: 16,
  },
  argLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  argDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  executeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  executeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  executeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    margin: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  successDetails: {
    gap: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
});