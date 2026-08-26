import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface JourneyScreenProps {
  t: any;
  colors: any;
  currentStreak: number;
  bestStreak: number;
  thisMonthRounds: number;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  t,
  colors,
  currentStreak,
  bestStreak,
  thisMonthRounds,
}) => {
  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>🌱 {t.myProgress}</Text>

      {/* Weekly Journey Graph Simulation */}
      <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.chartHeaderTitle, { color: colors.textMain }]}>{t.japa} ({t.rounds})</Text>
        
        {/* Custom Styled Charts */}
        <View style={styles.chartVisualArea}>
          
          {/* Mon */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 120, backgroundColor: colors.textMain }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>M</Text>
          </View>
          
          {/* Tue */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 160, backgroundColor: colors.accentGold }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>T</Text>
          </View>

          {/* Wed */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 140, backgroundColor: colors.textMain }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>W</Text>
          </View>

          {/* Thu */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 160, backgroundColor: colors.accentGold }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>T</Text>
          </View>

          {/* Fri */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 100, backgroundColor: colors.textMain }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>F</Text>
          </View>

          {/* Sat */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 160, backgroundColor: colors.accentGold }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>S</Text>
          </View>

          {/* Sun */}
          <View style={styles.chartCol}>
            <View style={[styles.chartBarFilled, { height: 160, backgroundColor: colors.accentGold }]} />
            <Text style={[styles.chartBarLabel, { color: colors.textSub }]}>S</Text>
          </View>

        </View>
        <Text style={[styles.chartLegendText, { color: colors.textSub }]}>
          Consistency is more important than perfection. Keep chanting!
        </Text>
      </View>

      {/* Progress Summary Cards */}
      <View style={[styles.streakStatsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.streakTitle, { color: colors.textMain }]}>📊 Streak Details</Text>
        
        <View style={styles.journeyStatItem}>
          <Text style={[styles.journeyStatLabel, { color: colors.textSub }]}>{t.currentStreak}</Text>
          <Text style={[styles.journeyStatVal, { color: colors.textMain }]}>{currentStreak} {t.days}</Text>
        </View>
        
        <View style={styles.journeyStatItem}>
          <Text style={[styles.journeyStatLabel, { color: colors.textSub }]}>{t.bestStreak}</Text>
          <Text style={[styles.journeyStatVal, { color: colors.accentGold }]}>{bestStreak} {t.days}</Text>
        </View>

        <View style={styles.journeyStatItem}>
          <Text style={[styles.journeyStatLabel, { color: colors.textSub }]}>Chanted this month</Text>
          <Text style={[styles.journeyStatVal, { color: colors.textMain }]}>{thisMonthRounds} {t.rounds}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  chartHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartVisualArea: {
    flexDirection: 'row',
    height: 180,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE5D8',
  },
  chartCol: {
    alignItems: 'center',
    width: 30,
  },
  chartBarFilled: {
    width: 14,
    borderRadius: 7,
  },
  chartBarLabel: {
    fontSize: 11,
    marginTop: 8,
    fontWeight: 'bold',
  },
  chartLegendText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  streakStatsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  journeyStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  journeyStatLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  journeyStatVal: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
