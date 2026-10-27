/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  TRANSLATIONS,
  IDevotee,
  SadhanaLogRequestDto,
  ISadhanaRecord,
  IAnnouncement,
  PreferredLanguage,
  AppTab,
} from '@temple/models';
import { AuthScreen } from './screens';
import { AppHeader, BottomTabBar, ScreenRenderer } from './components';
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
        <AppHeader
          colors={colors}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          lang={lang}
          onToggleLang={() =>
            setLang(prev =>
              prev === PreferredLanguage.ENGLISH
                ? PreferredLanguage.TELUGU
                : prev === PreferredLanguage.TELUGU
                ? PreferredLanguage.HINDI
                : PreferredLanguage.ENGLISH
            )
          }
          syncing={syncing}
        />

        <ScreenRenderer
          activeTab={activeTab}
          onNavigate={setActiveTab}
          t={t}
          colors={colors}
          jwtToken={jwtToken}
          devotee={devotee}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          lang={lang}
          setLang={setLang}
          onLogout={() => {
            setJwtToken('');
            setDevotee(null);
            setActiveTab(AppTab.HOME);
          }}
          onUpdateAvatar={url => setDevotee(prev => (prev ? { ...prev, avatarUrl: url } : null))}
          japaRounds={japaRounds}
          japaGoal={japaGoal}
          japaCount={japaCount}
          handleBeadPress={handleBeadPress}
          beads={beads}
          activeBeadIndex={activeBeadIndex}
          handleJapaRoundChange={handleJapaRoundChange}
          sadhanaCompletedCount={sadhanaCompletedCount}
          sadhanaTotalCount={sadhanaTotalCount}
          sadhanaJapa={sadhanaJapa}
          sadhanaReading={sadhanaReading}
          sadhanaArati={sadhanaArati}
          sadhanaPrayer={sadhanaPrayer}
          sadhanaLecture={sadhanaLecture}
          nbsJoined={nbsJoined}
          handleSadhanaToggle={handleSadhanaToggle}
          thisMonthRounds={thisMonthRounds}
          thisWeekRounds={thisWeekRounds}
          readingProgress={readingProgress}
          history={history}
          announcements={announcements}
          activeUpdateFilter={activeUpdateFilter}
          setActiveUpdateFilter={setActiveUpdateFilter}
          radius={radius}
        />

        <BottomTabBar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          colors={colors}
          t={t}
          devotee={devotee}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
