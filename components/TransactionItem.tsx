import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { useThemeStore } from '@/stores/themeStore';

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
  const { colors } = useThemeStore();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: type === 'sent' ? colors.error + '20' : colors.success + '20' }
      ]}>
        {type === 'sent' ? (
          <ArrowUpRight size={20} color={colors.error} />
        ) : (
          <ArrowDownLeft size={20} color={colors.success} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {type === 'sent' ? 'Sent' : 'Received'}
          </Text>
          <Text style={[
            styles.amount,
            { color: type === 'sent' ? colors.error : colors.success }
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

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
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
    color: colors.text,
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
    color: colors.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});