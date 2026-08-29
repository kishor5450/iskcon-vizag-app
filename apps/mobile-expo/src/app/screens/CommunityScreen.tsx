import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface CommunityScreenProps {
  t: any;
  colors: any;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({ t, colors }) => {
  const [activeTab, setActiveTab] = useState<'community' | 'groups'>('community');

  const stats = [
    { label: 'Total Japa This Month', val: '12,840', sub: 'Rounds', icon: '📿' },
    { label: 'Reading Sessions', val: '3,420', sub: 'This Month', icon: '📚' },
    { label: 'Seva Hours', val: '1,284', sub: 'This Month', icon: '🤝' },
    { label: 'Books Distributed', val: '2,450', sub: 'This Month', icon: '📖' },
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>👥 Community</Text>

      {/* Tabs */}
      <View style={[styles.tabSegment, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('community')}
          style={[styles.segmentBtn, activeTab === 'community' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'community' ? '#160826' : colors.textSub }]}>
            Community
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('groups')}
          style={[styles.segmentBtn, activeTab === 'groups' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'groups' ? '#160826' : colors.textSub }]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'community' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Main card header */}
          <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.introTitle, { color: colors.textMain }]}>Together We Grow Spiritually</Text>
            <Text style={[styles.introDesc, { color: colors.textSub }]}>
              Every round chanted, page read, and hour of service offered contributes to the collective energy of our congregation. Keep inspiring each other!
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.grid}>
            {stats.map((stat, idx) => (
              <View 
                key={idx} 
                style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={[styles.iconBg, { backgroundColor: colors.divider }]}>
                  <Text style={styles.icon}>{stat.icon}</Text>
                </View>
                <Text style={[styles.statVal, { color: colors.textMain }]}>{stat.val}</Text>
                <Text style={[styles.statSub, { color: colors.textSub }]}>{stat.sub}</Text>
                <Text style={[styles.statLabel, { color: colors.textSub }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Bottom active group section */}
          <Text style={[styles.subHeading, { color: colors.textMain }]}>Active Community Boards</Text>
          
          <View style={[styles.boardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.boardIcon}>📣</Text>
            <View style={styles.boardInfo}>
              <Text style={[styles.boardTitle, { color: colors.textMain }]}>Daily Chanting Sangha</Text>
              <Text style={[styles.boardMembers, { color: colors.textSub }]}>412 Chanting Devotees Active Today</Text>
            </View>
            <TouchableOpacity style={[styles.joinBtn, { backgroundColor: colors.accentGold }]}>
              <Text style={[styles.joinBtnText, { color: '#160826' }]}>Join</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.boardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.boardIcon}>📖</Text>
            <View style={styles.boardInfo}>
              <Text style={[styles.boardTitle, { color: colors.textMain }]}>Srimad Bhagavatam Study Group</Text>
              <Text style={[styles.boardMembers, { color: colors.textSub }]}>Weekly discussions every Friday</Text>
            </View>
            <TouchableOpacity style={[styles.joinBtn, { backgroundColor: colors.accentGold }]}>
              <Text style={[styles.joinBtnText, { color: '#160826' }]}>Join</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.introTitle, { color: colors.textMain }]}>My Bhakti Groups</Text>
            <Text style={[styles.introDesc, { color: colors.textSub }]}>
              Join a local group to participate in weekly Satsangs, Harinams, and Sevas near your location.
            </Text>
          </View>

          <View style={[styles.boardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.boardIcon}>🏡</Text>
            <View style={styles.boardInfo}>
              <Text style={[styles.boardTitle, { color: colors.textMain }]}>Sankirtan Team Vizag</Text>
              <Text style={[styles.boardMembers, { color: colors.textSub }]}>120 Members • Sector 5 Area</Text>
            </View>
            <TouchableOpacity style={[styles.joinedBtn, { borderColor: colors.textMain }]}>
              <Text style={[styles.joinedBtnText, { color: colors.textMain }]}>Entered</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.boardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.boardIcon}>🍲</Text>
            <View style={styles.boardInfo}>
              <Text style={[styles.boardTitle, { color: colors.textMain }]}>Sunday Feast Kitchen Seva</Text>
              <Text style={[styles.boardMembers, { color: colors.textSub }]}>45 Members • Temple Main Kitchen</Text>
            </View>
            <TouchableOpacity style={[styles.joinBtn, { backgroundColor: colors.accentGold }]}>
              <Text style={[styles.joinBtnText, { color: '#160826' }]}>Join</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 10,
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
  joinedBtn: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  joinedBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
