import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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
}) => {
  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>📿 Japa Counter</Text>
      
      {/* Circular Bead Counter Render */}
      <View style={styles.japaBeadSection}>
        <View style={styles.counterStats}>
          <Text style={[styles.roundsTitle, { color: colors.textSub }]}>{t.japa}</Text>
          <Text style={[styles.roundsMain, { color: colors.textMain }]}>{japaRounds} / {japaGoal}</Text>
          <Text style={[styles.beadProgress, { color: colors.textSub }]}>{japaCount} / 108 {t.rounds}</Text>
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
                  r={isActive ? 10 : 7}
                  fill={isActive ? colors.accentGold : isCompleted ? colors.textMain : colors.cardBorder}
                  stroke={isActive ? colors.textMain : 'none'}
                  strokeWidth={2}
                />
              );
            })}

            {/* Meru Bead (Guru Bead) at the top */}
            <Circle cx={110} cy={110 - radius} r={12} fill={colors.accentGold} />
          </Svg>

          {/* Tap Trigger Button */}
          <TouchableOpacity onPress={handleBeadPress} style={[styles.tapBeadBtn, { backgroundColor: colors.textMain }]}>
            <Text style={styles.tapBeadText}>{t.tapToCount}</Text>
          </TouchableOpacity>
          <Text style={[styles.beadTip, { color: colors.textSub }]}>{t.tapBead}</Text>
        </View>
      </View>

      {/* Daily Sadhana Checksheet */}
      <View style={[styles.checksheetCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.checksheetTitle, { color: colors.textMain }]}>🪷 {t.todaysSadhana}</Text>
        
        {/* Sadhana Checkbox List */}
        <TouchableOpacity onPress={() => setSadhanaJapa(!sadhanaJapa)} style={styles.checkRow}>
          <View style={[styles.checkbox, { borderColor: colors.textMain, backgroundColor: sadhanaJapa ? colors.textMain : 'transparent' }]}>
            {sadhanaJapa && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={[styles.checkLabel, { color: colors.textSub, textDecorationLine: sadhanaJapa ? 'line-through' : 'none' }]}>
            {t.japa} ({japaRounds} / {japaGoal} {t.rounds})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSadhanaReading(!sadhanaReading)} style={styles.checkRow}>
          <View style={[styles.checkbox, { borderColor: colors.textMain, backgroundColor: sadhanaReading ? colors.textMain : 'transparent' }]}>
            {sadhanaReading && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.checkLabel, { color: colors.textSub, textDecorationLine: sadhanaReading ? 'line-through' : 'none' }]}>
              {t.todaysReading} ({t.gitaVerse})
            </Text>
            <TextInput 
              style={[styles.readingInput, { borderColor: colors.cardBorder, color: colors.textSub }]} 
              defaultValue={t.gitaVerseRef}
              placeholder="Enter Chapter/Verse"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSadhanaArati(!sadhanaArati)} style={styles.checkRow}>
          <View style={[styles.checkbox, { borderColor: colors.textMain, backgroundColor: sadhanaArati ? colors.textMain : 'transparent' }]}>
            {sadhanaArati && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={[styles.checkLabel, { color: colors.textSub, textDecorationLine: sadhanaArati ? 'line-through' : 'none' }]}>
            {t.mangalaArati} (4:15 AM)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSadhanaPrayer(!sadhanaPrayer)} style={styles.checkRow}>
          <View style={[styles.checkbox, { borderColor: colors.textMain, backgroundColor: sadhanaPrayer ? colors.textMain : 'transparent' }]}>
            {sadhanaPrayer && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={[styles.checkLabel, { color: colors.textSub, textDecorationLine: sadhanaPrayer ? 'line-through' : 'none' }]}>
            {t.morningPrayer}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSadhanaLecture(!sadhanaLecture)} style={styles.checkRow}>
          <View style={[styles.checkbox, { borderColor: colors.textMain, backgroundColor: sadhanaLecture ? colors.textMain : 'transparent' }]}>
            {sadhanaLecture && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={[styles.checkLabel, { color: colors.textSub, textDecorationLine: sadhanaLecture ? 'line-through' : 'none' }]}>
            {t.spiritualLecture} (20 mins)
          </Text>
        </TouchableOpacity>

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
  japaBeadSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  counterStats: {
    alignItems: 'center',
    marginBottom: 10,
  },
  roundsTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roundsMain: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  beadProgress: {
    fontSize: 16,
    fontWeight: '600',
  },
  beadSvgContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  tapBeadBtn: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 40,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tapBeadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  beadTip: {
    marginTop: 15,
    fontSize: 12,
    fontWeight: '500',
  },
  checksheetCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  checksheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkMark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  readingInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    marginTop: 4,
    width: '90%',
  },
});
