import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface UpdatesScreenProps {
  t: any;
  colors: any;
  activeUpdateFilter: 'all' | 'festival' | 'temple' | 'classes' | 'seva';
  setActiveUpdateFilter: (val: 'all' | 'festival' | 'temple' | 'classes' | 'seva') => void;
}

export const UpdatesScreen: React.FC<UpdatesScreenProps> = ({
  t,
  colors,
  activeUpdateFilter,
  setActiveUpdateFilter,
}) => {
  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>📢 ISKCON Vizag Announcements</Text>

      {/* Feed Type Splitter (Official vs Community) */}
      <View style={[styles.filterSegmentContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('all')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'all' && { backgroundColor: colors.textMain }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'all' ? colors.pureWhite : colors.textSub }]}>{t.all}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('festival')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'festival' && { backgroundColor: colors.textMain }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'festival' ? colors.pureWhite : colors.textSub }]}>{t.festivals}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('temple')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'temple' && { backgroundColor: colors.textMain }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'temple' ? colors.pureWhite : colors.textSub }]}>{t.temple}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('classes')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'classes' && { backgroundColor: colors.textMain }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'classes' ? colors.pureWhite : colors.textSub }]}>{t.classes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('seva')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'seva' && { backgroundColor: colors.textMain }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'seva' ? colors.pureWhite : colors.textSub }]}>{t.sevaCat}</Text>
        </TouchableOpacity>
      </View>

      {/* LIST OF EVENTS */}
      <View style={styles.announcementsFeedList}>
        
        {/* Official Temple Notice 1 */}
        {(activeUpdateFilter === 'all' || activeUpdateFilter === 'festival') && (
          <View style={[styles.feedCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.feedHeader}>
              <Text style={[styles.feedSourceTag, { color: colors.accentGold }]}>📢 {t.official}</Text>
              <Text style={[styles.feedTime, { color: colors.textSub }]}>2h ago</Text>
            </View>
            <Text style={[styles.feedTitle, { color: colors.textMain }]}>Janmashtami Celebrations</Text>
            <Text style={[styles.feedDesc, { color: colors.textSub }]}>
              Join Sri Krishna Janmashtami abhishek, kirtan and special mahaprasadam feast. Seva options available.
            </Text>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1590050752117-238cb061295a?q=80&w=600&auto=format&fit=crop' }} 
              style={styles.feedImage} 
            />
            <TouchableOpacity style={styles.feedAction}>
              <Text style={[styles.feedActionText, { color: colors.textMain }]}>{t.viewDetails} {'>'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Official Temple Notice 2 */}
        {(activeUpdateFilter === 'all' || activeUpdateFilter === 'temple') && (
          <View style={[styles.feedCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.feedHeader}>
              <Text style={[styles.feedSourceTag, { color: colors.accentGold }]}>📢 {t.official}</Text>
              <Text style={[styles.feedTime, { color: colors.textSub }]}>5h ago</Text>
            </View>
            <Text style={[styles.feedTitle, { color: colors.textMain }]}>Mangala Arati Timing Change</Text>
            <Text style={[styles.feedDesc, { color: colors.textSub }]}>
              Due to seasonal change, starting tomorrow Mangala Arati starts at 4:15 AM instead of 4:30 AM. Devotees are requested to cooperate.
            </Text>
            <TouchableOpacity style={styles.feedAction}>
              <Text style={[styles.feedActionText, { color: colors.textMain }]}>{t.viewDetails} {'>'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Community/Devotee notice */}
        {(activeUpdateFilter === 'all' || activeUpdateFilter === 'seva') && (
          <View style={[styles.feedCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.feedHeader}>
              <Text style={[styles.feedSourceTag, { color: colors.navInactive }]}>👥 {t.community}</Text>
              <Text style={[styles.feedTime, { color: colors.textSub }]}>1d ago</Text>
            </View>
            <Text style={[styles.feedTitle, { color: colors.textMain }]}>Rath Yatra 2026 Garland Seva</Text>
            <Text style={[styles.feedDesc, { color: colors.textSub }]}>
              Devotees needed for garland stringing seva for Jagannatha Rath Yatra on Sunday evening. Please sign up inside.
            </Text>
            <TouchableOpacity style={styles.feedAction}>
              <Text style={[styles.feedActionText, { color: colors.textMain }]}>{t.viewDetails} {'>'}</Text>
            </TouchableOpacity>
          </View>
        )}

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
  filterSegmentContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  announcementsFeedList: {
    marginTop: 5,
  },
  feedCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedSourceTag: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  feedTime: {
    fontSize: 11,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  feedImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  feedAction: {
    alignSelf: 'flex-start',
  },
  feedActionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
