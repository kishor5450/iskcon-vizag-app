/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { TRANSLATIONS } from '@temple/models';
import { HomeScreen } from './screens/HomeScreen';
import { SadhanaScreen } from './screens/SadhanaScreen';
import { UpdatesScreen } from './screens/UpdatesScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const App = () => {
  // App Theme & Language settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const t = TRANSLATIONS[lang];

  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'sadhana' | 'updates' | 'journey' | 'profile'>('home');

  // Japa State variables
  const [japaCount, setJapaCount] = useState<number>(0);
  const [japaRounds, setJapaRounds] = useState<number>(8);
  const [japaGoal] = useState<number>(16);

  // Sadhana Check-in States
  const [sadhanaJapa, setSadhanaJapa] = useState<boolean>(true);
  const [sadhanaReading, setSadhanaReading] = useState<boolean>(true);
  const [sadhanaArati, setSadhanaArati] = useState<boolean>(false);
  const [sadhanaPrayer, setSadhanaPrayer] = useState<boolean>(true);
  const [sadhanaLecture, setSadhanaLecture] = useState<boolean>(false);

  // Streaks statistics
  const [currentStreak, setCurrentStreak] = useState<number>(12);
  const [bestStreak] = useState<number>(27);
  const [thisMonthRounds] = useState<number>(192);

  // Updates Categories Filter
  const [activeUpdateFilter, setActiveUpdateFilter] = useState<'all' | 'festival' | 'temple' | 'classes' | 'seva'>('all');

  const sadhanaCompletedCount = [sadhanaJapa, sadhanaReading, sadhanaArati, sadhanaPrayer, sadhanaLecture].filter(Boolean).length;
  const sadhanaTotalCount = 5;

  // Japa Bead Counter logic
  const handleBeadPress = () => {
    if (japaCount >= 107) {
      setJapaCount(0);
      setJapaRounds(prev => prev + 1);
      if (japaRounds + 1 === 8) {
        setCurrentStreak(prev => prev + 1);
      }
    } else {
      setJapaCount(prev => prev + 1);
    }
  };

  // Color Tokens based on Light/Dark Mode
  const colors = {
    bg: isDarkMode ? '#120A2A' : '#FDFBF7',
    card: isDarkMode ? '#1A123D' : '#F7F3EB',
    cardBorder: isDarkMode ? '#2E245E' : '#E8DFCE',
    textMain: isDarkMode ? '#FFFFFF' : '#8C1D1D',
    textSub: isDarkMode ? '#C7BBE6' : '#5C5446',
    accentGold: '#D4AF37',
    accentGreen: '#27AE60',
    navBg: isDarkMode ? '#0F0824' : '#FFFFFF',
    navActive: '#D4AF37',
    navInactive: isDarkMode ? '#6E619E' : '#B0A38F',
    divider: isDarkMode ? '#271D54' : '#EBE5D8',
    pureWhite: '#FFFFFF',
    darkPurple: '#1F1545',
    creamAccent: '#FFFDF9',
  };

  // Generate bead coordinates in a circular fashion (27 beads loop)
  const beadCount = 27;
  const beads = [];
  const radius = 90;
  const cx = 110;
  const cy = 110;
  for (let i = 0; i < beadCount; i++) {
    const angle = (i * 2 * Math.PI) / beadCount - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    beads.push({ x, y, index: i });
  }

  const activeBeadIndex = Math.floor((japaCount / 108) * beadCount);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
        
        {/* TOP BRANDING BAR */}
        <View style={[styles.headerBar, { borderBottomColor: colors.divider }]}>
          <View style={styles.headerLogoContainer}>
            <View style={[styles.avatarDummy, { backgroundColor: colors.accentGold }]}>
              <Text style={styles.avatarText}>ॐ</Text>
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textMain }]}>ISKCON VIZAG</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSub }]}>My Bhakti. My Temple.</Text>
            </View>
          </View>
          
          <View style={styles.headerControls}>
            <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconButton}>
              <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setLang(prev => prev === 'en' ? 'te' : 'en')}
              style={[styles.langToggleBtn, { borderColor: colors.textMain }]}
            >
              <Text style={[styles.langToggleText, { color: colors.textMain }]}>
                {lang === 'en' ? 'తెలుగు' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN BODY CONTAINER WITH SCROLL */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'home' && (
            <HomeScreen 
              t={t}
              colors={colors}
              japaRounds={japaRounds}
              japaGoal={japaGoal}
              sadhanaCompletedCount={sadhanaCompletedCount}
              sadhanaTotalCount={sadhanaTotalCount}
              sadhanaJapa={sadhanaJapa}
              sadhanaReading={sadhanaReading}
              sadhanaArati={sadhanaArati}
              sadhanaPrayer={sadhanaPrayer}
              sadhanaLecture={sadhanaLecture}
              currentStreak={currentStreak}
              bestStreak={bestStreak}
              thisMonthRounds={thisMonthRounds}
              onNavigate={setActiveTab}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'sadhana' && (
            <SadhanaScreen 
              t={t}
              colors={colors}
              japaRounds={japaRounds}
              japaGoal={japaGoal}
              japaCount={japaCount}
              handleBeadPress={handleBeadPress}
              beads={beads}
              activeBeadIndex={activeBeadIndex}
              sadhanaJapa={sadhanaJapa}
              setSadhanaJapa={setSadhanaJapa}
              sadhanaReading={sadhanaReading}
              setSadhanaReading={setSadhanaReading}
              sadhanaArati={sadhanaArati}
              setSadhanaArati={setSadhanaArati}
              sadhanaPrayer={sadhanaPrayer}
              setSadhanaPrayer={setSadhanaPrayer}
              sadhanaLecture={sadhanaLecture}
              setSadhanaLecture={setSadhanaLecture}
              radius={radius}
            />
          )}

          {activeTab === 'updates' && (
            <UpdatesScreen 
              t={t}
              colors={colors}
              activeUpdateFilter={activeUpdateFilter}
              setActiveUpdateFilter={setActiveUpdateFilter}
            />
          )}

          {activeTab === 'journey' && (
            <JourneyScreen 
              t={t}
              colors={colors}
              currentStreak={currentStreak}
              bestStreak={bestStreak}
              thisMonthRounds={thisMonthRounds}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen 
              t={t}
              colors={colors}
              lang={lang}
              setLang={setLang}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
        </ScrollView>

        {/* BOTTOM TAB BAR */}
        <View style={[styles.navTabBar, { backgroundColor: colors.navBg, borderTopColor: colors.divider }]}>
          <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'home' ? colors.navActive : colors.navInactive }]}>🏠</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'home' ? colors.navActive : colors.navInactive }]}>{t.home}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('sadhana')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'sadhana' ? colors.navActive : colors.navInactive }]}>📿</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'sadhana' ? colors.navActive : colors.navInactive }]}>{t.sadhanaTab}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('updates')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'updates' ? colors.navActive : colors.navInactive }]}>📢</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'updates' ? colors.navActive : colors.navInactive }]}>{t.updatesTab}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('journey')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'journey' ? colors.navActive : colors.navInactive }]}>🌱</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'journey' ? colors.navActive : colors.navInactive }]}>{t.journeyTab}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'profile' ? colors.navActive : colors.navInactive }]}>👤</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'profile' ? colors.navActive : colors.navInactive }]}>{t.profileTab}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  headerBar: {
    height: 70,
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
  avatarDummy: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
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
  navTabBar: {
    height: 75,
    flexDirection: 'row',
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 15,
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabIcon: {
    fontSize: 22,
  },
  navTabText: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default App;
