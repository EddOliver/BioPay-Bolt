import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AssetCardProps {
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
  decimals: number;
}

export default function AssetCard({
  name,
  symbol,
  balance,
  usdValue,
  decimals,
}: AssetCardProps) {
  const formatBalance = (balance: number, decimals: number) => {
    return (balance / Math.pow(10, decimals)).toFixed(decimals > 2 ? 2 : decimals);
  };

  return (
    <LinearGradient
      colors={symbol === 'ALGO' ? ['#3B82F6', '#1E40AF'] : ['#10B981', '#059669']}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balance}>
          {formatBalance(balance, decimals)} {symbol}
        </Text>
        <Text style={styles.usdValue}>
          ${usdValue.toFixed(2)} USD
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    minWidth: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbolContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbol: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  balanceContainer: {
    alignItems: 'flex-start',
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  usdValue: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});