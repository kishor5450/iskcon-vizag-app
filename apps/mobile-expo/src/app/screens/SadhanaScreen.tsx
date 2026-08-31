import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface SadhanaScreenProps {
  t: any;
  colors: any;
  japaRounds: number;
  japaGoal: number;
  japaCount: number;
  handleBeadPress: () => void;
  beads: { x: number; y: number; index: number }[];
  activeBeadIndex: number;
  sadhanaJapa: boolean;
  setSadhanaJapa: (val: boolean) => void;
  sadhanaReading: boolean;
  setSadhanaReading: (val: boolean) => void;
  sadhanaArati: boolean;
  setSadhanaArati: (val: boolean) => void;
  sadhanaPrayer: boolean;
  setSadhanaPrayer: (val: boolean) => void;
  sadhanaLecture: boolean;
  setSadhanaLecture: (val: boolean) => void;
  radius: number;
  readingProgress: string;
  thisWeekRounds: number;
  thisMonthRounds: number;
  handleJapaRoundChange: (amount: number) => void;
}

export const SadhanaScreen: React.FC<SadhanaScreenProps> = ({
  t,
  colors,
  japaRounds,
  japaGoal,
  japaCount,
  handleBeadPress,
  beads,
  activeBeadIndex,
  sadhanaJapa,
  setSadhanaJapa,
  sadhanaReading,
  setSadhanaReading,
  sadhanaArati,
  setSadhanaArati,
  sadhanaPrayer,
  setSadhanaPrayer,
  sadhanaLecture,
  setSadhanaLecture,
  radius,
  readingProgress,
  thisWeekRounds,
  thisMonthRounds,
  handleJapaRoundChange,
}) => {
  const [subTab, setSubTab] = useState<'japa' | 'sadhana'>('japa');

  // Completed items count for daily progress
  const sadhanaCompletedCount = [
    sadhanaJapa,
    sadhanaReading,
    sadhanaArati,
    sadhanaPrayer,
    sadhanaLecture
  ].filter(Boolean).length;
  const sadhanaTotalCount = 5;

  // Streak details loaded dynamically from backend

  // Calculate circular progress path details
  const progressRatio = sadhanaCompletedCount / sadhanaTotalCount;
  const strokeDasharray = 2 * Math.PI * 30; // Radius = 30
  const strokeDashoffset = strokeDasharray * (1 - progressRatio);

  return (
    <View style={styles.container}>
      {/* Top Toggles */}
      <View style={[styles.tabToggleRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setSubTab('japa')}
          style={[styles.toggleBtn, subTab === 'japa' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.toggleBtnText, { color: subTab === 'japa' ? '#160826' : colors.textSub }]}>
            Japa Counter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubTab('sadhana')}
          style={[styles.toggleBtn, subTab === 'sadhana' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.toggleBtnText, { color: subTab === 'sadhana' ? '#160826' : colors.textSub }]}>
            Daily Sadhana
          </Text>
        </TouchableOpacity>
      </View>

      {subTab === 'japa' ? (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Today's Japa Header */}
          <View style={styles.counterStats}>
            <Text style={[styles.roundsTitle, { color: colors.textSub }]}>Today's Japa</Text>
            <Text style={[styles.roundsMain, { color: colors.textMain }]}>{japaRounds} / {japaGoal}</Text>
            <Text style={[styles.roundsSubtitle, { color: colors.textSub }]}>Rounds</Text>
          </View>

          {/* Svg Circle representation of Beads */}
          <View style={styles.beadSvgContainer}>
            <Svg width={220} height={220}>
              {/* Base circle guideline */}
              <Circle cx={110} cy={110} r={radius} stroke={colors.divider} strokeWidth={2} fill="none" />
              
              {/* Render beads */}
              {beads.map((bead) => {
                const isActive = bead.index === activeBeadIndex;
                const isCompleted = bead.index < activeBeadIndex;
                return (
                  <Circle
                    key={bead.index}
                    cx={bead.x}
                    cy={bead.y}
                    r={isActive ? 9 : 6}
                    fill={isActive ? colors.accentGold : isCompleted ? colors.textMain : colors.cardBorder}
                    stroke={isActive ? colors.textMain : 'none'}
                    strokeWidth={isActive ? 1.5 : 0}
                  />
                );
              })}

              {/* Meru Bead (Guru Bead) at the top */}
              <Circle cx={110} cy={110 - radius} r={11} fill={colors.accentGold} stroke={colors.textMain} strokeWidth={1} />
            </Svg>

            {/* Tap Trigger Button inside the bead ring */}
            <TouchableOpacity 
              onPress={handleBeadPress} 
              style={[styles.tapBeadBtn, { backgroundColor: colors.bg === '#160826' ? '#25143E' : '#8C1A1A' }]}
            >
              <Text style={[styles.tapBeadText, { color: colors.pureWhite }]}>Tap to{"\n"}count</Text>
              <Text style={[styles.tapBeadsCount, { color: colors.accentGold }]}>{japaCount} / 108</Text>
            </TouchableOpacity>
          </View>

          {/* Completing Action buttons */}
          <View style={styles.actionButtonRow}>
            <TouchableOpacity 
              onPress={() => handleJapaRoundChange(-1)} 
              style={[styles.controlBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <Text style={[styles.controlBtnText, { color: colors.textMain }]}>➖ -1 Round</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleJapaRoundChange(1)} 
              style={[styles.controlBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <Text style={[styles.controlBtnText, { color: colors.textMain }]}>➕ +1 Round</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.beadTip, { color: colors.textSub }]}>
            {japaRounds} Rounds Completed
          </Text>

          {/* Streaks Card */}
          <View style={[styles.streakStatsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.streakCol}>
              <Text style={[styles.streakVal, { color: colors.textMain }]}>{japaRounds}</Text>
              <Text style={[styles.streakLbl, { color: colors.textSub }]}>Today</Text>
              <Text style={[styles.streakSubLbl, { color: colors.textSub }]}>Rounds</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakCol}>
              <Text style={[styles.streakVal, { color: colors.textMain }]}>{thisWeekRounds}</Text>
              <Text style={[styles.streakLbl, { color: colors.textSub }]}>This Week</Text>
              <Text style={[styles.streakSubLbl, { color: colors.textSub }]}>Rounds</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakCol}>
              <Text style={[styles.streakVal, { color: colors.textMain }]}>{thisMonthRounds}</Text>
              <Text style={[styles.streakLbl, { color: colors.textSub }]}>This Month</Text>
              <Text style={[styles.streakSubLbl, { color: colors.textSub }]}>Rounds</Text>
            </View>
          </View>

          {/* Japa History Button */}
          <TouchableOpacity style={[styles.historyBtn, { borderColor: colors.accentGold }]}>
            <Text style={[styles.historyBtnText, { color: colors.accentGold }]}>📜 Japa History</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Date Selector */}
          <View style={styles.dateSelector}>
            <TouchableOpacity><Text style={[styles.dateArrow, { color: colors.textSub }]}>‹</Text></TouchableOpacity>
            <Text style={[styles.dateText, { color: colors.textMain }]}>Today, 21 May</Text>
            <TouchableOpacity><Text style={[styles.dateArrow, { color: colors.textSub }]}>›</Text></TouchableOpacity>
          </View>

          {/* Daily Checklist cards */}
          <View style={styles.checksList}>
            {/* Japa */}
            <TouchableOpacity 
              onPress={() => setSadhanaJapa(!sadhanaJapa)}
              style={[styles.checkRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.checkbox, { borderColor: colors.accentGold, backgroundColor: sadhanaJapa ? colors.accentGold : 'transparent' }]}>
                {sadhanaJapa && <Text style={styles.checkMarkIcon}>✓</Text>}
              </View>
              <View style={styles.checkTextInfo}>
                <Text style={[styles.checkTitle, { color: colors.textMain, textDecorationLine: sadhanaJapa ? 'line-through' : 'none' }]}>Japa</Text>
                <Text style={[styles.checkSub, { color: colors.textSub }]}>{japaRounds} / {japaGoal} Rounds</Text>
              </View>
            </TouchableOpacity>

            {/* Reading */}
            <TouchableOpacity 
              onPress={() => setSadhanaReading(!sadhanaReading)}
              style={[styles.checkRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.checkbox, { borderColor: colors.accentGold, backgroundColor: sadhanaReading ? colors.accentGold : 'transparent' }]}>
                {sadhanaReading && <Text style={styles.checkMarkIcon}>✓</Text>}
              </View>
              <View style={styles.checkTextInfo}>
                <Text style={[styles.checkTitle, { color: colors.textMain, textDecorationLine: sadhanaReading ? 'line-through' : 'none' }]}>Reading</Text>
                <Text style={[styles.checkSub, { color: colors.textSub }]}>{readingProgress}</Text>
              </View>
            </TouchableOpacity>

            {/* Mangala Arati */}
            <TouchableOpacity 
              onPress={() => setSadhanaArati(!sadhanaArati)}
              style={[styles.checkRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.checkbox, { borderColor: colors.accentGold, backgroundColor: sadhanaArati ? colors.accentGold : 'transparent' }]}>
                {sadhanaArati && <Text style={styles.checkMarkIcon}>✓</Text>}
              </View>
              <View style={styles.checkTextInfo}>
                <Text style={[styles.checkTitle, { color: colors.textMain, textDecorationLine: sadhanaArati ? 'line-through' : 'none' }]}>Mangala Arati</Text>
                <Text style={[styles.checkSub, { color: colors.textSub }]}>4:15 AM</Text>
              </View>
            </TouchableOpacity>

            {/* Morning Prayer */}
            <TouchableOpacity 
              onPress={() => setSadhanaPrayer(!sadhanaPrayer)}
              style={[styles.checkRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.checkbox, { borderColor: colors.accentGold, backgroundColor: sadhanaPrayer ? colors.accentGold : 'transparent' }]}>
                {sadhanaPrayer && <Text style={styles.checkMarkIcon}>✓</Text>}
              </View>
              <View style={styles.checkTextInfo}>
                <Text style={[styles.checkTitle, { color: colors.textMain, textDecorationLine: sadhanaPrayer ? 'line-through' : 'none' }]}>Morning Prayer</Text>
                <Text style={[styles.checkSub, { color: colors.textSub }]}>Completed</Text>
              </View>
            </TouchableOpacity>

            {/* Spiritual Lecture */}
            <TouchableOpacity 
              onPress={() => setSadhanaLecture(!sadhanaLecture)}
              style={[styles.checkRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.checkbox, { borderColor: colors.accentGold, backgroundColor: sadhanaLecture ? colors.accentGold : 'transparent' }]}>
                {sadhanaLecture && <Text style={styles.checkMarkIcon}>✓</Text>}
              </View>
              <View style={styles.checkTextInfo}>
                <Text style={[styles.checkTitle, { color: colors.textMain, textDecorationLine: sadhanaLecture ? 'line-through' : 'none' }]}>Spiritual Lecture</Text>
                <Text style={[styles.checkSub, { color: colors.textSub }]}>20 min</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Daily Progress Circular Ring */}
          <View style={[styles.progressDashboard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.progressLabelText, { color: colors.textSub }]}>Today's Progress</Text>
            
            <View style={styles.progressRingWrapper}>
              <Svg width={80} height={80} style={styles.progressRing}>
                <G rotation="-90" origin="40, 40">
                  {/* Background Circle */}
                  <Circle cx={40} cy={40} r={30} stroke={colors.divider} strokeWidth={6} fill="none" />
                  {/* Progress Circle */}
                  <Circle 
                    cx={40} 
                    cy={40} 
                    r={30} 
                    stroke={colors.accentGold} 
                    strokeWidth={6} 
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>
              <View style={styles.progressRingTextContainer}>
                <Text style={[styles.progressRingCountText, { color: colors.textMain }]}>
                  {sadhanaCompletedCount}/{sadhanaTotalCount}
                </Text>
                <Text style={[styles.progressRingSubText, { color: colors.textSub }]}>Completed</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabToggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  counterStats: {
    alignItems: 'center',
    marginBottom: 16,
  },
  roundsTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roundsMain: {
    fontSize: 44,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  roundsSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  beadSvgContainer: {
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  tapBeadBtn: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 45,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  tapBeadText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
  tapBeadsCount: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
  },
  actionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  controlBtn: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
  },
  controlBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  beadTip: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 20,
  },
  streakStatsCard: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  streakCol: {
    alignItems: 'center',
    width: '30%',
  },
  streakVal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakLbl: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  streakSubLbl: {
    fontSize: 8,
    fontWeight: '500',
  },
  streakDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  historyBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  dateArrow: {
    fontSize: 24,
    paddingHorizontal: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checksList: {
    width: '100%',
    marginBottom: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkMarkIcon: {
    color: '#160826',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkTextInfo: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkSub: {
    fontSize: 11,
    marginTop: 2,
  },
  progressDashboard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  progressLabelText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  progressRingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    marginRight: 16,
  },
  progressRingTextContainer: {
    alignItems: 'flex-start',
  },
  progressRingCountText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  progressRingSubText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
