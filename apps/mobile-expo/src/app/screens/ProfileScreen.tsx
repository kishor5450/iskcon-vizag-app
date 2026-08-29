import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { PreferredLanguage, AppTab } from '@temple/models';

interface ProfileScreenProps {
  t: any;
  colors: any;
  lang: PreferredLanguage;
  setLang: (val: PreferredLanguage) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  totalRoundsChanted?: number;
  currentStreak?: number;
  bestStreak?: number;
  onLogout: () => void;
  onNavigate: (tab: AppTab) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  t,
  colors,
  lang,
  setLang,
  isDarkMode,
  setIsDarkMode,
  userName = 'Arjun Das',
  userEmail = 'arjun@iskcondevotee.com',
  userPhone = '+91 98765 43210',
  totalRoundsChanted = 0,
  currentStreak = 0,
  bestStreak = 0,
  onLogout,
  onNavigate,
}) => {
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const menuItems = [
    { title: 'My Goals', desc: 'Daily targets and preferences', icon: '🎯', action: () => {} },
    { title: 'Reminders', desc: 'Manage your reminders', icon: '🔔', action: () => {} },
    { title: 'My Activity', desc: `Sadhana history (Total: ${totalRoundsChanted} rounds)`, icon: '📊', action: () => onNavigate(AppTab.JOURNEY) },
    { title: 'About ISKCON Vizag', desc: 'Temple info and timings', icon: 'ℹ️', action: () => setAboutModalVisible(true) },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Info */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={{ fontSize: 16 }}>✏️</Text>
          </TouchableOpacity>
          
          <View style={[styles.profileAvatar, { backgroundColor: colors.accentGold }]}>
            <Text style={styles.profileAvatarText}>ॐ</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.textMain }]}>{userName}</Text>
          <Text style={[styles.profileEmail, { color: colors.textSub }]}>{userEmail}</Text>
          <Text style={[styles.profilePhone, { color: colors.textSub }]}>{userPhone || 'No Phone Registered'}</Text>
        </View>

        {/* Streaks Widget */}
        <View style={[styles.streaksContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.streakColumn}>
            <Text style={[styles.streakNumber, { color: colors.textMain }]}>{currentStreak}</Text>
            <Text style={[styles.streakLabel, { color: colors.textSub }]}>Streak</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.streakColumn}>
            <Text style={[styles.streakNumber, { color: colors.textMain }]}>{bestStreak}</Text>
            <Text style={[styles.streakLabel, { color: colors.textSub }]}>Best Streak</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.streakColumn}>
            <Text style={[styles.streakNumber, { color: colors.accentGold }]}>{totalRoundsChanted}</Text>
            <Text style={[styles.streakLabel, { color: colors.textSub }]}>Total Rounds</Text>
          </View>
        </View>

        {/* Dynamic menu items list */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={item.action}
            >
              <View style={[styles.menuIconBg, { backgroundColor: colors.divider }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: colors.textMain }]}>{item.title}</Text>
                <Text style={[styles.menuDesc, { color: colors.textSub }]}>{item.desc}</Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSub }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferences and settings */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.settingsHeader, { color: colors.textMain }]}>⚙️ App Preferences</Text>
          
          {/* Language Toggle Row */}
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsLabelText, { color: colors.textSub }]}>Language</Text>
            <View style={styles.settingsBtnGroup}>
              <TouchableOpacity 
                onPress={() => setLang(PreferredLanguage.ENGLISH)} 
                style={[styles.settingsToggleBtn, lang === PreferredLanguage.ENGLISH && { backgroundColor: colors.accentGold, borderColor: colors.accentGold }]}
              >
                <Text style={[styles.settingsBtnText, { color: lang === PreferredLanguage.ENGLISH ? '#160826' : colors.textSub }]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setLang(PreferredLanguage.TELUGU)} 
                style={[styles.settingsToggleBtn, lang === PreferredLanguage.TELUGU && { backgroundColor: colors.accentGold, borderColor: colors.accentGold }]}
              >
                <Text style={[styles.settingsBtnText, { color: lang === PreferredLanguage.TELUGU ? '#160826' : colors.textSub }]}>తెలుగు</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setLang(PreferredLanguage.HINDI)} 
                style={[styles.settingsToggleBtn, lang === PreferredLanguage.HINDI && { backgroundColor: colors.accentGold, borderColor: colors.accentGold }]}
              >
                <Text style={[styles.settingsBtnText, { color: lang === PreferredLanguage.HINDI ? '#160826' : colors.textSub }]}>हिंदी</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme Mode Toggle Row */}
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsLabelText, { color: colors.textSub }]}>Dark Mode</Text>
            <View style={styles.settingsBtnGroup}>
              <TouchableOpacity 
                onPress={() => setIsDarkMode(false)} 
                style={[styles.settingsToggleBtn, !isDarkMode && { backgroundColor: colors.accentGold, borderColor: colors.accentGold }]}
              >
                <Text style={[styles.settingsBtnText, { color: !isDarkMode ? '#160826' : colors.textSub }]}>Off</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsDarkMode(true)} 
                style={[styles.settingsToggleBtn, isDarkMode && { backgroundColor: colors.accentGold, borderColor: colors.accentGold }]}
              >
                <Text style={[styles.settingsBtnText, { color: isDarkMode ? '#160826' : colors.textSub }]}>On</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.logoutBtn, { borderColor: colors.textMain }]}
            onPress={onLogout}
          >
            <Text style={[styles.logoutBtnText, { color: colors.textMain }]}>Log Out Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* About ISKCON Vizag Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: colors.textMain }]}>About ISKCON Vizag</Text>
            <Text style={[styles.modalText, { color: colors.textSub }]}>
              Sri Sri Radha Damodar Temple located in Visakhapatnam is a spiritual oasis for peace and bhakti.
              {"\n\n"}
              Temple Timings:
              {"\n"}• Mangala Arati: 4:15 AM
              {"\n"}• Darshan: 7:30 AM - 12:45 PM, 4:00 PM - 8:30 PM
              {"\n"}• Sandhya Arati: 7:00 PM
            </Text>
            <TouchableOpacity 
              style={[styles.modalCloseBtn, { backgroundColor: colors.accentGold }]}
              onPress={() => setAboutModalVisible(false)}
            >
              <Text style={[styles.modalCloseText, { color: '#160826' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 14,
    position: 'relative',
  },
  editBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    color: '#160826',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  streaksContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  streakColumn: {
    alignItems: 'center',
    width: '30%',
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  menuSection: {
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  settingsHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsLabelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingsBtnGroup: {
    flexDirection: 'row',
  },
  settingsToggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginLeft: 6,
  },
  settingsBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  logoutBtn: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalCloseBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
