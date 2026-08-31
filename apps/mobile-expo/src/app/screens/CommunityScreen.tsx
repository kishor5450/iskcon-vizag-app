import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { IDevotee, AppTab } from '@temple/models';
import { api } from '../utils/api';

interface CommunityScreenProps {
  t: any;
  colors: any;
  token?: string;
  onNavigate?: (tab: AppTab) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({ t, colors, token, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'community' | 'leaderboard'>('community');
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalJapaRounds: 0,
    totalNbsAttended: 0,
    totalReadingSessions: 0,
    totalAratis: 0
  });
  const [devotees, setDevotees] = useState<IDevotee[]>([]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const communityStats = await api.getCommunityStats(token);
      setStats(communityStats);
      const devList = await api.getDevotees(token);
      setDevotees(devList);
    } catch (err) {
      console.log('Community Screen Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Map backend stats to grid configuration
  const gridStats = [
    { label: 'Total Japa', val: stats.totalJapaRounds.toLocaleString(), sub: 'Rounds Chanted', icon: '📿' },
    { label: 'NBS Attendance', val: stats.totalNbsAttended.toLocaleString(), sub: 'Sessions Logged', icon: '🔔' },
    { label: 'Reading Sessions', val: stats.totalReadingSessions.toLocaleString(), sub: 'Days Completed', icon: '📖' },
    { label: 'Mangala Aratis', val: stats.totalAratis.toLocaleString(), sub: 'Aratis Offered', icon: '🪷' },
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>🪷 Community Board</Text>

      {/* Tabs */}
      <View style={[styles.tabSegment, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('community')}
          style={[styles.segmentBtn, activeTab === 'community' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'community' ? '#160826' : colors.textSub }]}>
            Bhakti Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('leaderboard')}
          style={[styles.segmentBtn, activeTab === 'leaderboard' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'leaderboard' ? '#160826' : colors.textSub }]}>
            Leaderboard 🪷
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.accentGold} />
          <Text style={[styles.loadingText, { color: colors.textSub }]}>Loading transcendental aggregates...</Text>
        </View>
      ) : activeTab === 'community' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main card header */}
          <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.introTitle, { color: colors.textMain }]}>Together We Grow Spiritually ✨</Text>
            <Text style={[styles.introDesc, { color: colors.textSub }]}>
              Every round chanted, page read, Mangala Arati attended, and hour of service offered contributes to the collective spiritual energy of our Visakhapatnam congregation. Keep inspiring each other!
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.grid}>
            {gridStats.map((stat, idx) => (
              <View 
                key={idx} 
                style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={[styles.iconBg, { backgroundColor: colors.divider }]}>
                  <Text style={styles.icon}>{stat.icon}</Text>
                </View>
                <Text style={[styles.statVal, { color: colors.textMain }]}>{stat.val}</Text>
                <Text style={[styles.statSub, { color: colors.accentGold }]}>{stat.sub}</Text>
                <Text style={[styles.statLabel, { color: colors.textSub }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Bottom active group section */}
          <Text style={[styles.subHeading, { color: colors.textMain }]}>Active Community Boards</Text>
          
          <View style={[styles.boardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.boardIcon}>📿</Text>
            <View style={styles.boardInfo}>
              <Text style={[styles.boardTitle, { color: colors.textMain }]}>Daily Chanting Sangha</Text>
              <Text style={[styles.boardMembers, { color: colors.textSub }]}>Join devotees in chanting daily Japa together</Text>
            </View>
            <TouchableOpacity 
              onPress={() => onNavigate && onNavigate(AppTab.SADHANA)}
              style={[styles.joinBtn, { backgroundColor: colors.accentGold }]}
            >
              <Text style={[styles.joinBtnText, { color: '#160826' }]}>Chant</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.boardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.boardIcon}>📖</Text>
            <View style={styles.boardInfo}>
              <Text style={[styles.boardTitle, { color: colors.textMain }]}>Srimad Bhagavatam Study Group</Text>
              <Text style={[styles.boardMembers, { color: colors.textSub }]}>Read daily morning Bhagavatam session together</Text>
            </View>
            <TouchableOpacity 
              onPress={() => onNavigate && onNavigate(AppTab.HOME)}
              style={[styles.joinBtn, { backgroundColor: colors.accentGold }]}
            >
              <Text style={[styles.joinBtnText, { color: '#160826' }]}>Attend</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.introTitle, { color: colors.textMain }]}>Congregation Leaderboard 🪷</Text>
            <Text style={[styles.introDesc, { color: colors.textSub }]}>
              Top chanting devotees sorted by all-time rounds completed. Let us encourage one another in daily sadhana!
            </Text>
          </View>

          {devotees.map((devotee, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            const rankColor = rank === 1 ? '#ffd700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : colors.textSub;

            return (
              <View 
                key={devotee.id}
                style={[
                  styles.leaderboardRow, 
                  { backgroundColor: colors.card, borderColor: isTop3 ? rankColor : colors.cardBorder },
                  isTop3 && { borderWidth: 1.5 }
                ]}
              >
                {/* Rank indicator */}
                <Text style={[styles.rankText, { color: rankColor, borderColor: rankColor }]}>
                  {rankEmoji}
                </Text>

                {/* Avatar */}
                {devotee.avatarUrl ? (
                  <Image source={{ uri: devotee.avatarUrl }} style={styles.leaderboardAvatar} />
                ) : (
                  <View style={[styles.leaderboardAvatar, { backgroundColor: colors.divider, alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ fontSize: 10, color: colors.textSub }}>👤</Text>
                  </View>
                )}

                {/* Name & Streaks */}
                <View style={styles.leaderboardInfo}>
                  <Text style={[styles.leaderboardName, { color: colors.textMain }]} numberOfLines={1}>
                    {devotee.name}
                  </Text>
                  <Text style={[styles.leaderboardStreak, { color: colors.textSub }]}>
                    🔥 Streak: <Text style={{ color: colors.textMain, fontWeight: 'bold' }}>{devotee.currentStreak} days</Text> (Best: {devotee.bestStreak})
                  </Text>
                </View>

                {/* Total rounds */}
                <View style={[styles.roundsBadge, { backgroundColor: colors.divider }]}>
                  <Text style={[styles.roundsCountText, { color: colors.accentGold }]}>
                    {devotee.totalRoundsChanted}
                  </Text>
                  <Text style={[styles.roundsLabelText, { color: colors.textSub }]}>
                    Rounds
                  </Text>
                </View>
              </View>
            );
          })}

          {devotees.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSub, textAlign: 'center', marginTop: 24 }]}>
              No devotees registered yet.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabSegment: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
  },
  statVal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statSub: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  boardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  boardInfo: {
    flex: 1,
    marginRight: 8,
  },
  boardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  boardMembers: {
    fontSize: 11,
    marginTop: 2,
  },
  joinBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 28,
    textAlign: 'center',
  },
  leaderboardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    marginRight: 10,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboardStreak: {
    fontSize: 11,
    marginTop: 2,
  },
  roundsBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  roundsCountText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  roundsLabelText: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: 13,
  },
});
