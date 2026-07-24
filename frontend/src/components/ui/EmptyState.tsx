import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Ghost, Inbox, BellOff } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'ghost' | 'inbox' | 'bell';
}

export default function EmptyState({ title, description, icon = 'ghost' }: EmptyStateProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'inbox': return <Inbox size={64} color={Colors.border} />;
      case 'bell': return <BellOff size={64} color={Colors.border} />;
      case 'ghost': default: return <Ghost size={64} color={Colors.border} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
