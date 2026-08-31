import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ISadhanaRecord, IAnnouncement, AnnouncementType, PreferredLanguage, AppTab } from '@temple/models';

interface DynamicImageProps {
  uri: string;
  style?: any;
  borderRadius?: number;
}

export const DynamicImage: React.FC<DynamicImageProps> = ({ uri, style, borderRadius = 0 }) => {
  const [aspectRatio, setAspectRatio] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!uri) return;
    setLoading(true);
    Image.getSize(
      uri,
      (width, height) => {
        if (width && height) {
          setAspectRatio(width / height);
        }
        setLoading(false);
      },
      (error) => {
        console.log('Error getting image size:', error);
        setLoading(false);
      }
    );
  }, [uri]);

  if (loading) {
    return (
      <View style={[style, { height: 160, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }]}>
        <ActivityIndicator size="small" color="#ffd700" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[
        style,
        {
          width: '100%',
          aspectRatio: aspectRatio || 16 / 9,
          borderRadius,
        },
      ]}
      resizeMode="contain"
    />
  );
};

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
  onNavigate: (tab: AppTab) => void;
  isDarkMode: boolean;
  userName?: string;
  history: ISadhanaRecord[];
  announcements: IAnnouncement[];
  readingProgress: string;
  nbsJoined: boolean;
  onToggleNbs: (val: boolean) => void;
  lang: PreferredLanguage;
  avatarUrl?: string;
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
  userName = 'Arjun',
  history = [],
  announcements = [],
  readingProgress = 'Bhagavad-gita 2.20',
  nbsJoined = false,
  onToggleNbs = () => {},
  lang = PreferredLanguage.ENGLISH,
  avatarUrl,
}) => {

  // Date utilities to get local days of the current week (Mon-Sun)
  const getDatesOfCurrentWeek = () => {
    const current = new Date();
    const day = current.getDay();
    // Adjust so week starts on Monday (1) instead of Sunday (0)
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, '0');
      const date = String(nextDay.getDate()).padStart(2, '0');
      week.push(`${year}-${month}-${date}`);
    }
    return week;
  };

  const weekDates = getDatesOfCurrentWeek();

  // Calculate Nityam Bhagavata Sevaya monthly attendance
  const currentYearMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  const nbsDaysThisMonth = history.filter(r => r.nbsJoined && r.date.startsWith(currentYearMonth)).length;

  // Check if current time is within NBS attendance check-in window (6:30 AM - 7:30 AM)
  const isNbsCheckInWindow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const startInMinutes = 6 * 60 + 30; // 6:30 AM
    const endInMinutes = 7 * 60 + 30;   // 7:30 AM
    return currentTimeInMinutes >= startInMinutes && currentTimeInMinutes <= endInMinutes;
  };

  // 1. Japa progress (Chanted at least 1 round on how many days this week)
  const japaActiveDays = weekDates.filter(dateStr => {
    const record = history.find(r => r.date === dateStr);
    return record && record.japaRoundsCount > 0;
  }).length;

  // 2. Reading progress (completed reading on how many days this week)
  const readingActiveDays = weekDates.filter(dateStr => {
    const record = history.find(r => r.date === dateStr);
    return record && record.readingCompleted;
  }).length;

  // 3. Sadhana progress (completed at least 1 sadhana item on how many days this week)
  const sadhanaActiveDays = weekDates.filter(dateStr => {
    const record = history.find(r => r.date === dateStr);
    if (!record) return false;
    const completedCount = [
      record.japaRoundsCount >= japaGoal,
      record.readingCompleted,
      record.mangalaArati,
      record.morningPrayer,
      record.spiritualLecture
    ].filter(Boolean).length;
    return completedCount > 0;
  }).length;

  const japaBars = weekDates.map(dateStr => {
    const record = history.find(r => r.date === dateStr);
    const rounds = record ? record.japaRoundsCount : 0;
    const height = japaGoal > 0 ? Math.min(24, Math.round((rounds / japaGoal) * 24)) : 0;
    return { height, active: rounds > 0 };
  });

  const readingBars = weekDates.map(dateStr => {
    const record = history.find(r => r.date === dateStr);
    const completed = record ? record.readingCompleted : false;
    const height = completed ? 24 : 0;
    return { height, active: completed };
  });

  const sadhanaBars = weekDates.map(dateStr => {
    const record = history.find(r => r.date === dateStr);
    if (!record) return { height: 0, active: false };
    const completedCount = [
      record.japaRoundsCount >= japaGoal,
      record.readingCompleted,
      record.mangalaArati,
      record.morningPrayer,
      record.spiritualLecture
    ].filter(Boolean).length;
    const height = Math.round((completedCount / 5) * 24);
    return { height, active: completedCount > 0 };
  });

  // Reading progress text split
  const lastSpaceIdx = readingProgress.lastIndexOf(' ');
  const bookTitle = lastSpaceIdx !== -1 ? readingProgress.substring(0, lastSpaceIdx) : readingProgress;
  const bookRef = lastSpaceIdx !== -1 ? readingProgress.substring(lastSpaceIdx + 1) : '';

  // Dynamic Announcements calculations
  const latestAnnouncement = announcements.find(a => a.official) || announcements[0];
  
  const fallbackAlerts = [
    {
      id: -1,
      title: 'Mangala Arati Timing Change',
      date: 'Today',
      description: 'From tomorrow onwards, Mangala Arati starts at 4:15 AM onwards.',
      type: AnnouncementType.TEMPLE
    },
    {
      id: -2,
      title: 'Bhagavad-gita Class',
      date: 'Today',
      description: 'Discourse on Chapter 2, Verse 20 starts tomorrow evening.',
      type: AnnouncementType.CLASSES
    }
  ];

  const alertAnnouncements = announcements.length > 0
    ? announcements
        .filter(a => a.id !== latestAnnouncement?.id && (a.type === AnnouncementType.TEMPLE || a.type === AnnouncementType.CLASSES || a.type === AnnouncementType.GENERAL))
        .slice(0, 2)
    : fallbackAlerts;

  const quickLinks = [
    { title: 'Temple Timings', icon: '⏰' },
    { title: 'Darshan', icon: '🕉️' },
    { title: 'Donate', icon: '💳' },
    { title: 'Seva', icon: '🪷' },
    { title: 'Events', icon: '📅' },
    { title: 'Prasadam', icon: '🍲' },
    { title: 'Contact Us', icon: '📞' },
  ];

  return (
    <View style={styles.container}>
      {/* Devotee Greetings Card */}
      <View style={[styles.greetingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.greetingHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.greetingAvatar} 
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.greetingText, { color: colors.textSub }]}>{t.greeting}</Text>
              <Text style={[styles.subGreetingText, { color: colors.textMain }]}>Good Morning, {userName}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.bellIcon, { backgroundColor: colors.divider }]}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* My Bhakti Dashboard Section */}
        <View style={styles.dashboardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.dashboardTitle, { color: colors.textMain }]}>{t.myBhakti}</Text>
            <TouchableOpacity onPress={() => onNavigate(AppTab.SADHANA)}>
              <Text style={[styles.viewAllLink, { color: colors.accentGold }]}>View All {'>'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dashboardRow}>
            
            {/* Japa Card */}
            <TouchableOpacity 
              onPress={() => onNavigate(AppTab.SADHANA)} 
              style={[styles.dashCard, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}
            >
              {/* Mini Bead Ring Drawing */}
              <View style={styles.miniBeadRing}>
                <Svg width={40} height={40}>
                  <Circle cx={20} cy={20} r={14} stroke={colors.cardBorder} strokeWidth={1} fill="none" />
                  {/* Active segment representation */}
                  <Circle cx={20} cy={6} r={3.5} fill={colors.accentGold} />
                  <Circle cx={28} cy={9} r={2.5} fill={colors.accentGold} />
                  <Circle cx={33} cy={16} r={2.5} fill={colors.accentGold} />
                  <Circle cx={33} cy={24} r={2.5} fill={colors.accentGold} />
                  <Circle cx={28} cy={31} r={2.5} fill={colors.cardBorder} />
                  <Circle cx={20} cy={34} r={2.5} fill={colors.cardBorder} />
                  <Circle cx={12} cy={31} r={2.5} fill={colors.cardBorder} />
                  <Circle cx={7} cy={24} r={2.5} fill={colors.cardBorder} />
                  <Circle cx={7} cy={16} r={2.5} fill={colors.cardBorder} />
                  <Circle cx={12} cy={9} r={2.5} fill={colors.cardBorder} />
                </Svg>
              </View>
              <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.japa}</Text>
              <Text style={[styles.dashValue, { color: colors.textMain }]}>{japaRounds} / {japaGoal}</Text>
              <Text style={[styles.dashSubValue, { color: colors.textSub }]}>{t.rounds}</Text>
              
              <View style={[styles.dashButton, { backgroundColor: colors.accentGold }]}>
                <Text style={[styles.dashButtonText, { color: '#160826' }]}>{t.continueJapa}</Text>
              </View>
            </TouchableOpacity>
 
            {/* Today's Reading Card */}
            <View style={[styles.dashCard, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}>
              <Text style={styles.dashEmoji}>📖</Text>
              <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.todaysReading}</Text>
              <Text style={[styles.dashValueText, { color: colors.textMain }]} numberOfLines={1}>{bookTitle}</Text>
              <Text style={[styles.dashSubValue, { color: colors.textSub }]}>{bookRef || t.gitaVerseRef}</Text>
              
              <TouchableOpacity style={[styles.dashButton, { backgroundColor: colors.accentGold }]}>
                <Text style={[styles.dashButtonText, { color: '#160826' }]}>{t.readNow}</Text>
              </TouchableOpacity>
            </View>
 
            {/* Today's Sadhana Card */}
            <TouchableOpacity 
              onPress={() => onNavigate(AppTab.SADHANA)} 
              style={[styles.dashCard, { backgroundColor: colors.bg, borderColor: colors.cardBorder }]}
            >
              <View style={styles.sadhanaListSnippet}>
                <View style={styles.snippetRow}>
                  <Text style={[styles.snippetText, { color: colors.textSub }]}>Japa</Text>
                  <Text style={{ color: colors.accentGold, fontSize: 10 }}>✔</Text>
                </View>
                <View style={styles.snippetRow}>
                  <Text style={[styles.snippetText, { color: colors.textSub }]}>Reading</Text>
                  <Text style={{ color: colors.accentGold, fontSize: 10 }}>✔</Text>
                </View>
                <View style={styles.snippetRow}>
                  <Text style={[styles.snippetText, { color: colors.textSub }]}>Arati</Text>
                  <Text style={{ color: colors.cardBorder, fontSize: 10 }}>◯</Text>
                </View>
                <View style={styles.snippetRow}>
                  <Text style={[styles.snippetText, { color: colors.textSub }]}>Prayer</Text>
                  <Text style={{ color: colors.accentGold, fontSize: 10 }}>✔</Text>
                </View>
              </View>
              <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.todaysSadhana}</Text>
              <Text style={[styles.dashValue, { color: colors.textMain }]}>{sadhanaCompletedCount} / {sadhanaTotalCount}</Text>
              <Text style={[styles.dashSubValue, { color: colors.textSub }]}>{t.sadhanaRatio}</Text>
            </TouchableOpacity>

          </View>

          {/* NBS Live Session Tracker Card */}
          <View style={[styles.nbsCard, { backgroundColor: colors.card, borderColor: nbsJoined ? '#5CB85C' : colors.cardBorder, borderWidth: nbsJoined ? 1.5 : 1 }]}>
            <View style={styles.nbsCardHeader}>
              <View>
                <Text style={[styles.nbsTitle, { color: colors.textMain }]}>{t.nbsTitle}</Text>
                <Text style={[styles.nbsSubtitle, { color: colors.textSub }]}>{t.nbsSubtitle}</Text>
              </View>
              <View style={[styles.liveIndicator, { backgroundColor: nbsJoined ? '#5CB85C' : '#2196F3' }]}>
                <Text style={styles.liveIndicatorText}>{nbsJoined ? 'ATTENDED' : 'LIVE TRACKING'}</Text>
              </View>
            </View>

            <View style={styles.nbsTimesContainer}>
              <View style={styles.nbsTimeRow}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>🕓</Text>
                <View>
                  <Text style={[styles.nbsTimeRange, { color: colors.textMain }]}>4:30 AM – 6:00 AM</Text>
                  <Text style={[styles.nbsTimeName, { color: colors.textSub }]}>
                    {lang === 'hi' ? 'श्रीला प्रभुपाद जप सत्र' : lang === 'te' ? 'శ్రీల ప్రభుపాద జప ధ్యానం' : 'Śrīla Prabhupāda Japa Session'}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.nbsTimeRow, { marginTop: 10 }]}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>🕕</Text>
                <View>
                  <Text style={[styles.nbsTimeRange, { color: colors.textMain }]}>6:00 AM – 7:00 AM</Text>
                  <Text style={[styles.nbsTimeName, { color: colors.textSub }]}>
                    {lang === 'hi' ? 'श्रीमद् भागवतम् प्रवचन' : lang === 'te' ? 'శ్రీమద్ భాగవతం ప్రవచనం' : 'Śrīmad Bhāgavatam Class'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Attendance statistics and feedback */}
            <View style={{ marginVertical: 12, paddingHorizontal: 4 }}>
              {nbsJoined ? (
                <Text style={{ color: colors.accentGold, fontSize: 13, fontWeight: '600', fontStyle: 'italic', marginBottom: 4 }}>
                  ✨ You attended today's morning program! Keep up the devotion! 🙏
                </Text>
              ) : null}
              <Text style={{ color: colors.textSub, fontSize: 12, fontWeight: '500' }}>
                📅 Monthly Attendance: <Text style={{ color: colors.textMain, fontWeight: 'bold' }}>{nbsDaysThisMonth} days</Text> logged
              </Text>
            </View>

            {/* Check-in visibility condition */}
            {isNbsCheckInWindow() || nbsJoined ? (
              <TouchableOpacity 
                onPress={() => onToggleNbs(!nbsJoined)}
                style={[
                  styles.nbsJoinBtn, 
                  { 
                    backgroundColor: nbsJoined ? 'rgba(92, 184, 92, 0.15)' : colors.accentGold,
                    borderWidth: nbsJoined ? 1.5 : 0,
                    borderColor: '#5CB85C'
                  }
                ]}
                disabled={!isNbsCheckInWindow() && nbsJoined}
              >
                <Text style={[styles.nbsJoinBtnText, { color: nbsJoined ? '#5CB85C' : '#160826', fontWeight: 'bold' }]}>
                  {nbsJoined ? t.joinedNbs : t.joinNbs}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ 
                padding: 12, 
                borderRadius: 8, 
                backgroundColor: colors.bg, 
                borderWidth: 1, 
                borderColor: colors.cardBorder, 
                alignItems: 'center' 
              }}>
                <Text style={{ color: colors.textSub, fontSize: 12, fontWeight: '500', textAlign: 'center', lineHeight: 18 }}>
                  🪷 Dear Devotees, check-in for Nityam Bhāgavata Sevayā is open daily from 6:30 AM to 7:30 AM. Let us serve together! 🙏
                </Text>
              </View>
            )}
          </View>

        </View>
      </View>

      {/* Your Bhakti Journey Streaks banner */}
      <TouchableOpacity 
        onPress={() => onNavigate(AppTab.JOURNEY)}
        style={[styles.streakBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      >
        <Text style={[styles.streakTitle, { color: colors.textMain }]}>Your Bhakti Journey</Text>
        <Text style={[styles.streakLabelText, { color: colors.textSub }]}>This Week</Text>
        
        <View style={styles.streakStatsRow}>
          {/* Japa Week Graph */}
          <View style={styles.journeyTeaserCol}>
            <Text style={[styles.teaserLbl, { color: colors.textSub }]}>Japa</Text>
            <Text style={[styles.teaserVal, { color: colors.textMain }]}>{japaActiveDays}/7</Text>
            <Text style={[styles.teaserSub, { color: colors.textSub }]}>Days</Text>
            <View style={styles.miniBarGraph}>
              {japaBars.map((bar, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.miniBar, 
                    { 
                      height: bar.height || 2, 
                      backgroundColor: bar.active ? colors.accentGold : colors.cardBorder 
                    }
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* Reading Week Graph */}
          <View style={styles.journeyTeaserCol}>
            <Text style={[styles.teaserLbl, { color: colors.textSub }]}>Reading</Text>
            <Text style={[styles.teaserVal, { color: colors.textMain }]}>{readingActiveDays}/7</Text>
            <Text style={[styles.teaserSub, { color: colors.textSub }]}>Days</Text>
            <View style={styles.miniBarGraph}>
              {readingBars.map((bar, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.miniBar, 
                    { 
                      height: bar.height || 2, 
                      backgroundColor: bar.active ? colors.accentGold : colors.cardBorder 
                    }
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* Sadhana Week Graph */}
          <View style={styles.journeyTeaserCol}>
            <Text style={[styles.teaserLbl, { color: colors.textSub }]}>Sadhana</Text>
            <Text style={[styles.teaserVal, { color: colors.textMain }]}>{sadhanaActiveDays}/7</Text>
            <Text style={[styles.teaserSub, { color: colors.textSub }]}>Days</Text>
            <View style={styles.miniBarGraph}>
              {sadhanaBars.map((bar, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.miniBar, 
                    { 
                      height: bar.height || 2, 
                      backgroundColor: bar.active ? '#2D9CDB' : colors.cardBorder 
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.dividerLine} />
        <View style={styles.journeyQuoteRow}>
          <Text style={styles.quoteLotusIcon}>🪷</Text>
          <Text style={[styles.quoteText, { color: colors.textSub }]}>
            Consistency is more important than perfection. Keep chanting and stay blessed.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Official Temple Announcements Feed Section */}
      <View style={styles.updatesSection}>
        <View style={styles.updatesSecHeader}>
          <Text style={[styles.updatesSecTitle, { color: colors.textMain }]}>{t.officialUpdates}</Text>
          <TouchableOpacity onPress={() => onNavigate(AppTab.UPDATES)}>
            <Text style={[styles.viewAllText, { color: colors.accentGold }]}>View All {'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Announcement Card */}
        {latestAnnouncement ? (
          <View style={[styles.announcementCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {latestAnnouncement.image ? (
              <DynamicImage 
                uri={latestAnnouncement.image} 
                style={styles.announcementImage} 
              />
            ) : null}
            <View style={styles.announcementContent}>
              <View style={styles.announcementMeta}>
                <Text style={[styles.announcementTag, { backgroundColor: colors.accentGold, color: '#160826' }]}>
                  {latestAnnouncement.type.toUpperCase()}
                </Text>
                <Text style={[styles.announcementDate, { color: colors.textSub }]}>{latestAnnouncement.date}</Text>
              </View>
              <Text style={[styles.announcementTitle, { color: colors.textMain }]}>{latestAnnouncement.title}</Text>
              <Text style={[styles.announcementDesc, { color: colors.textSub }]} numberOfLines={2}>
                {latestAnnouncement.description}
              </Text>
              <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => onNavigate(AppTab.UPDATES)}>
                <Text style={[styles.viewDetailsText, { color: colors.textMain }]}>{t.viewDetails} {'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.textSub, marginHorizontal: 16 }}>No announcements available.</Text>
        )}

        {/* Dynamic Alert Items List */}
        {alertAnnouncements.map((alert) => (
          <View key={alert.id} style={[styles.timingsAlertCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View 
              style={[
                styles.alertIconBg, 
                { backgroundColor: alert.type === AnnouncementType.TEMPLE ? 'rgba(241, 189, 60, 0.15)' : 'rgba(140, 26, 26, 0.15)' }
              ]}
            >
              <Text style={{ fontSize: 16 }}>
                {alert.type === AnnouncementType.TEMPLE ? '⏰' : alert.type === AnnouncementType.CLASSES ? '📖' : '📢'}
              </Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={[styles.alertTitle, { color: colors.textMain }]}>{alert.title}</Text>
              <Text style={[styles.alertDateText, { color: colors.textSub }]}>{alert.date}</Text>
              <Text style={[styles.alertDesc, { color: colors.textSub }]}>
                {alert.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* QUICK LINKS SECTION AT THE BOTTOM */}
      <View style={styles.quickLinksSection}>
        <Text style={[styles.quickLinksHeading, { color: colors.textMain }]}>Quick Actions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickLinksScroll}
        >
          {quickLinks.map((link, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.quickLinkItem}
            >
              <View style={[styles.quickLinkIconBg, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={styles.quickLinkLabelIcon}>{link.icon}</Text>
              </View>
              <Text style={[styles.quickLinkLabelText, { color: colors.textSub }]}>
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subGreetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  greetingAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#ffd700',
  },
  bellIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardSection: {
    marginTop: 5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '600',
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dashCard: {
    width: '31%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 164,
  },
  miniBeadRing: {
    marginVertical: 4,
  },
  dashEmoji: {
    fontSize: 22,
    marginVertical: 10,
  },
  sadhanaListSnippet: {
    width: '100%',
    marginVertical: 4,
  },
  snippetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  snippetText: {
    fontSize: 9,
    fontWeight: '500',
  },
  dashLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  dashValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  dashValueText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 2,
    textAlign: 'center',
  },
  dashSubValue: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  dashButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 6,
    width: '100%',
  },
  dashButtonText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  streakBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakLabelText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  streakStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  journeyTeaserCol: {
    width: '30%',
    alignItems: 'center',
  },
  teaserLbl: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  teaserVal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  teaserSub: {
    fontSize: 8,
    fontWeight: '500',
  },
  miniBarGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    marginTop: 8,
    width: '90%',
    justifyContent: 'space-between',
  },
  miniBar: {
    width: 4,
    borderRadius: 2,
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  journeyQuoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteLotusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  quoteText: {
    fontSize: 10,
    lineHeight: 14,
    flex: 1,
    fontStyle: 'italic',
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
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
    fontWeight: '500',
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
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  timingsAlertCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertDateText: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  alertDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  quickLinksSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  quickLinksHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quickLinksScroll: {
    paddingHorizontal: 12,
  },
  quickLinkItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 68,
  },
  quickLinkIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLinkLabelIcon: {
    fontSize: 22,
  },
  quickLinkLabelText: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
    fontWeight: '500',
  },
  nbsCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  nbsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nbsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  nbsSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  liveIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveIndicatorText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  nbsTimesContainer: {
    marginVertical: 12,
  },
  nbsTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nbsTimeRange: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  nbsTimeName: {
    fontSize: 11,
    marginTop: 1,
  },
  nbsJoinBtn: {
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  nbsJoinBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
