import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Shield,
  Star,
  Gift,
  Camera,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react-native';
import { useIdentityStore } from '@/stores/identityStore';

export default function IdentityScreen() {
  const {
    isVerified,
    trustScore,
    rewardPoints,
    verificationLevel,
    startVerification,
    completeFaceVerification,
    claimRewards,
  } = useIdentityStore();

  const handleStartVerification = async () => {
    try {
      await startVerification();
      Alert.alert('Success', 'Basic verification started!');
    } catch (error) {
      Alert.alert('Error', 'Failed to start verification');
    }
  };

  const handleFaceVerification = async () => {
    try {
      await completeFaceVerification();
      Alert.alert('Success', 'Face verification completed! You earned 100 reward points.');
    } catch (error) {
      Alert.alert('Error', 'Face verification failed');
    }
  };

  const handleClaimRewards = async () => {
    if (rewardPoints < 50) {
      Alert.alert('Insufficient Points', 'You need at least 50 points to claim rewards');
      return;
    }

    try {
      await claimRewards(50);
      Alert.alert('Success', 'Claimed 0.5 ALGO rewards!');
    } catch (error) {
      Alert.alert('Error', 'Failed to claim rewards');
    }
  };

  const getVerificationColor = () => {
    switch (verificationLevel) {
      case 'premium':
        return '#10B981';
      case 'enhanced':
        return '#3B82F6';
      case 'basic':
        return '#F59E0B';
      default:
        return '#EF4444';
    }
  };

  const getVerificationIcon = () => {
    return isVerified ? CheckCircle : XCircle;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Identity</Text>
        <Text style={styles.subtitle}>
          Proof-of-humanity verification platform
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Verification Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIcon,
              { backgroundColor: getVerificationColor() + '20' }
            ]}>
              {React.createElement(getVerificationIcon(), {
                size: 24,
                color: getVerificationColor(),
              })}
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                Verification Status
              </Text>
              <Text style={[
                styles.statusLevel,
                { color: getVerificationColor() }
              ]}>
                {verificationLevel.charAt(0).toUpperCase() + verificationLevel.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Trust Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Star size={24} color="#F59E0B" />
            <Text style={styles.scoreTitle}>Trust Score</Text>
          </View>
          <Text style={styles.scoreValue}>{trustScore}/100</Text>
          <View style={styles.scoreBar}>
            <View
              style={[
                styles.scoreProgress,
                { width: `${trustScore}%` }
              ]}
            />
          </View>
        </View>

        {/* Rewards */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsHeader}>
            <Gift size={24} color="#8B5CF6" />
            <Text style={styles.rewardsTitle}>Reward Points</Text>
          </View>
          <Text style={styles.rewardsValue}>{rewardPoints}</Text>
          <TouchableOpacity
            style={[
              styles.claimButton,
              { opacity: rewardPoints >= 50 ? 1 : 0.5 }
            ]}
            onPress={handleClaimRewards}
            disabled={rewardPoints < 50}
          >
            <Text style={styles.claimButtonText}>
              Claim 0.5 ALGO (50 pts)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verification Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Verification Actions</Text>
          
          {!isVerified && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleFaceVerification}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.actionGradient}
              >
                <Camera size={32} color="#FFFFFF" />
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>
                    Face Verification
                  </Text>
                  <Text style={styles.actionDescription}>
                    Complete biometric verification and earn 100 points
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {verificationLevel === 'none' && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleStartVerification}
            >
              <LinearGradient
                colors={['#3B82F6', '#1E40AF']}
                style={styles.actionGradient}
              >
                <Shield size={32} color="#FFFFFF" />
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>
                    Start Verification
                  </Text>
                  <Text style={styles.actionDescription}>
                    Begin your identity verification journey
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Verification Benefits</Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.benefitText}>
                Lower transaction fees for verified users
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Gift size={20} color="#8B5CF6" />
              <Text style={styles.benefitText}>
                Earn ALGO rewards for maintaining verification
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Shield size={20} color="#3B82F6" />
              <Text style={styles.benefitText}>
                Access to premium BioPay features
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Star size={20} color="#F59E0B" />
              <Text style={styles.benefitText}>
                Higher trust score in the network
              </Text>
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 12,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  rewardsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  rewardsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  benefitsSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  benefitsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});