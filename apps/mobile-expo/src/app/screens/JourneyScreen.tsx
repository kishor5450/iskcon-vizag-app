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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

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

  useEffect(() => {
    setCurrentDate(new Date());
  }, [timeframe]);

  // Date utilities to get local days of the week (Mon-Sun) relative to refDate
  const getWeekDays = (refDate: Date) => {
    const day = refDate.getDay();
    // Adjust so week starts on Monday (1) instead of Sunday (0)
    const diff = refDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(refDate.getFullYear(), refDate.getMonth(), diff);
    
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

  const getWeekRangeLabel = (dates: string[]) => {
    if (dates.length < 7) return '';
    const start = new Date(dates[0]);
    const end = new Date(dates[6]);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const getMonthLabel = (refDate: Date) => {
    return refDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getYearLabel = (refDate: Date) => {
    return refDate.getFullYear().toString();
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const prevYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const nextYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const getMonthlyData = (refDate: Date) => {
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const weekRanges = [
      { start: 1, end: 7 },
      { start: 8, end: 14 },
      { start: 15, end: 21 },
      { start: 22, end: 28 },
      { start: 29, end: daysInMonth }
    ];
    
    const activeRanges = weekRanges.filter(w => w.start <= daysInMonth);
    
    return activeRanges.map((range, index) => {
      let totalJapa = 0;
      let totalReading = 0;
      let totalSadhana = 0;
      let recordsCount = 0;
      
      for (let day = range.start; day <= range.end; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = history.find(r => r.date === dateStr);
        if (record) {
          totalJapa += record.japaRoundsCount;
          if (record.readingCompleted) totalReading += 20;
          
          const count = [
            record.japaRoundsCount >= 16,
            record.readingCompleted,
            record.mangalaArati,
            record.morningPrayer,
            record.spiritualLecture
          ].filter(Boolean).length;
          totalSadhana += count;
          recordsCount++;
        }
      }
      
      return {
        day: weekLabels[index],
        japaValue: recordsCount > 0 ? totalJapa / recordsCount : 0,
        readingValue: recordsCount > 0 ? totalReading / recordsCount : 0,
        sadhanaValue: recordsCount > 0 ? totalSadhana / recordsCount : 0,
        active: recordsCount > 0
      };
    });
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const getYearlyData = (refDate: Date) => {
    const year = refDate.getFullYear();
    
    return monthLabels.map((label, monthIndex) => {
      let totalJapa = 0;
      let totalReading = 0;
      let totalSadhana = 0;
      let recordsCount = 0;
      
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = history.find(r => r.date === dateStr);
        if (record) {
          totalJapa += record.japaRoundsCount;
          if (record.readingCompleted) totalReading += 20;
          
          const count = [
            record.japaRoundsCount >= 16,
            record.readingCompleted,
            record.mangalaArati,
            record.morningPrayer,
            record.spiritualLecture
          ].filter(Boolean).length;
          totalSadhana += count;
          recordsCount++;
        }
      }
      
      return {
        day: label,
        japaValue: recordsCount > 0 ? totalJapa / recordsCount : 0,
        readingValue: recordsCount > 0 ? totalReading / recordsCount : 0,
        sadhanaValue: recordsCount > 0 ? totalSadhana / recordsCount : 0,
        active: recordsCount > 0
      };
    });
  };

  const handlePrev = () => {
    if (timeframe === 'week') {
      prevWeek();
    } else if (timeframe === 'month') {
      prevMonth();
    } else {
      prevYear();
    }
  };

  const handleNext = () => {
    if (timeframe === 'week') {
      nextWeek();
    } else if (timeframe === 'month') {
      nextMonth();
    } else {
      nextYear();
    }
  };

  const weekDates = getWeekDays(currentDate);
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Parse Japa Chart Data (weekly)
  const japaWeeklyData = dayLabels.map((label, index) => {
    const dateStr = weekDates[index];
    const record = history.find((r) => r.date === dateStr);
    return {
      day: label,
      value: record ? record.japaRoundsCount : 0,
      active: !!record,
    };
  });

  // Parse Reading Chart Data (weekly)
  const readingWeeklyData = dayLabels.map((label, index) => {
    const dateStr = weekDates[index];
    const record = history.find((r) => r.date === dateStr);
    return {
      day: label,
      value: record ? (record.readingCompleted ? 20 : 0) : 0,
      active: !!record,
    };
  });

  // Parse Sadhana Checklist Chart Data (weekly)
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

  // Monthly Chart Data mapping
  const monthlyGroupedData = getMonthlyData(currentDate);
  const japaMonthlyData = monthlyGroupedData.map(d => ({ day: d.day, value: d.japaValue, active: d.active }));
  const readingMonthlyData = monthlyGroupedData.map(d => ({ day: d.day, value: d.readingValue, active: d.active }));
  const sadhanaMonthlyData = monthlyGroupedData.map(d => ({ day: d.day, value: d.sadhanaValue, active: d.active }));

  // Yearly Chart Data mapping
  const yearlyGroupedData = getYearlyData(currentDate);
  const japaYearlyData = yearlyGroupedData.map(d => ({ day: d.day, value: d.japaValue, active: d.active }));
  const readingYearlyData = yearlyGroupedData.map(d => ({ day: d.day, value: d.readingValue, active: d.active }));
  const sadhanaYearlyData = yearlyGroupedData.map(d => ({ day: d.day, value: d.sadhanaValue, active: d.active }));

  let activeJapaData = japaWeeklyData;
  let activeReadingData = readingWeeklyData;
  let activeSadhanaData = sadhanaWeeklyData;
  
  let japaSummary = '';
  let readingSummary = '';
  let sadhanaSummary = '';

  if (timeframe === 'week') {
    const japaDaysCount = japaWeeklyData.filter((d) => d.active && d.value > 0).length;
    const readingDaysCount = readingWeeklyData.filter((d) => d.active && d.value > 0).length;
    const sadhanaDaysCount = sadhanaWeeklyData.filter((d) => d.active && d.value > 0).length;

    activeJapaData = japaWeeklyData;
    activeReadingData = readingWeeklyData;
    activeSadhanaData = sadhanaWeeklyData;

    japaSummary = `${japaDaysCount} / 7 Days Chanted`;
    readingSummary = `${readingDaysCount} / 7 Days Read`;
    sadhanaSummary = `${sadhanaDaysCount} / 7 Days Completed`;
  } else if (timeframe === 'month') {
    const monthRecords = history.filter(r => {
      const d = new Date(r.date);
      return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
    });
    const avgJapa = monthRecords.length > 0 ? (monthRecords.reduce((sum, r) => sum + r.japaRoundsCount, 0) / monthRecords.length).toFixed(1) : '0';
    const avgReading = monthRecords.length > 0 ? (monthRecords.reduce((sum, r) => sum + (r.readingCompleted ? 20 : 0), 0) / monthRecords.length).toFixed(1) : '0';
    const avgSadhana = monthRecords.length > 0 ? (monthRecords.reduce((sum, r) => {
      const count = [
        r.japaRoundsCount >= 16,
        r.readingCompleted,
        r.mangalaArati,
        r.morningPrayer,
        r.spiritualLecture
      ].filter(Boolean).length;
      return sum + count;
    }, 0) / monthRecords.length).toFixed(1) : '0';

    activeJapaData = japaMonthlyData;
    activeReadingData = readingMonthlyData;
    activeSadhanaData = sadhanaMonthlyData;

    japaSummary = `Avg: ${avgJapa} Rounds`;
    readingSummary = `Avg: ${avgReading} min`;
    sadhanaSummary = `Avg: ${avgSadhana} / 5 Items`;
  } else {
    const yearRecords = history.filter(r => {
      const d = new Date(r.date);
      return d.getFullYear() === currentDate.getFullYear();
    });
    const avgJapa = yearRecords.length > 0 ? (yearRecords.reduce((sum, r) => sum + r.japaRoundsCount, 0) / yearRecords.length).toFixed(1) : '0';
    const avgReading = yearRecords.length > 0 ? (yearRecords.reduce((sum, r) => sum + (r.readingCompleted ? 20 : 0), 0) / yearRecords.length).toFixed(1) : '0';
    const avgSadhana = yearRecords.length > 0 ? (yearRecords.reduce((sum, r) => {
      const count = [
        r.japaRoundsCount >= 16,
        r.readingCompleted,
        r.mangalaArati,
        r.morningPrayer,
        r.spiritualLecture
      ].filter(Boolean).length;
      return sum + count;
    }, 0) / yearRecords.length).toFixed(1) : '0';

    activeJapaData = japaYearlyData;
    activeReadingData = readingYearlyData;
    activeSadhanaData = sadhanaYearlyData;

    japaSummary = `Avg: ${avgJapa} Rounds`;
    readingSummary = `Avg: ${avgReading} min`;
    sadhanaSummary = `Avg: ${avgSadhana} / 5 Items`;
  }

  const getDateLabel = () => {
    if (timeframe === 'week') {
      return getWeekRangeLabel(weekDates);
    } else if (timeframe === 'month') {
      return getMonthLabel(currentDate);
    } else {
      return getYearLabel(currentDate);
    }
  };

  const renderChart = (
    title: string,
    summary: string,
    data: { day: string; value: number; active: boolean }[],
    barColor: string
  ) => {
    return (
      <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.textMain }]}>{title}</Text>
          <Text style={[styles.chartSummary, { color: colors.accentGold }]}>{summary}</Text>
        </View>

        <View style={styles.chartBarsArea}>
          {data.map((item, idx) => {
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
        <TouchableOpacity onPress={handlePrev}><Text style={[styles.dateArrow, { color: colors.textSub }]}>‹</Text></TouchableOpacity>
        <Text style={[styles.dateText, { color: colors.textMain }]}>{getDateLabel()}</Text>
        <TouchableOpacity onPress={handleNext}><Text style={[styles.dateArrow, { color: colors.textSub }]}>›</Text></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accentGold} style={{ marginTop: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderChart('Japa', japaSummary, activeJapaData, '#27AE60')}
          {renderChart('Reading', readingSummary, activeReadingData, '#F2994A')}
          {renderChart('Sadhana', sadhanaSummary, activeSadhanaData, '#2D9CDB')}

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
