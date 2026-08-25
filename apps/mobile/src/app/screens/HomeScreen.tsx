import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface HomeScreenProps {
  t: any;
  colors: any;
  japaRounds: number;
  japaGoal: number;
  sadhanaCompletedCount: number;
  sadhanaTotalCount: number;
  sadhanaJapa: boolean;
  sadhanaReading: boolean;
  sadhanaArati: boolean;
  sadhanaPrayer: boolean;
  sadhanaLecture: boolean;
  currentStreak: number;
  bestStreak: number;
  thisMonthRounds: number;
  onNavigate: (tab: 'home' | 'sadhana' | 'updates' | 'journey' | 'profile') => void;
  isDarkMode: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  t,
  colors,
  japaRounds,
  japaGoal,
  sadhanaCompletedCount,
  sadhanaTotalCount,
  sadhanaJapa,
  sadhanaReading,
  sadhanaArati,
  sadhanaPrayer,
  sadhanaLecture,
  currentStreak,
  bestStreak,
  thisMonthRounds,
  onNavigate,
  isDarkMode,
}) => {
  return (
    <View>
      {/* Devotee Greetings Card */}
      <View style={[styles.greetingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.greetingHeader}>
          <View>
            <Text style={[styles.greetingText, { color: colors.textMain }]}>{t.greeting}</Text>
            <Text style={[styles.subGreetingText, { color: colors.textMain }]}>{t.morning}</Text>
          </View>
          <View style={styles.bellIcon}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </View>
        </View>

        {/* My Bhakti Dashboard Snippet */}
        <View style={styles.dashboardSection}>
          <Text style={[styles.dashboardTitle, { color: colors.textMain }]}>{t.myBhakti}</Text>
          <View style={styles.dashboardRow}>
            
            {/* Japa Card */}
            <TouchableOpacity 
              onPress={() => onNavigate('sadhana')} 
              style={[styles.dashCard, { backgroundColor: colors.pureWhite, shadowColor: isDarkMode ? '#000' : '#8C1D1D' }]}
            >
              <Text style={styles.dashEmoji}>📿</Text>
              <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.japa}</Text>
              <Text style={[styles.dashValue, { color: colors.textMain }]}>{japaRounds} / {japaGoal}</Text>
              <Text style={styles.dashSubValue}>{t.rounds}</Text>
              <View style={[styles.dashButton, { backgroundColor: colors.textMain }]}>
                <Text style={styles.dashButtonText}>{t.continueJapa}</Text>
              </View>
            </TouchableOpacity>

            {/* Today's Reading Card */}
            <View style={[styles.dashCard, { backgroundColor: colors.pureWhite, shadowColor: isDarkMode ? '#000' : '#8C1D1D' }]}>
              <Text style={styles.dashEmoji}>📖</Text>
              <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.todaysReading}</Text>
              <Text style={[styles.dashValueText, { color: colors.textMain }]} numberOfLines={1}>{t.gitaVerse}</Text>
              <Text style={styles.dashSubValue}>{t.gitaVerseRef}</Text>
              <TouchableOpacity style={[styles.dashButton, { backgroundColor: colors.textMain }]}>
                <Text style={styles.dashButtonText}>{t.readNow}</Text>
              </TouchableOpacity>
            </View>

            {/* Today's Sadhana Progress */}
            <TouchableOpacity 
              onPress={() => onNavigate('sadhana')} 
              style={[styles.dashCard, { backgroundColor: colors.pureWhite, shadowColor: isDarkMode ? '#000' : '#8C1D1D' }]}
            >
              <Text style={styles.dashEmoji}>🪷</Text>
              <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.todaysSadhana}</Text>
              <Text style={[styles.dashValue, { color: colors.textMain }]}>{sadhanaCompletedCount} / {sadhanaTotalCount}</Text>
              <Text style={styles.dashSubValue}>{t.sadhanaRatio}</Text>
              
              <View style={styles.sadhanaProgressDots}>
                <View style={[styles.progDot, { backgroundColor: sadhanaJapa ? colors.accentGold : '#ddd' }]} />
                <View style={[styles.progDot, { backgroundColor: sadhanaReading ? colors.accentGold : '#ddd' }]} />
                <View style={[styles.progDot, { backgroundColor: sadhanaArati ? colors.accentGold : '#ddd' }]} />
                <View style={[styles.progDot, { backgroundColor: sadhanaPrayer ? colors.accentGold : '#ddd' }]} />
                <View style={[styles.progDot, { backgroundColor: sadhanaLecture ? colors.accentGold : '#ddd' }]} />
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </View>

      {/* Your Bhakti Journey Streaks banner */}
      <View style={[styles.streakBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.streakTitle, { color: colors.textMain }]}>🔥 {t.myProgress}</Text>
        <View style={styles.streakStatsRow}>
          <View style={styles.streakStat}>
            <Text style={[styles.streakStatVal, { color: colors.textMain }]}>{currentStreak}</Text>
            <Text style={[styles.streakStatLbl, { color: colors.textSub }]}>{t.currentStreak}</Text>
          </View>
          <View style={styles.streakStat}>
            <Text style={[styles.streakStatVal, { color: colors.textMain }]}>{bestStreak}</Text>
            <Text style={[styles.streakStatLbl, { color: colors.textSub }]}>{t.bestStreak}</Text>
          </View>
          <View style={styles.streakStat}>
            <Text style={[styles.streakStatVal, { color: colors.textMain }]}>{thisMonthRounds}</Text>
            <Text style={[styles.streakStatLbl, { color: colors.textSub }]}>{t.thisMonth} {t.rounds}</Text>
          </View>
        </View>
      </View>

      {/* Official Temple Announcements Feed Section */}
      <View style={styles.updatesSection}>
        <View style={styles.updatesSecHeader}>
          <Text style={[styles.updatesSecTitle, { color: colors.textMain }]}>📢 {t.officialUpdates}</Text>
          <TouchableOpacity onPress={() => onNavigate('updates')}>
            <Text style={[styles.viewAllText, { color: colors.accentGold }]}>View All {'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Important Temple Announcement Card 1 */}
        <View style={[styles.announcementCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1590050752117-238cb061295a?q=80&w=600&auto=format&fit=crop' }} 
            style={styles.announcementImage} 
          />
          <View style={styles.announcementContent}>
            <View style={styles.announcementMeta}>
              <Text style={[styles.announcementTag, { backgroundColor: colors.textMain }]}>{t.festivals}</Text>
              <Text style={[styles.announcementDate, { color: colors.textSub }]}>25 Aug - 27 Aug</Text>
            </View>
            <Text style={[styles.announcementTitle, { color: colors.textMain }]}>Janmashtami Celebrations</Text>
            <Text style={[styles.announcementDesc, { color: colors.textSub }]} numberOfLines={2}>
              Special programs, maha abhishek, kirtan and delicious mahaprasadam feast.
            </Text>
            <TouchableOpacity style={styles.viewDetailsBtn}>
              <Text style={[styles.viewDetailsText, { color: colors.textMain }]}>{t.viewDetails}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Important Temple Announcement Card 2 (Timing Change Alert) */}
        <View style={[styles.timingsAlertCard, { borderColor: colors.accentGold }]}>
          <View style={styles.alertIconBg}>
            <Text style={{ fontSize: 18 }}>⏰</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: colors.textMain }]}>Mangala Arati Timing Change</Text>
            <Text style={[styles.alertDesc, { color: colors.textSub }]}>
              From tomorrow onwards, Mangala Arati starts at 4:15 AM onwards.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingCard: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subGreetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  bellIcon: {
    padding: 8,
  },
  dashboardSection: {
    marginTop: 10,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dashCard: {
    width: '30%',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 150,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dashEmoji: {
    fontSize: 24,
  },
  dashLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  dashValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  dashValueText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  dashSubValue: {
    fontSize: 8,
    color: '#8A7D69',
    textAlign: 'center',
  },
  dashButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 6,
    width: '100%',
  },
  dashButtonText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sadhanaProgressDots: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  progDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  streakBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 15,
    borderWidth: 1,
    padding: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  streakStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatVal: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakStatLbl: {
    fontSize: 11,
    marginTop: 2,
  },
  updatesSection: {
    paddingHorizontal: 16,
  },
  updatesSecHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  updatesSecTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  announcementCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  announcementImage: {
    width: '100%',
    height: 140,
  },
  announcementContent: {
    padding: 16,
  },
  announcementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTag: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  announcementDate: {
    fontSize: 11,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  announcementDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  viewDetailsBtn: {
    marginTop: 12,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  timingsAlertCard: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    backgroundColor: '#FFFDF0',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE99E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertDesc: {
    fontSize: 11,
    marginTop: 2,
  },
});
