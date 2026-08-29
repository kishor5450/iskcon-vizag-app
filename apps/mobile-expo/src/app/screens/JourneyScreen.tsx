import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ISadhanaRecord } from '@temple/models';
import { api } from '../utils/api';

interface JourneyScreenProps {
  t: any;
  colors: any;
  currentStreak: number;
  bestStreak: number;
  thisMonthRounds: number;
  onBack: () => void;
  token?: string;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  t,
  colors,
  currentStreak,
  bestStreak,
  thisMonthRounds,
  onBack,
  token,
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [history, setHistory] = useState<ISadhanaRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHistory = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getSadhanaHistory(token);
      setHistory(data);
    } catch (err) {
      console.log('Failed fetching history: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

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
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Parse Japa Chart Data
  const japaWeeklyData = dayLabels.map((label, index) => {
    const dateStr = weekDates[index];
    const record = history.find((r) => r.date === dateStr);
    return {
      day: label,
      value: record ? record.japaRoundsCount : 0,
      active: !!record,
    };
  });

  // Parse Reading Chart Data
  const readingWeeklyData = dayLabels.map((label, index) => {
    const dateStr = weekDates[index];
    const record = history.find((r) => r.date === dateStr);
    return {
      day: label,
      value: record ? (record.readingCompleted ? 20 : 0) : 0,
      active: !!record,
    };
  });

  // Parse Sadhana Checklist Chart Data
  const sadhanaWeeklyData = dayLabels.map((label, index) => {
    const dateStr = weekDates[index];
    const record = history.find((r) => r.date === dateStr);
    const count = record 
      ? [
          record.japaRoundsCount >= 16,
          record.readingCompleted,
          record.mangalaArati,
          record.morningPrayer,
          record.spiritualLecture
        ].filter(Boolean).length
      : 0;
    return {
      day: label,
      value: count,
      active: !!record,
    };
  });

  // Count active days in the current week
  const japaDaysCount = japaWeeklyData.filter((d) => d.active && d.value > 0).length;
  const readingDaysCount = readingWeeklyData.filter((d) => d.active && d.value > 0).length;
  const sadhanaDaysCount = sadhanaWeeklyData.filter((d) => d.active && d.value > 0).length;

  const renderChart = (title: string, summaryText: string, data: any[], barColor: string) => {
    return (
      <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.textMain }]}>{title}</Text>
          <Text style={[styles.chartSummary, { color: colors.textSub }]}>{summaryText}</Text>
        </View>
        <View style={styles.chartBarsArea}>
          {data.map((item, idx) => {
            // Normalize heights: max Japa = 16, max Reading = 20, max Sadhana = 5
            let height = 0;
            if (title.includes('Japa')) {
              height = (item.value / 16) * 75;
            } else if (title.includes('Reading')) {
              height = (item.value / 20) * 75;
            } else {
              height = (item.value / 5) * 75;
            }

            // Cap height to max height bounds
            if (height > 75) height = 75;

            return (
              <View key={idx} style={styles.barCol}>
                <View style={[styles.barTrack, { backgroundColor: colors.divider }]}>
                  {item.active && (
                    <View style={[styles.barFill, { height: height || 4, backgroundColor: barColor }]} />
                  )}
                </View>
                <Text style={[styles.barLabelText, { color: colors.textSub }]}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button & Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={[styles.backBtnText, { color: colors.accentGold }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textMain }]}>Bhakti Journey</Text>
      </View>

      {/* Week / Month / Year Toggles */}
      <View style={[styles.timeframeSegment, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setTimeframe('week')}
          style={[styles.segmentBtn, timeframe === 'week' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: timeframe === 'week' ? '#160826' : colors.textSub }]}>
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTimeframe('month')}
          style={[styles.segmentBtn, timeframe === 'month' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: timeframe === 'month' ? '#160826' : colors.textSub }]}>
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTimeframe('year')}
          style={[styles.segmentBtn, timeframe === 'year' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: timeframe === 'year' ? '#160826' : colors.textSub }]}>
            Year
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Range Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity><Text style={[styles.dateArrow, { color: colors.textSub }]}>‹</Text></TouchableOpacity>
        <Text style={[styles.dateText, { color: colors.textMain }]}>15 May - 21 May</Text>
        <TouchableOpacity><Text style={[styles.dateArrow, { color: colors.textSub }]}>›</Text></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accentGold} style={{ marginTop: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderChart('Japa', `${japaDaysCount} / 7 Days Chanted`, japaWeeklyData, '#27AE60')}
          {renderChart('Reading', `${readingDaysCount} / 7 Days Read`, readingWeeklyData, '#F2994A')}
          {renderChart('Sadhana', `${sadhanaDaysCount} / 7 Days Completed`, sadhanaWeeklyData, '#2D9CDB')}

          {/* Bottom Lotus Quote Card */}
          <View style={[styles.quoteCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={styles.quoteIcon}>🕉️</Text>
            <Text style={[styles.quoteText, { color: colors.textSub }]}>
              "Chant, read and remember Krishna.{"\n"}This is the essence of life."
            </Text>
            <View style={styles.templeSilhouette}>
              <Text style={{ fontSize: 40, opacity: 0.15, color: colors.accentGold }}>🪷 🛞 🪷</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    paddingVertical: 4,
    paddingRight: 12,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeframeSegment: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateArrow: {
    fontSize: 20,
    paddingHorizontal: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  chartSummary: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartBarsArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 95,
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: 'center',
    width: '12%',
  },
  barTrack: {
    height: 75,
    width: 8,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 6,
  },
  quoteCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 10,
    minHeight: 120,
  },
  quoteIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    zIndex: 2,
  },
  templeSilhouette: {
    position: 'absolute',
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
});
