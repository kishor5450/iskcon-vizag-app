/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TRANSLATIONS, IDevotee, SadhanaLogRequestDto, ISadhanaRecord, IAnnouncement, PreferredLanguage, AppTab, DevoteeRole } from '@temple/models';
import { HomeScreen } from './screens/HomeScreen';
import { SadhanaScreen } from './screens/SadhanaScreen';
import { UpdatesScreen } from './screens/UpdatesScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthScreen } from './screens/AuthScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { AdminScreen } from './screens/AdminScreen';
import { api } from './utils/api';

export const App = () => {
  // Authentication State
  const [jwtToken, setJwtToken] = useState<string>('');
  const [devotee, setDevotee] = useState<IDevotee | null>(null);

  // App Theme & Language settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // default to dark mode
  const [lang, setLang] = useState<PreferredLanguage>(PreferredLanguage.ENGLISH);
  const t = TRANSLATIONS[lang];

  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);

  // Loading state
  const [syncing, setSyncing] = useState<boolean>(false);

  // Japa State variables
  const [japaCount, setJapaCount] = useState<number>(0);
  const [japaRounds, setJapaRounds] = useState<number>(0);
  const [japaGoal, setJapaGoal] = useState<number>(16);

  // Sadhana Check-in States
  const [sadhanaJapa, setSadhanaJapa] = useState<boolean>(false);
  const [sadhanaReading, setSadhanaReading] = useState<boolean>(false);
  const [sadhanaArati, setSadhanaArati] = useState<boolean>(false);
  const [sadhanaPrayer, setSadhanaPrayer] = useState<boolean>(false);
  const [sadhanaLecture, setSadhanaLecture] = useState<boolean>(false);
  const [nbsJoined, setNbsJoined] = useState<boolean>(false);

  // Month/Week Statistics & Updates Category Filter
  const [thisMonthRounds, setThisMonthRounds] = useState<number>(0);
  const [thisWeekRounds, setThisWeekRounds] = useState<number>(0);
  const [activeUpdateFilter, setActiveUpdateFilter] = useState<'all' | 'festival' | 'temple' | 'classes' | 'seva'>('all');
  const [history, setHistory] = useState<ISadhanaRecord[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [readingProgress, setReadingProgress] = useState<string>('Bhagavad-gita 2.20');

  // Date helper (YYYY-MM-DD local timezone)
  const getLocalDateString = (offsetDays = 0) => {
    const d = new Date();
    if (offsetDays !== 0) {
      d.setDate(d.getDate() + offsetDays);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();

  // Load today's record and user profile upon tab change or login
  const syncSadhanaLogs = async (token: string, dateStr: string) => {
    try {
      setSyncing(true);
      const record = await api.getTodayRecord(token, dateStr);
      if (record) {
        setJapaRounds(record.japaRoundsCount);
        setSadhanaJapa(record.japaRoundsCount >= japaGoal);
        setSadhanaReading(record.readingCompleted);
        setSadhanaArati(record.mangalaArati);
        setSadhanaPrayer(record.morningPrayer);
        setSadhanaLecture(record.spiritualLecture);
        setNbsJoined(record.nbsJoined || false);
      } else {
        // Reset states for a fresh day
        setJapaRounds(0);
        setSadhanaJapa(false);
        setSadhanaReading(false);
        setSadhanaArati(false);
        setSadhanaPrayer(false);
        setSadhanaLecture(false);
        setNbsJoined(false);
      }

      // Re-fetch profile to sync streaks and details
      const profile = await api.getProfile(token);
      setDevotee(profile);
      setJapaGoal(profile.japaGoal);

      // Fetch history and announcements dynamically
      const historyData = await api.getSadhanaHistory(token);
      setHistory(historyData);

      const announcementsData = await api.getAnnouncements(token);
      setAnnouncements(announcementsData);

      // Find latest logged reading progress from history to display
      const lastReadingRecord = historyData.find(r => r.readingProgress);
      const lastReading = record?.readingProgress || (lastReadingRecord ? lastReadingRecord.readingProgress : 'Bhagavad-gita 2.20');
      setReadingProgress(lastReading);

      // Calculate this month's total rounds
      const currentYearMonth = dateStr.substring(0, 7); // "YYYY-MM"
      const monthlyRounds = historyData
        .filter(r => r.date.startsWith(currentYearMonth))
        .reduce((sum, r) => sum + r.japaRoundsCount, 0);
      setThisMonthRounds(monthlyRounds);

      // Calculate this week's total rounds (starting from Sunday of current week)
      const today = new Date(dateStr);
      const day = today.getDay();
      const diff = today.getDate() - day;
      const startOfWeek = new Date(today.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);
      const wYear = startOfWeek.getFullYear();
      const wMonth = String(startOfWeek.getMonth() + 1).padStart(2, '0');
      const wDay = String(startOfWeek.getDate()).padStart(2, '0');
      const startOfWeekStr = `${wYear}-${wMonth}-${wDay}`;
      const weeklyRounds = historyData
        .filter(r => r.date >= startOfWeekStr)
        .reduce((sum, r) => sum + r.japaRoundsCount, 0);
      setThisWeekRounds(weeklyRounds);
    } catch (err) {
      console.log('Error syncing logs: ', err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      syncSadhanaLogs(jwtToken, todayStr);
    }
  }, [jwtToken, activeTab]);

  // Handle logging to backend on check changes
  const handleSadhanaToggle = async (type: 'japa' | 'reading' | 'arati' | 'prayer' | 'lecture' | 'nbs', newVal: boolean) => {
    if (!jwtToken) return;

    // Determine current values to send
    const logData = new SadhanaLogRequestDto(
      todayStr,
      type === 'japa' ? (newVal ? japaGoal : 0) : japaRounds,
      type === 'reading' ? newVal : sadhanaReading,
      readingProgress,
      type === 'arati' ? newVal : sadhanaArati,
      type === 'prayer' ? newVal : sadhanaPrayer,
      type === 'lecture' ? newVal : sadhanaLecture,
      type === 'nbs' ? newVal : nbsJoined
    );

    // Optimistic local state update
    if (type === 'japa') setSadhanaJapa(newVal);
    if (type === 'reading') setSadhanaReading(newVal);
    if (type === 'arati') setSadhanaArati(newVal);
    if (type === 'prayer') setSadhanaPrayer(newVal);
    if (type === 'lecture') setSadhanaLecture(newVal);
    if (type === 'nbs') setNbsJoined(newVal);

    try {
      await api.submitSadhanaLog(jwtToken, logData);
      await syncSadhanaLogs(jwtToken, todayStr);
    } catch (err) {
      console.log('Failed updating log: ', err);
    }
  };

  // Direct increment/decrement rounds for Japa Mala updates
  const handleJapaRoundChange = async (amount: number) => {
    const nextRounds = Math.max(0, japaRounds + amount);
    setJapaRounds(nextRounds);
    setSadhanaJapa(nextRounds >= japaGoal);

    if (jwtToken) {
      try {
        const logData = new SadhanaLogRequestDto(
          todayStr,
          nextRounds,
          sadhanaReading,
          readingProgress,
          sadhanaArati,
          sadhanaPrayer,
          sadhanaLecture,
          nbsJoined
        );
        await api.submitSadhanaLog(jwtToken, logData);
        await syncSadhanaLogs(jwtToken, todayStr);
      } catch (err) {
        console.log('Failed updating japa rounds directly: ', err);
      }
    }
  };

  // Japa Bead Counter logic connected to backend
  const handleBeadPress = async () => {
    if (japaCount >= 107) {
      setJapaCount(0);
      const nextRounds = japaRounds + 1;
      setJapaRounds(nextRounds);

      if (nextRounds >= japaGoal) {
        setSadhanaJapa(true);
      }

      if (jwtToken) {
        try {
          const logData = new SadhanaLogRequestDto(
            todayStr,
            nextRounds,
            sadhanaReading,
            readingProgress,
            sadhanaArati,
            sadhanaPrayer,
            sadhanaLecture,
            nbsJoined
          );
          await api.submitSadhanaLog(jwtToken, logData);
          await syncSadhanaLogs(jwtToken, todayStr);
        } catch (err) {
          console.log('Failed saving japa bead increment: ', err);
        }
      }
    } else {
      setJapaCount(prev => prev + 1);
    }
  };

  // Color Tokens based on Light/Dark Mode (Rich Purple and Gold Theme)
  const colors = {
    bg: isDarkMode ? '#10051C' : '#FAF6EE',
    card: isDarkMode ? '#1B0C30' : '#FFFDFC',
    cardBorder: isDarkMode ? '#2A1647' : '#EADFC9',
    textMain: isDarkMode ? '#FFFFFF' : '#8C1A1A',
    textSub: isDarkMode ? '#D4C9E8' : '#6B5E4F',
    accentGold: '#ffd700', // Premium metallic gold
    accentGreen: '#27AE60',
    navBg: isDarkMode ? '#0B0314' : '#FFFFFF',
    navActive: '#ffd700',
    navInactive: isDarkMode ? '#8F7BAA' : '#B0A38F',
    divider: isDarkMode ? '#1E0F34' : '#EBE5D8',
    pureWhite: '#FFFFFF',
    darkPurple: '#150A24',
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

  // If not logged in, show the login flow
  if (!jwtToken || !devotee) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#160826" />
        <AuthScreen
          colors={colors}
          onLoginSuccess={(token, user) => {
            setJwtToken(token);
            setDevotee(user);
          }}
          isDarkMode={isDarkMode}
        />
      </>
    );
  }

  const sadhanaCompletedCount = [sadhanaJapa, sadhanaReading, sadhanaArati, sadhanaPrayer, sadhanaLecture, nbsJoined].filter(Boolean).length;
  const sadhanaTotalCount = 6;

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>

        {/* TOP BRANDING BAR */}
        <View style={[styles.headerBar, { borderBottomColor: colors.divider, backgroundColor: colors.bg }]}>
          <View style={styles.headerLogoContainer}>
            <Image
              source={require('../../assets/images/iskcon_vizag_header_logo.png')}
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
            <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconButton}>
              <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLang(prev => prev === PreferredLanguage.ENGLISH ? PreferredLanguage.TELUGU : prev === PreferredLanguage.TELUGU ? PreferredLanguage.HINDI : PreferredLanguage.ENGLISH)}
              style={[styles.langToggleBtn, { borderColor: colors.accentGold }]}
            >
              <Text style={[styles.langToggleText, { color: colors.accentGold }]}>
                {lang === PreferredLanguage.ENGLISH ? 'తెలుగు' : lang === PreferredLanguage.TELUGU ? 'हिंदी' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN BODY CONTAINER WITH SCROLL */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === AppTab.HOME && (
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
              currentStreak={devotee.currentStreak}
              bestStreak={devotee.bestStreak}
              thisMonthRounds={thisMonthRounds}
              onNavigate={setActiveTab}
              isDarkMode={isDarkMode}
              userName={devotee.name}
              history={history}
              announcements={announcements}
              readingProgress={readingProgress}
              nbsJoined={nbsJoined}
              onToggleNbs={(val) => handleSadhanaToggle('nbs', val)}
              lang={lang}
              avatarUrl={devotee.avatarUrl}
            />
          )}

          {activeTab === AppTab.SADHANA && (
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
              setSadhanaJapa={(val) => handleSadhanaToggle('japa', val)}
              sadhanaReading={sadhanaReading}
              setSadhanaReading={(val) => handleSadhanaToggle('reading', val)}
              sadhanaArati={sadhanaArati}
              setSadhanaArati={(val) => handleSadhanaToggle('arati', val)}
              sadhanaPrayer={sadhanaPrayer}
              setSadhanaPrayer={(val) => handleSadhanaToggle('prayer', val)}
              sadhanaLecture={sadhanaLecture}
              setSadhanaLecture={(val) => handleSadhanaToggle('lecture', val)}
              radius={radius}
              readingProgress={readingProgress}
              thisWeekRounds={thisWeekRounds}
              thisMonthRounds={thisMonthRounds}
              handleJapaRoundChange={handleJapaRoundChange}
              nbsJoined={nbsJoined}
              onToggleNbs={(val) => handleSadhanaToggle('nbs', val)}
            />
          )}

          {activeTab === AppTab.UPDATES && (
            <UpdatesScreen
              t={t}
              colors={colors}
              activeUpdateFilter={activeUpdateFilter}
              setActiveUpdateFilter={setActiveUpdateFilter}
              token={jwtToken}
            />
          )}

          {activeTab === AppTab.COMMUNITY && (
            <CommunityScreen
              t={t}
              colors={colors}
            />
          )}

          {activeTab === AppTab.JOURNEY && (
            <JourneyScreen
              t={t}
              colors={colors}
              currentStreak={devotee.currentStreak}
              bestStreak={devotee.bestStreak}
              thisMonthRounds={thisMonthRounds}
              onBack={() => setActiveTab(AppTab.HOME)}
              token={jwtToken}
            />
          )}

          {activeTab === AppTab.PROFILE && (
            <ProfileScreen
              t={t}
              colors={colors}
              lang={lang}
              setLang={setLang}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              userName={devotee.name}
              userEmail={devotee.email}
              userPhone={devotee.phone}
              totalRoundsChanted={devotee.totalRoundsChanted}
              currentStreak={devotee.currentStreak}
              bestStreak={devotee.bestStreak}
              onLogout={() => {
                setJwtToken('');
                setDevotee(null);
                setActiveTab(AppTab.HOME);
              }}
              onNavigate={setActiveTab}
              avatarUrl={devotee.avatarUrl}
              onUpdateAvatar={(url) => setDevotee((prev) => (prev ? { ...prev, avatarUrl: url } : null))}
              token={jwtToken}
            />
          )}

          {activeTab === AppTab.ADMIN && (
            <AdminScreen
              t={t}
              colors={colors}
              token={jwtToken}
              onBack={() => setActiveTab(AppTab.HOME)}
            />
          )}
        </ScrollView>

        {/* BOTTOM TAB BAR */}
        <View style={[styles.navTabBar, { backgroundColor: colors.navBg, borderTopColor: colors.divider }]}>
          <TouchableOpacity onPress={() => setActiveTab(AppTab.HOME)} style={styles.navTabItem}>
            <View style={styles.tabIconWrapper}>
              <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.HOME ? 1 : 0.6 }]}>🛕</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === AppTab.HOME ? colors.navActive : colors.navInactive }]}>{t.home}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab(AppTab.SADHANA)} style={styles.navTabItem}>
            <View style={styles.tabIconWrapper}>
              <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.SADHANA ? 1 : 0.6 }]}>📿</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === AppTab.SADHANA ? colors.navActive : colors.navInactive }]}>{t.sadhanaTab}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab(AppTab.UPDATES)} style={styles.navTabItem}>
            <View style={styles.tabIconWrapper}>
              <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.UPDATES ? 1 : 0.6 }]}>🔔</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === AppTab.UPDATES ? colors.navActive : colors.navInactive }]}>{t.updatesTab}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab(AppTab.COMMUNITY)} style={styles.navTabItem}>
            <View style={styles.tabIconWrapper}>
              <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.COMMUNITY ? 1 : 0.6 }]}>🪷</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === AppTab.COMMUNITY ? colors.navActive : colors.navInactive }]}>Community</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab(AppTab.PROFILE)} style={styles.navTabItem}>
            <View style={styles.tabIconWrapper}>
              {devotee?.avatarUrl ? (
                <Image 
                  source={{ uri: devotee.avatarUrl }} 
                  style={[
                    styles.navTabAvatar, 
                    { borderColor: activeTab === AppTab.PROFILE ? colors.navActive : 'transparent' }
                  ]} 
                />
              ) : (
                <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.PROFILE ? 1 : 0.6 }]}>🧘</Text>
              )}
            </View>
            <Text style={[styles.navTabText, { color: activeTab === AppTab.PROFILE ? colors.navActive : colors.navInactive }]}>{t.profileTab}</Text>
          </TouchableOpacity>

          {devotee?.role === DevoteeRole.ADMIN && (
            <TouchableOpacity onPress={() => setActiveTab(AppTab.ADMIN)} style={styles.navTabItem}>
              <View style={styles.tabIconWrapper}>
                <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.ADMIN ? 1 : 0.6 }]}>⚙️</Text>
              </View>
              <Text style={[styles.navTabText, { color: activeTab === AppTab.ADMIN ? colors.navActive : colors.navInactive }]}>Admin</Text>
            </TouchableOpacity>
          )}
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
  avatarText: {
    color: '#160826',
    fontWeight: 'bold',
    fontSize: 20,
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
  navTabAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  tabIconWrapper: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});

export default App;
