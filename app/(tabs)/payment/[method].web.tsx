import CamFace from '@/components/camFace.web';
import { useWalletStore } from '@/stores/walletStore';
import { useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { fetch } from "expo/fetch";
import { ArrowLeft, Copy, QrCode, Scan, Send, Share2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Check } from 'lucide-react-native';
import ContextModule from '@/provider/contextModule';

export default function PaymentMethodScreen() {
  const { method } = useLocalSearchParams<{ method: string }>();
  const [amount, setAmount] = useState("10");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState('Hello Bolt!');
  const [showCamera, setShowCamera] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { sendPayment, address: walletAddress } = useWalletStore();
  const [stage, setStage] = useState(0);
  const [take, setTake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState('');
  const context = React.useContext(ContextModule);

  const getMethodInfo = () => {
    switch (method) {
      case 'address':
        return {
          title: 'Address Payment',
          description: 'Send payment to an Algorand address',
          icon: Send,
          color: ['#3B82F6', '#1E40AF'],
        };
      case 'qr':
        return {
          title: 'QR Payment',
          description: 'Scan a QR code to pay instantly',
          icon: Scan,
          color: ['#10B981', '#059669'],
        };
      case 'face':
        return {
          title: 'Face ID Request',
          description: 'Request payment using Face ID authentication',
          icon: User,
          color: ['#8B5CF6', '#7C3AED'],
        };
      default:
        return {
          title: 'Payment',
          description: 'Send payment',
          icon: Send,
          color: ['#3B82F6', '#1E40AF'],
        };
    }
  };

  const methodInfo = getMethodInfo();
  const IconComponent = methodInfo.icon;

  const handleSendPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (method === 'address' && !address.trim()) {
      Alert.alert('Error', 'Please enter a recipient address');
      return;
    }

    try {
      const txId = await sendPayment(
        address || 'DEMO_ADDRESS_FROM_QR',
        parseFloat(amount)
      );

      Alert.alert(
        'Payment Sent!',
        `Transaction ID: ${txId}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send payment');
    }
  };

  const handleCreatePaymentRequest = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setStage(1)
  };

  const handleQRScan = ({ data }: { data: string }) => {
    setShowCamera(false);
    // Parse Algorand payment URI
    if (data.startsWith('algorand://')) {
      const url = new URL(data);
      const recipient = url.pathname.replace('//', '');
      const amount = url.searchParams.get('amount');
      const note = url.searchParams.get('note');

      setAddress(recipient);
      if (amount) setAmount(amount);
      if (note) setNote(note);
    } else {
      setAddress(data);
    }
  };

  const startCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }
    }
    setShowCamera(true);
  };

  const copyPaymentRequest = async () => {
    if (paymentRequest) {
      // In a real app, you'd use Clipboard API
      Alert.alert('Copied!', 'Payment request copied to clipboard');
    }
  };

  const sharePaymentRequest = async () => {
    if (paymentRequest) {
      try {
        await Share.share({
          message: `Payment Request: ${paymentRequest}`,
          title: 'Algorand Payment Request',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share payment request');
      }
    }
  };

  async function findUserFaceID(image) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify({
      image,
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    return new Promise(resolve => {
      fetch("/api/getFaceID", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          resolve(result)
        })
        .catch((e) => resolve(console.log(e)));
    });
  }

  const submitTransaction = async (user) => {
    return new Promise(resolve => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        user,
        to: context.value.address,
        amount,
        note
      });
      console.log(raw);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("/api/submitPayment", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          resolve(result)
        })
        .catch((error) => console.error(error));
    })

  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={methodInfo.color}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <IconComponent size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{methodInfo.title}</Text>
          <Text style={styles.subtitle}>{methodInfo.description}</Text>
        </View>
      </LinearGradient>
      {
        stage === 0 && (
          <ScrollView style={styles.content}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (microAlgos)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>

              {method === 'address' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Recipient Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Algorand address..."
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={2}
                  />
                </View>
              )}

              {method === 'qr' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>QR Code Address</Text>
                  <View style={styles.addressContainer}>
                    <TextInput
                      style={[styles.input, styles.addressInput]}
                      placeholder="Scan QR code to fill address..."
                      value={address}
                      editable={false}
                    />
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={startCamera}
                    >
                      <Text style={styles.scanButtonText}>Scan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {method === 'face' && (
                <View style={styles.faceIdInfo}>
                  <Text style={styles.faceIdTitle}>Face ID Payment Request</Text>
                  <Text style={styles.faceIdDescription}>
                    Create a secure payment request authenticated with Face ID.
                    Others can scan the generated QR code to send you the requested amount.
                  </Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder={method === 'face' ? 'Payment request note...' : 'Payment note...'}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {method === 'face' ? (
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { opacity: !amount || parseFloat(amount) <= 0 ? 0.5 : 1 }
                  ]}
                  onPress={handleCreatePaymentRequest}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  <LinearGradient
                    colors={methodInfo.color}
                    style={styles.sendButtonGradient}
                  >
                    <User size={20} color="#FFFFFF" />
                    <Text style={styles.sendButtonText}>
                      Create Request with Face ID
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { opacity: !amount || parseFloat(amount) <= 0 ? 0.5 : 1 }
                  ]}
                  onPress={handleSendPayment}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  <LinearGradient
                    colors={methodInfo.color}
                    style={styles.sendButtonGradient}
                  >
                    <Send size={20} color="#FFFFFF" />
                    <Text style={styles.sendButtonText}>Send Payment</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {paymentRequest && (
                <View style={styles.paymentRequestCard}>
                  <Text style={styles.paymentRequestTitle}>Payment Request Created</Text>
                  <View style={styles.qrPlaceholder}>
                    <QrCode size={120} color="#8B5CF6" />
                    <Text style={styles.qrText}>QR Code</Text>
                  </View>

                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={copyPaymentRequest}
                    >
                      <Copy size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={sharePaymentRequest}
                    >
                      <Share2 size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.requestDetails}>
                    Amount: {amount} ALGO
                    {note && `\nNote: ${note}`}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                {method === 'face' ? 'Payment Request Information' : 'Payment Information'}
              </Text>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Network:</Text>
                <Text style={styles.infoValue}>Algorand Mainnet</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Fee:</Text>
                <Text style={styles.infoValue}>0.001 ALGO</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Confirmation Time:</Text>
                <Text style={styles.infoValue}>~4.5 seconds</Text>
              </View>
              {method === 'face' && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Authentication:</Text>
                  <Text style={styles.infoValue}>Face ID Required</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )
      }
      {
        stage === 1 && (
          <ScrollView contentContainerStyle={{ alignItems: 'center', marginTop: 20 }} style={[styles.content]}>
            <View
                style={{
                  height: "auto",
                  width: "80%",
                  marginVertical: 20,
                  borderWidth: 5,
                  borderRadius: 10,
                  aspectRatio: 1,
                }}
              >
                <CamFace
              facing={"front"}
              take={take}
              onImage={async (image) => {
                try {
                  const { result: user } = await findUserFaceID(image);
                  const { result: hash } = await submitTransaction(user);
                  setHash(hash)
                  setStage(2)
                } catch (error) {
                  console.log(error);
                }
              }}
            />
              </View>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: !amount || parseFloat(amount) <= 0 ? 0.5 : 1 }
              ]}
              onPress={() => {
                setLoading(true)
                setTake(true)
                setTimeout(() => {
                  setTake(false)
                }, 100)
              }}
            >
              <LinearGradient
                colors={methodInfo.color}
                style={styles.sendButtonGradient}
              >
                <User size={20} color="#FFFFFF" />
                <Text style={styles.sendButtonText}>
                  Pay with Face ID
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

        )
      }
      {
        stage === 2 && (
          <ScrollView contentContainerStyle={{ alignItems: 'center', marginTop: 20 }} style={[styles.content]}>
            <View style={styles.logoContainer}>
              <Check size={300} color="#8B5CF6" />
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: !amount || parseFloat(amount) <= 0 ? 0.5 : 1 }
              ]}
              onPress={() => {
                Linking.openURL(`https://explorer.perawallet.app/tx/` + hash);
              }}
            >
              <LinearGradient
                colors={methodInfo.color}
                style={styles.sendButtonGradient}
              >
                <User size={20} color="#FFFFFF" />
                <Text style={styles.sendButtonText}>
                  Open Explorer
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: 150,
    height: 300,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  form: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addressInput: {
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  faceIdInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  faceIdTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  faceIdDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
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
  paymentRequestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  paymentRequestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  qrPlaceholder: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  requestDetails: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});