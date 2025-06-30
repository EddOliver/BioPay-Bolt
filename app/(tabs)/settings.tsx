import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun, Shield, Bell, Globe, CircleHelp as HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react-native';
import { useThemeStore } from '@/stores/themeStore';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, colors } = useThemeStore();

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      type: 'navigation',
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage your security settings',
      icon: Shield,
      type: 'navigation',
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Change app language',
      icon: Globe,
      type: 'navigation',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      type: 'navigation',
    },
    {
      id: 'about',
      title: 'About BioPay',
      description: 'App version and information',
      icon: Info,
      type: 'navigation',
    },
  ];

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDarkMode ? ['#1E293B', '#334155'] : ['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Customize your BioPay experience
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Dark Mode Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                {isDarkMode ? (
                  <Moon size={24} color={colors.primary} />
                ) : (
                  <Sun size={24} color={colors.primary} />
                )}
              </View>
              
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
              
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ 
                  false: colors.border, 
                  true: colors.primary + '40' 
                }}
                thumbColor={isDarkMode ? colors.primary : colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {settingsOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.settingCard}
                activeOpacity={0.7}
              >
                <View style={styles.settingContent}>
                  <View style={styles.settingIcon}>
                    <IconComponent size={24} color={colors.primary} />
                  </View>
                  
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{option.title}</Text>
                    <Text style={styles.settingDescription}>
                      {option.description}
                    </Text>
                  </View>
                  
                  <ChevronRight size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={[styles.settingCard, styles.dangerCard]}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                <LogOut size={24} color={colors.error} />
              </View>
              
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.error }]}>
                  Sign Out
                </Text>
                <Text style={styles.settingDescription}>
                  Sign out of your BioPay account
                </Text>
              </View>
              
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>BioPay v1.0.0</Text>
          <Text style={styles.appInfoText}>
            Built with ❤️ on Algorand
          </Text>
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
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: colors.error + '20',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 24,
  },
  appInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});