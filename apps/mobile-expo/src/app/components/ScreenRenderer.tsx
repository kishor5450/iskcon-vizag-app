import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AppTab, IDevotee, ISadhanaRecord, IAnnouncement, PreferredLanguage } from '@temple/models';
import {
  HomeScreen,
  SadhanaScreen,
  UpdatesScreen,
  JourneyScreen,
  ProfileScreen,
  CommunityScreen,
  AdminScreen,
} from '../screens';

export interface ScreenRendererProps {
  activeTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  t: any;
  colors: any;
  jwtToken: string;
  devotee: IDevotee;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  lang: PreferredLanguage;
  setLang: (val: PreferredLanguage) => void;
  onLogout: () => void;
  onUpdateAvatar: (url: string) => void;

  // Japa State
  japaRounds: number;
  japaGoal: number;
  japaCount: number;
  handleBeadPress: () => void;
  beads: { x: number; y: number; index: number }[];
  activeBeadIndex: number;
  handleJapaRoundChange: (amount: number) => void;

  // Sadhana Checks
  sadhanaCompletedCount: number;
  sadhanaTotalCount: number;
  sadhanaJapa: boolean;
  sadhanaReading: boolean;
  sadhanaArati: boolean;
  sadhanaPrayer: boolean;
  sadhanaLecture: boolean;
  nbsJoined: boolean;
  handleSadhanaToggle: (type: 'japa' | 'reading' | 'arati' | 'prayer' | 'lecture' | 'nbs', newVal: boolean) => void;

  // Stats & Content
  thisMonthRounds: number;
  thisWeekRounds: number;
  readingProgress: string;
  history: ISadhanaRecord[];
  announcements: IAnnouncement[];
  activeUpdateFilter: 'all' | 'festival' | 'temple' | 'classes' | 'seva';
  setActiveUpdateFilter: (val: 'all' | 'festival' | 'temple' | 'classes' | 'seva') => void;
  radius: number;
}

export const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  activeTab,
  onNavigate,
  t,
  colors,
  jwtToken,
  devotee,
  isDarkMode,
  setIsDarkMode,
  lang,
  setLang,
  onLogout,
  onUpdateAvatar,
  japaRounds,
  japaGoal,
  japaCount,
  handleBeadPress,
  beads,
  activeBeadIndex,
  handleJapaRoundChange,
  sadhanaCompletedCount,
  sadhanaTotalCount,
  sadhanaJapa,
  sadhanaReading,
  sadhanaArati,
  sadhanaPrayer,
  sadhanaLecture,
  nbsJoined,
  handleSadhanaToggle,
  thisMonthRounds,
  thisWeekRounds,
  readingProgress,
  history,
  announcements,
  activeUpdateFilter,
  setActiveUpdateFilter,
  radius,
}) => {
  return (
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
          onNavigate={onNavigate}
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
          token={jwtToken}
          onNavigate={onNavigate}
        />
      )}

      {activeTab === AppTab.JOURNEY && (
        <JourneyScreen
          t={t}
          colors={colors}
          currentStreak={devotee.currentStreak}
          bestStreak={devotee.bestStreak}
          thisMonthRounds={thisMonthRounds}
          onBack={() => onNavigate(AppTab.HOME)}
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
          onLogout={onLogout}
          onNavigate={onNavigate}
          avatarUrl={devotee.avatarUrl}
          onUpdateAvatar={onUpdateAvatar}
          token={jwtToken}
        />
      )}

      {activeTab === AppTab.ADMIN && (
        <AdminScreen
          t={t}
          colors={colors}
          token={jwtToken}
          onBack={() => onNavigate(AppTab.HOME)}
        />
      )}
    </ScrollView>
  );
};

// Aliases for convenience and flexibility
export const ScreensContainer = ScreenRenderer;
export const AllScreens = ScreenRenderer;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 90,
  },
});
