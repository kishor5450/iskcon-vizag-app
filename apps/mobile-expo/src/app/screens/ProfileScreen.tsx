import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ProfileScreenProps {
  t: any;
  colors: any;
  lang: 'en' | 'te';
  setLang: (val: 'en' | 'te') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  t,
  colors,
  lang,
  setLang,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>👤 {t.profileTab}</Text>

      {/* Profile Card Info */}
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.textMain }]}>
          <Text style={styles.profileAvatarText}>A</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.textMain }]}>Arjun Das</Text>
        <Text style={[styles.profileEmail, { color: colors.textSub }]}>arjun@iskcondevotee.com</Text>
      </View>

      {/* Application Settings Option */}
      <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.settingsHeader, { color: colors.textMain }]}>⚙️ Settings</Text>
        
        {/* Language Switch */}
        <View style={styles.settingsRow}>
          <Text style={[styles.settingsLabel, { color: colors.textSub }]}>{t.language}</Text>
          <View style={styles.settingsBtnGroup}>
            <TouchableOpacity 
              onPress={() => setLang('en')} 
              style={[styles.settingsToggleBtn, lang === 'en' && { backgroundColor: colors.textMain }]}
            >
              <Text style={[styles.settingsBtnText, { color: lang === 'en' ? colors.pureWhite : colors.textSub }]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setLang('te')} 
              style={[styles.settingsToggleBtn, lang === 'te' && { backgroundColor: colors.textMain }]}
            >
              <Text style={[styles.settingsBtnText, { color: lang === 'te' ? colors.pureWhite : colors.textSub }]}>తెలుగు</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Mode Option */}
        <View style={styles.settingsRow}>
          <Text style={[styles.settingsLabel, { color: colors.textSub }]}>Color Theme</Text>
          <View style={styles.settingsBtnGroup}>
            <TouchableOpacity 
              onPress={() => setIsDarkMode(false)} 
              style={[styles.settingsToggleBtn, !isDarkMode && { backgroundColor: colors.textMain }]}
            >
              <Text style={[styles.settingsBtnText, { color: !isDarkMode ? colors.pureWhite : colors.textSub }]}>{t.lightMode}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsDarkMode(true)} 
              style={[styles.settingsToggleBtn, isDarkMode && { backgroundColor: colors.textMain }]}
            >
              <Text style={[styles.settingsBtnText, { color: isDarkMode ? colors.pureWhite : colors.textSub }]}>{t.darkMode}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 4,
  },
  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  settingsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingsBtnGroup: {
    flexDirection: 'row',
  },
  settingsToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    marginLeft: 6,
  },
  settingsBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
