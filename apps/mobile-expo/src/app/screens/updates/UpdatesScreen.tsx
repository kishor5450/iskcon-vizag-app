import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { IAnnouncement, AnnouncementType } from '@temple/models';
import { api } from '../utils/api';

interface DynamicImageProps {
  uri: string;
  style?: any;
  borderRadius?: number;
}

const DynamicImage: React.FC<DynamicImageProps> = ({ uri, style, borderRadius = 0 }) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

interface UpdatesScreenProps {
  t: any;
  colors: any;
  activeUpdateFilter: 'all' | 'festival' | 'temple' | 'classes' | 'seva';
  setActiveUpdateFilter: (val: 'all' | 'festival' | 'temple' | 'classes' | 'seva') => void;
  token?: string;
}

export const UpdatesScreen: React.FC<UpdatesScreenProps> = ({
  t,
  colors,
  activeUpdateFilter,
  setActiveUpdateFilter,
  token,
}) => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAnnouncements = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAnnouncements(token);
      setAnnouncements(data);
    } catch (err) {
      console.log('Failed fetching announcements: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  // Fallback mock announcements if backend database returns empty list
  const fallbackAnnouncements: IAnnouncement[] = [
    {
      id: 1,
      title: 'Janmashtami Celebrations',
      description: 'Join Sri Krishna Janmashtami abhishek, kirtan and special mahaprasadam feast. Seva options available.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
      type: AnnouncementType.FESTIVAL,
      date: '25 Aug - 27 Aug',
      official: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Mangala Arati Timing Change',
      description: 'Due to seasonal change, starting tomorrow Mangala Arati starts at 4:15 AM instead of 4:30 AM. Devotees are requested to cooperate.',
      type: AnnouncementType.TEMPLE,
      date: 'Today',
      official: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Rath Yatra 2026 Garland Seva',
      description: 'Devotees needed for garland stringing seva for Jagannatha Rath Yatra on Sunday evening. Please sign up inside.',
      type: AnnouncementType.SEVA,
      date: '1d ago',
      official: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const itemsToDisplay = announcements.length > 0 ? announcements : fallbackAnnouncements;

  const filteredItems = itemsToDisplay.filter((item) => {
    if (activeUpdateFilter === 'all') return true;
    if (activeUpdateFilter === 'festival') return item.type === AnnouncementType.FESTIVAL;
    if (activeUpdateFilter === 'temple') return item.type === AnnouncementType.TEMPLE;
    if (activeUpdateFilter === 'classes') return item.type === AnnouncementType.CLASSES;
    if (activeUpdateFilter === 'seva') return item.type === AnnouncementType.SEVA;
    return true;
  });

  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>🐚 Announcements</Text>

      {/* Feed Filters */}
      <View style={[styles.filterSegmentContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('all')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'all' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'all' ? '#160826' : colors.textSub }]}>{t.all}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('festival')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'festival' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'festival' ? '#160826' : colors.textSub }]}>{t.festivals}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('temple')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'temple' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'temple' ? '#160826' : colors.textSub }]}>{t.temple}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('classes')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'classes' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'classes' ? '#160826' : colors.textSub }]}>{t.classes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveUpdateFilter('seva')} 
          style={[styles.segmentBtn, activeUpdateFilter === 'seva' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.segmentText, { color: activeUpdateFilter === 'seva' ? '#160826' : colors.textSub }]}>{t.sevaCat}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accentGold} style={{ marginTop: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.announcementsFeedList} showsVerticalScrollIndicator={false}>
          {filteredItems.map((item) => (
            <View key={item.id} style={[styles.feedCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.feedHeader}>
                <Text style={[styles.feedSourceTag, { color: item.official ? colors.accentGold : colors.navInactive }]}>
                  {item.official ? `🐚 ${t.official}` : `🪷 ${t.community}`}
                </Text>
                <Text style={[styles.feedTime, { color: colors.textSub }]}>{item.date}</Text>
              </View>
              
              <Text style={[styles.feedTitle, { color: colors.textMain }]}>{item.title}</Text>
              <Text style={[styles.feedDesc, { color: colors.textSub }]}>{item.description}</Text>
              
              {item.image ? (
                <DynamicImage uri={item.image} style={styles.feedImage} borderRadius={12} />
              ) : null}

              <TouchableOpacity style={styles.feedAction}>
                <Text style={[styles.feedActionText, { color: colors.textMain }]}>{t.viewDetails} {'>'}</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {filteredItems.length === 0 && (
            <Text style={[styles.noUpdatesText, { color: colors.textSub }]}>No announcements in this category.</Text>
          )}
        </ScrollView>
      )}
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
    paddingBottom: 60,
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
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  feedAction: {
    alignSelf: 'flex-start',
  },
  feedActionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  noUpdatesText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});
