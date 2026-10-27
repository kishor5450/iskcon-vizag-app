import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { PreferredLanguage } from '@temple/models';

interface AppHeaderProps {
  colors: any;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  lang: PreferredLanguage;
  onToggleLang: () => void;
  syncing: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  colors,
  isDarkMode,
  onToggleTheme,
  lang,
  onToggleLang,
  syncing,
}) => {
  return (
    <View style={[styles.headerBar, { borderBottomColor: colors.divider, backgroundColor: colors.bg }]}>
      <View style={styles.headerLogoContainer}>
        <Image
          source={require('../../../assets/images/iskcon_vizag_header_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View>
          <Text style={[styles.headerTitle, { color: colors.textMain }]}>ISKCON VIZAG</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSub }]}>My Bhakti. My Temple. My Family.</Text>
        </View>
      </View>

      <View style={styles.headerControls}>
        {syncing && <ActivityIndicator size="small" color={colors.accentGold} style={{ marginRight: 8 }} />}
        <TouchableOpacity onPress={onToggleTheme} style={styles.iconButton}>
          <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleLang}
          style={[styles.langToggleBtn, { borderColor: colors.accentGold }]}
        >
          <Text style={[styles.langToggleText, { color: colors.accentGold }]}>
            {lang === PreferredLanguage.ENGLISH ? 'తెలుగు' : lang === PreferredLanguage.TELUGU ? 'हिंदी' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 70,
    height: 70,
    marginRight: 12,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 11,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 5,
  },
  langToggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 15,
  },
  langToggleText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
