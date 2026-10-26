import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import { IDevotee, IAnnouncement, AnnouncementType } from '@temple/models';
import { api } from '../utils/api';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AdminScreenProps {
  t: any;
  colors: any;
  token?: string;
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  t,
  colors,
  token,
  onBack,
}) => {
  const [subTab, setSubTab] = useState<'devotees' | 'announcements'>('devotees');
  const [devotees, setDevotees] = useState<IDevotee[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Announcement Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [annType, setAnnType] = useState<AnnouncementType>(AnnouncementType.FESTIVAL);
  const [dateInfo, setDateInfo] = useState('');
  const [timeInfo, setTimeInfo] = useState('');
  const [locInfo, setLocInfo] = useState('');
  const [isOfficial, setIsOfficial] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Date/Time picker helper state
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const devList = await api.getDevotees(token);
      setDevotees(devList);
      const annList = await api.getAnnouncements(token);
      setAnnouncements(annList);
    } catch (err) {
      console.log('Admin Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!token) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setFormError('Permission to access image library is required.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadingPhoto(true);
        setFormError('');
        setFormSuccess('');
        const uploadRes = await api.uploadAnnouncementImage(token, result.assets[0].uri);
        setImageUrl(uploadRes.url);
        setFormSuccess('Photo uploaded successfully! Preview shown below.');
      }
    } catch (err: any) {
      console.log('Upload error:', err);
      setFormError(err.message || 'Image upload failed. Try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (time: Date) => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minStr} ${ampm}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateValue(selectedDate);
      setDateInfo(formatDate(selectedDate));
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTimeValue(selectedTime);
      setTimeInfo(formatTime(selectedTime));
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreateAnnouncement = async () => {
    if (!token) return;
    if (!title || !desc || !dateInfo) {
      setFormError('Title, Description, and Date are required');
      return;
    }

    setFormSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const payload = {
        title,
        description: desc,
        image: imageUrl || undefined,
        type: annType,
        date: dateInfo,
        time: timeInfo || undefined,
        location: locInfo || undefined,
        official: isOfficial,
      };

      await api.createAnnouncement(token, payload);
      setFormSuccess('Announcement posted successfully!');
      
      // Clear form
      setTitle('');
      setDesc('');
      setImageUrl('');
      setDateInfo('');
      setTimeInfo('');
      setLocInfo('');

      // Refresh announcements
      const list = await api.getAnnouncements(token);
      setAnnouncements(list);
    } catch (err: any) {
      setFormError(err.message || 'Failed to post announcement');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!token) return;
    try {
      await api.deleteAnnouncement(token, id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.log('Failed deleting announcement:', err);
    }
  };

  const filteredDevotees = devotees.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDevotees = devotees.length;
  const totalRounds = devotees.reduce((sum, d) => sum + d.totalRoundsChanted, 0);
  const avgRounds = totalDevotees > 0 ? Math.round(totalRounds / totalDevotees) : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={[styles.backBtnText, { color: colors.accentGold }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textMain }]}>Admin Console</Text>
      </View>

      {/* Quick Statistics Banner */}
      <View style={[styles.statsBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: colors.textMain }]}>{totalDevotees}</Text>
          <Text style={[styles.statLabel, { color: colors.textSub }]}>Devotees</Text>
        </View>
        <View style={[styles.statCol, styles.statBorder, { borderColor: colors.cardBorder }]}>
          <Text style={[styles.statValue, { color: colors.accentGold }]}>{totalRounds}</Text>
          <Text style={[styles.statLabel, { color: colors.textSub }]}>Total Rounds</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: colors.textMain }]}>{avgRounds}</Text>
          <Text style={[styles.statLabel, { color: colors.textSub }]}>Avg Rounds</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setSubTab('devotees')}
          style={[styles.tabBtn, subTab === 'devotees' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.tabText, { color: subTab === 'devotees' ? '#160826' : colors.textSub }]}>
            Devotee Sadhana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSubTab('announcements')}
          style={[styles.tabBtn, subTab === 'announcements' && { backgroundColor: colors.accentGold }]}
        >
          <Text style={[styles.tabText, { color: subTab === 'announcements' ? '#160826' : colors.textSub }]}>
            Announcements
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.accentGold} />
        </View>
      )}

      {!loading && subTab === 'devotees' && (
        <View style={{ flex: 1 }}>
          {/* Search Bar */}
          <TextInput
            placeholder="Search by name or email..."
            placeholderTextColor={colors.textSub}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, { backgroundColor: colors.card, color: colors.textMain, borderColor: colors.cardBorder }]}
          />

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {filteredDevotees.map((devotee, index) => {
              const rank = index + 1;
              const todayRecord = (devotee as any).todayRecord;
              const todayRounds = todayRecord?.japaRoundsCount || 0;
              const goal = devotee.japaGoal || 16;
              const japaPercent = Math.min(100, (todayRounds / goal) * 100);

              // Get styling based on rank
              const isTop3 = rank <= 3;
              const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
              const rankColor = rank === 1 ? '#ffd700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : colors.textSub;

              return (
                <View
                  key={devotee.id}
                  style={[
                    styles.devoteeCard, 
                    { backgroundColor: colors.card, borderColor: isTop3 ? rankColor : colors.cardBorder },
                    isTop3 && { borderWidth: 1.5 }
                  ]}
                >
                  {/* Devotee Info & Role */}
                  <View style={styles.devoteeHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={[styles.rankBadge, { color: rankColor, borderColor: rankColor }]}>
                        {rankEmoji}
                      </Text>
                      {devotee.avatarUrl ? (
                        <Image source={{ uri: devotee.avatarUrl }} style={styles.adminDevoteeAvatar} />
                      ) : (
                        <View style={[styles.adminDevoteeAvatar, { backgroundColor: colors.divider, alignItems: 'center', justifyContent: 'center' }]}>
                          <Text style={{ fontSize: 10, color: colors.textSub }}>👤</Text>
                        </View>
                      )}
                      <View style={{ marginLeft: 4, flex: 1 }}>
                        <Text style={[styles.devoteeName, { color: colors.textMain }]} numberOfLines={1}>{devotee.name}</Text>
                        <Text style={[styles.devoteeEmail, { color: colors.textSub }]} numberOfLines={1}>{devotee.email}</Text>
                      </View>
                    </View>
                    <View style={[styles.roleBadge, { backgroundColor: devotee.role === 'admin' ? 'rgba(217, 83, 79, 0.15)' : 'rgba(92, 184, 92, 0.15)' }]}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold', color: devotee.role === 'admin' ? '#D9534F' : '#5CB85C' }}>
                        {devotee.role.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Chanting progress bar */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressLabels}>
                      <Text style={[styles.progressText, { color: colors.textSub }]}>
                        Japa: <Text style={{ color: colors.textMain, fontWeight: 'bold' }}>{todayRounds}</Text> / {goal} rounds
                      </Text>
                      <Text style={[styles.progressPercentage, { color: colors.accentGold }]}>{Math.round(japaPercent)}%</Text>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.bg }]}>
                      <View style={[styles.progressBarFill, { width: `${japaPercent}%`, backgroundColor: todayRounds >= goal ? '#5CB85C' : colors.accentGold }]} />
                    </View>
                  </View>

                  {/* Sadhana checklist indicator row */}
                  <View style={styles.checklistIndicatorRow}>
                    {/* Japa */}
                    <View style={[styles.badgeIndicator, { backgroundColor: todayRounds > 0 ? 'rgba(215, 161, 92, 0.15)' : 'rgba(128,128,128,0.05)' }]}>
                      <Text style={[styles.badgeEmoji, todayRounds === 0 && { opacity: 0.35 }]}>📿</Text>
                      <Text style={[styles.badgeLabel, { color: todayRounds > 0 ? colors.accentGold : colors.textSub }]}>Japa</Text>
                    </View>
                    
                    {/* Reading */}
                    <View style={[styles.badgeIndicator, { backgroundColor: todayRecord?.readingCompleted ? 'rgba(92, 184, 92, 0.15)' : 'rgba(128,128,128,0.05)' }]}>
                      <Text style={[styles.badgeEmoji, !todayRecord?.readingCompleted && { opacity: 0.35 }]}>📖</Text>
                      <Text style={[styles.badgeLabel, { color: todayRecord?.readingCompleted ? '#5CB85C' : colors.textSub }]}>Read</Text>
                    </View>

                    {/* Arati */}
                    <View style={[styles.badgeIndicator, { backgroundColor: todayRecord?.mangalaArati ? 'rgba(92, 184, 92, 0.15)' : 'rgba(128,128,128,0.05)' }]}>
                      <Text style={[styles.badgeEmoji, !todayRecord?.mangalaArati && { opacity: 0.35 }]}>🪷</Text>
                      <Text style={[styles.badgeLabel, { color: todayRecord?.mangalaArati ? '#5CB85C' : colors.textSub }]}>Arati</Text>
                    </View>

                    {/* Prayer */}
                    <View style={[styles.badgeIndicator, { backgroundColor: todayRecord?.morningPrayer ? 'rgba(92, 184, 92, 0.15)' : 'rgba(128,128,128,0.05)' }]}>
                      <Text style={[styles.badgeEmoji, !todayRecord?.morningPrayer && { opacity: 0.35 }]}>🙏</Text>
                      <Text style={[styles.badgeLabel, { color: todayRecord?.morningPrayer ? '#5CB85C' : colors.textSub }]}>Prayer</Text>
                    </View>

                    {/* Lecture */}
                    <View style={[styles.badgeIndicator, { backgroundColor: todayRecord?.spiritualLecture ? 'rgba(92, 184, 92, 0.15)' : 'rgba(128,128,128,0.05)' }]}>
                      <Text style={[styles.badgeEmoji, !todayRecord?.spiritualLecture && { opacity: 0.35 }]}>🎙️</Text>
                      <Text style={[styles.badgeLabel, { color: todayRecord?.spiritualLecture ? '#5CB85C' : colors.textSub }]}>Lecture</Text>
                    </View>

                    {/* NBS */}
                    <View style={[styles.badgeIndicator, { backgroundColor: todayRecord?.nbsJoined ? 'rgba(92, 184, 92, 0.15)' : 'rgba(128,128,128,0.05)' }]}>
                      <Text style={[styles.badgeEmoji, !todayRecord?.nbsJoined && { opacity: 0.35 }]}>🔔</Text>
                      <Text style={[styles.badgeLabel, { color: todayRecord?.nbsJoined ? '#5CB85C' : colors.textSub }]}>NBS</Text>
                    </View>
                  </View>

                  {/* Reading Progress subtitle details if available */}
                  {todayRecord?.readingProgress ? (
                    <Text style={[styles.readingProgressDetail, { color: colors.textSub }]}>
                      📖 {todayRecord.readingProgress}
                    </Text>
                  ) : null}

                  {/* Devotee Streaks & Totals */}
                  <View style={[styles.devoteeCardFooter, { borderTopColor: colors.cardBorder }]}>
                    <Text style={[styles.footerStatText, { color: colors.textSub }]}>
                      Streak: <Text style={{ color: colors.textMain, fontWeight: 'bold' }}>{devotee.currentStreak} days</Text> (Best: {devotee.bestStreak})
                    </Text>
                    <Text style={[styles.footerStatText, { color: colors.textSub }]}>
                      Total: <Text style={{ color: colors.accentGold, fontWeight: 'bold' }}>{devotee.totalRoundsChanted} rounds</Text>
                    </Text>
                  </View>
                </View>
              );
            })}
            {filteredDevotees.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.textSub }]}>No devotees found.</Text>
            )}
          </ScrollView>
        </View>
      )}

      {!loading && subTab === 'announcements' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {/* Create Announcement Box */}
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.formHeader, { color: colors.textMain }]}>🐚 Post Temple Update</Text>

            {formSuccess ? <Text style={styles.successText}>{formSuccess}</Text> : null}
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <TextInput
              placeholder="Announcement Title *"
              placeholderTextColor={colors.textSub}
              value={title}
              onChangeText={setTitle}
              style={[styles.formInput, { backgroundColor: colors.bg, color: colors.textMain, borderColor: colors.cardBorder }]}
            />

            <TextInput
              placeholder="Description / Message *"
              placeholderTextColor={colors.textSub}
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={3}
              style={[styles.formInput, styles.multilineInput, { backgroundColor: colors.bg, color: colors.textMain, borderColor: colors.cardBorder }]}
            />



            <TouchableOpacity 
              onPress={handleUploadPhoto}
              disabled={uploadingPhoto}
              style={[styles.uploadBtn, { backgroundColor: colors.bg, borderColor: colors.accentGold }]}
            >
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color={colors.accentGold} />
              ) : (
                <Text style={[styles.uploadBtnText, { color: colors.accentGold }]}>
                  📷 Choose & Upload Photo from Gallery
                </Text>
              )}
            </TouchableOpacity>

            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                <TouchableOpacity onPress={() => setImageUrl('')} style={styles.removeImageBtn}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>Remove ×</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.selectorRow}>
              <Text style={[styles.selectorLabel, { color: colors.textSub }]}>Category:</Text>
              <View style={styles.categoryButtons}>
                {Object.values(AnnouncementType).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setAnnType(type)}
                    style={[styles.catBtn, annType === type && { backgroundColor: colors.accentGold }]}
                  >
                    <Text style={[styles.catBtnText, { color: annType === type ? '#160826' : colors.textSub }]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              style={[styles.formInput, { backgroundColor: colors.bg, borderColor: colors.cardBorder, justifyContent: 'center' }]}
            >
              <Text style={{ color: dateInfo ? colors.textMain : colors.textSub, fontSize: 12 }}>
                {dateInfo ? `📅 ${dateInfo}` : 'Select Date *'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <TouchableOpacity 
              onPress={() => setShowTimePicker(true)}
              style={[styles.formInput, { backgroundColor: colors.bg, borderColor: colors.cardBorder, justifyContent: 'center' }]}
            >
              <Text style={{ color: timeInfo ? colors.textMain : colors.textSub, fontSize: 12 }}>
                {timeInfo ? `🕒 ${timeInfo}` : 'Select Time (Optional)'}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={timeValue}
                mode="time"
                display="default"
                is24Hour={false}
                onChange={onChangeTime}
              />
            )}

            <TextInput
              placeholder="Location (e.g. Temple Hall)"
              placeholderTextColor={colors.textSub}
              value={locInfo}
              onChangeText={setLocInfo}
              style={[styles.formInput, { backgroundColor: colors.bg, color: colors.textMain, borderColor: colors.cardBorder }]}
            />

            <TouchableOpacity
              onPress={() => setIsOfficial(!isOfficial)}
              style={styles.toggleRow}
            >
              <View style={[styles.checkbox, { borderColor: colors.accentGold, backgroundColor: isOfficial ? colors.accentGold : 'transparent' }]}>
                {isOfficial && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={[styles.toggleText, { color: colors.textMain }]}>Official ISKCON Vizag Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreateAnnouncement}
              disabled={formSubmitting}
              style={[styles.submitBtn, { backgroundColor: colors.accentGold }]}
            >
              {formSubmitting ? (
                <ActivityIndicator size="small" color="#160826" />
              ) : (
                <Text style={styles.submitBtnText}>Post Announcement</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Manage Announcements List */}
          <Text style={[styles.listHeader, { color: colors.textMain }]}>Manage Existing Updates</Text>
          {announcements.map((ann) => (
            <View
              key={ann.id}
              style={[styles.annCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.annHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.annTitle, { color: colors.textMain }]}>{ann.title}</Text>
                  <Text style={[styles.annMeta, { color: colors.textSub }]}>
                    {ann.type.toUpperCase()} • {ann.date}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteAnnouncement(ann.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.annDesc, { color: colors.textSub }]} numberOfLines={2}>
                {ann.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsBanner: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    marginBottom: 16,
  },
  devoteeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  devoteeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankBadge: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 2,
  },
  devoteeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  devoteeEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressSection: {
    marginTop: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 11,
  },
  progressPercentage: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  checklistIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 4,
  },
  badgeIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeEmoji: {
    fontSize: 12,
  },
  badgeLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  readingProgressDetail: {
    fontSize: 10,
    marginTop: 8,
    fontStyle: 'italic',
  },
  devoteeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  footerStatText: {
    fontSize: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  formHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  formInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12,
    marginBottom: 10,
  },
  multilineInput: {
    height: 70,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  selectorRow: {
    marginBottom: 10,
  },
  selectorLabel: {
    fontSize: 11,
    marginBottom: 6,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  catBtnText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxTick: {
    color: '#160826',
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#160826',
    fontSize: 13,
    fontWeight: 'bold',
  },
  successText: {
    color: '#5CB85C',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: '#D9534F',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  annCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  annHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  annTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  annMeta: {
    fontSize: 10,
    marginTop: 1,
  },
  annDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  deleteBtn: {
    backgroundColor: 'rgba(217, 83, 79, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteBtnText: {
    color: '#D9534F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  uploadBtn: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    height: 120,
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(217, 83, 79, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminDevoteeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 6,
    marginRight: 6,
  },
});
