import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, QrCode, User, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemeStore } from '@/stores/themeStore';

export default function ChargeScreen() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const { colors, isDarkMode } = useThemeStore();

  const paymentMethods = [
    {
      id: 'address',
      title: 'Address Payment',
      description: 'Send payment to an Algorand address',
      icon: Wallet,
      gradient: ['#3B82F6', '#1E40AF'],
    },
    {
      id: 'qr',
      title: 'QR Payment',
      description: 'Scan a QR code to pay instantly',
      icon: QrCode,
      gradient: ['#10B981', '#059669'],
    },
    {
      id: 'face',
      title: 'Face ID Request',
      description: 'Request payment using Face ID authentication',
      icon: User,
      gradient: ['#8B5CF6', '#7C3AED'],
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    // Navigate to specific payment screen
    router.push(`/payment/${methodId}` as any);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDarkMode ? ['#1E293B', '#334155'] : ['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Payments</Text>
        <Text style={styles.subtitle}>
          Send payments or request funds
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <TouchableOpacity
                key={method.id}
                style={styles.methodCard}
                onPress={() => handleMethodSelect(method.id)}
              >
                <LinearGradient
                  colors={method.gradient}
                  style={styles.methodGradient}
                >
                  <View style={styles.methodContent}>
                    <View style={styles.methodIcon}>
                      <IconComponent size={32} color="#FFFFFF" />
                    </View>
                    
                    <View style={styles.methodText}>
                      <Text style={styles.methodTitle}>{method.title}</Text>
                      <Text style={styles.methodDescription}>
                        {method.description}
                      </Text>
                    </View>
                    
                    <ArrowRight size={24} color="rgba(255, 255, 255, 0.7)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Payment Features</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Instant settlement on Algorand blockchain
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
                AI-powered Face ID for secure payment requests
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>
                Support for ALGO, USDC, and other ASAs
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  methodsContainer: {
    marginTop: 24,
    gap: 16,
  },
  methodCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  methodGradient: {
    padding: 20,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodText: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  infoSection: {
    marginTop: 32,
    backgroundColor: colors.card,
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
    color: colors.text,
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
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});