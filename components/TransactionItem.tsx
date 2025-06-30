import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface TransactionItemProps {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  asset: string;
  timestamp: Date;
  address: string;
}

export default function TransactionItem({
  type,
  amount,
  asset,
  timestamp,
  address,
}: TransactionItemProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: type === 'sent' ? '#FEF3F2' : '#F0FDF4' }
      ]}>
        {type === 'sent' ? (
          <ArrowUpRight size={20} color="#EF4444" />
        ) : (
          <ArrowDownLeft size={20} color="#22C55E" />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {type === 'sent' ? 'Sent' : 'Received'}
          </Text>
          <Text style={[
            styles.amount,
            { color: type === 'sent' ? '#EF4444' : '#22C55E' }
          ]}>
            {type === 'sent' ? '-' : '+'}{amount} {asset}
          </Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});