/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { TRANSLATIONS } from '@temple/models';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const App = () => {
  // App Theme & Language settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const t = TRANSLATIONS[lang];

  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'sadhana' | 'updates' | 'journey' | 'profile'>('home');

  // Japa State variables
  const [japaCount, setJapaCount] = useState<number>(0);
  const [japaRounds, setJapaRounds] = useState<number>(8);
  const [japaGoal] = useState<number>(16);

  // Sadhana Check-in States
  const [sadhanaJapa, setSadhanaJapa] = useState<boolean>(true);
  const [sadhanaReading, setSadhanaReading] = useState<boolean>(true);
  const [sadhanaArati, setSadhanaArati] = useState<boolean>(false);
  const [sadhanaPrayer, setSadhanaPrayer] = useState<boolean>(true);
  const [sadhanaLecture, setSadhanaLecture] = useState<boolean>(false);

  // Streaks statistics
  const [currentStreak, setCurrentStreak] = useState<number>(12);
  const [bestStreak] = useState<number>(27);
  const [thisMonthRounds] = useState<number>(192);

  // Updates Categories Filter
  const [activeUpdateFilter, setActiveUpdateFilter] = useState<'all' | 'festival' | 'temple' | 'classes' | 'seva'>('all');

  const sadhanaCompletedCount = [sadhanaJapa, sadhanaReading, sadhanaArati, sadhanaPrayer, sadhanaLecture].filter(Boolean).length;
  const sadhanaTotalCount = 5;

  // Japa Bead Counter logic
  const handleBeadPress = () => {
    if (japaCount >= 107) {
      setJapaCount(0);
      setJapaRounds(prev => prev + 1);
      // Increment streak dynamically as a reward if they completed a round
      if (japaRounds + 1 === 8) {
        setCurrentStreak(prev => prev + 1);
      }
    } else {
      setJapaCount(prev => prev + 1);
    }
  };

  // Color Tokens based on Light/Dark Mode
  const colors = {
    bg: isDarkMode ? '#120A2A' : '#FDFBF7',
    card: isDarkMode ? '#1A123D' : '#F7F3EB',
    cardBorder: isDarkMode ? '#2E245E' : '#E8DFCE',
    textMain: isDarkMode ? '#FFFFFF' : '#8C1D1D', // Temple Maroon for light mode
    textSub: isDarkMode ? '#C7BBE6' : '#5C5446',
    accentGold: '#D4AF37', // Gold is always gold
    accentGreen: '#27AE60',
    navBg: isDarkMode ? '#0F0824' : '#FFFFFF',
    navActive: '#D4AF37',
    navInactive: isDarkMode ? '#6E619E' : '#B0A38F',
    divider: isDarkMode ? '#271D54' : '#EBE5D8',
    pureWhite: '#FFFFFF',
    darkPurple: '#1F1545',
    creamAccent: '#FFFDF9',
  };

  // Generate bead coordinates in a circular fashion
  const beadCount = 27; // 108 is too many to render clearly, 27 is the standard sub-loop mala size!
  const beads = [];
  const radius = 90;
  const cx = 110;
  const cy = 110;
  for (let i = 0; i < beadCount; i++) {
    const angle = (i * 2 * Math.PI) / beadCount - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    beads.push({ x, y, index: i });
  }

  // Active bead highlight based on 108 subdivisions
  const activeBeadIndex = Math.floor((japaCount / 108) * beadCount);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
        
        {/* TOP BRANDING BAR (Official ISKCON Vizag Logo & Language Toggle) */}
        <View style={[styles.headerBar, { borderBottomColor: colors.divider }]}>
          <View style={styles.headerLogoContainer}>
            <View style={[styles.avatarDummy, { backgroundColor: colors.accentGold }]}>
              <Text style={styles.avatarText}>ॐ</Text>
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textMain }]}>ISKCON VIZAG</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSub }]}>My Bhakti. My Temple.</Text>
            </View>
          </View>
          
          <View style={styles.headerControls}>
            {/* Theme Toggle */}
            <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconButton}>
              <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            {/* Language Toggle */}
            <TouchableOpacity 
              onPress={() => setLang(prev => prev === 'en' ? 'te' : 'en')}
              style={[styles.langToggleBtn, { borderColor: colors.textMain }]}
            >
              <Text style={[styles.langToggleText, { color: colors.textMain }]}>
                {lang === 'en' ? 'తెలుగు' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN BODY CONTAINER WITH SCROLL */}
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <View>
              {/* Devotee Greetings Card */}
              <View style={[styles.greetingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={styles.greetingHeader}>
                  <View>
                    <Text style={[styles.greetingText, { color: colors.textMain }]}>{t.greeting}</Text>
                    <Text style={[styles.subGreetingText, { color: colors.textSub }]}>{t.morning}</Text>
                  </View>
                  <View style={styles.bellIcon}>
                    <Text style={{ fontSize: 22 }}>🔔</Text>
                  </View>
                </View>

                {/* My Bhakti Dashboard Snippet */}
                <View style={styles.dashboardSection}>
                  <Text style={[styles.dashboardTitle, { color: colors.textMain }]}>{t.myBhakti}</Text>
                  <View style={styles.dashboardRow}>
                    
                    {/* Japa Card */}
                    <TouchableOpacity onPress={() => setActiveTab('sadhana')} style={[styles.dashCard, { backgroundColor: colors.pureWhite, shadowColor: isDarkMode ? '#000' : '#8C1D1D' }]}>
                      <Text style={styles.dashEmoji}>📿</Text>
                      <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.japa}</Text>
                      <Text style={[styles.dashValue, { color: colors.textMain }]}>{japaRounds} / {japaGoal}</Text>
                      <Text style={styles.dashSubValue}>{t.rounds}</Text>
                      <View style={[styles.dashButton, { backgroundColor: colors.textMain }]}>
                        <Text style={styles.dashButtonText}>{t.continueJapa}</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Today's Reading Card */}
                    <View style={[styles.dashCard, { backgroundColor: colors.pureWhite, shadowColor: isDarkMode ? '#000' : '#8C1D1D' }]}>
                      <Text style={styles.dashEmoji}>📖</Text>
                      <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.todaysReading}</Text>
                      <Text style={[styles.dashValueText, { color: colors.textMain }]} numberOfLines={1}>{t.gitaVerse}</Text>
                      <Text style={styles.dashSubValue}>{t.gitaVerseRef}</Text>
                      <TouchableOpacity style={[styles.dashButton, { backgroundColor: colors.textMain }]}>
                        <Text style={styles.dashButtonText}>{t.readNow}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Today's Sadhana Progress */}
                    <TouchableOpacity onPress={() => setActiveTab('sadhana')} style={[styles.dashCard, { backgroundColor: colors.pureWhite, shadowColor: isDarkMode ? '#000' : '#8C1D1D' }]}>
                      <Text style={styles.dashEmoji}>🪷</Text>
                      <Text style={[styles.dashLabel, { color: colors.textSub }]}>{t.todaysSadhana}</Text>
                      <Text style={[styles.dashValue, { color: colors.textMain }]}>{sadhanaCompletedCount} / {sadhanaTotalCount}</Text>
                      <Text style={styles.dashSubValue}>{t.sadhanaRatio}</Text>
                      
                      <View style={styles.sadhanaProgressDots}>
                        <View style={[styles.progDot, { backgroundColor: sadhanaJapa ? colors.accentGold : '#ddd' }]} />
                        <View style={[styles.progDot, { backgroundColor: sadhanaReading ? colors.accentGold : '#ddd' }]} />
                        <View style={[styles.progDot, { backgroundColor: sadhanaArati ? colors.accentGold : '#ddd' }]} />
                        <View style={[styles.progDot, { backgroundColor: sadhanaPrayer ? colors.accentGold : '#ddd' }]} />
                        <View style={[styles.progDot, { backgroundColor: sadhanaLecture ? colors.accentGold : '#ddd' }]} />
                      </View>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>

              {/* Your Bhakti Journey Streaks banner */}
              <View style={[styles.streakBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.streakTitle, { color: colors.textMain }]}>🔥 {t.myProgress}</Text>
                <View style={styles.streakStatsRow}>
                  <View style={styles.streakStat}>
                    <Text style={[styles.streakStatVal, { color: colors.textMain }]}>{currentStreak}</Text>
                    <Text style={[styles.streakStatLbl, { color: colors.textSub }]}>{t.currentStreak}</Text>
                  </View>
                  <View style={styles.streakStat}>
                    <Text style={[styles.streakStatVal, { color: colors.textMain }]}>{bestStreak}</Text>
                    <Text style={[styles.streakStatLbl, { color: colors.textSub }]}>{t.bestStreak}</Text>
                  </View>
                  <View style={styles.streakStat}>
                    <Text style={[styles.streakStatVal, { color: colors.textMain }]}>{thisMonthRounds}</Text>
                    <Text style={[styles.streakStatLbl, { color: colors.textSub }]}>{t.thisMonth} {t.rounds}</Text>
                  </View>
                </View>
              </View>

              {/* Official Temple Announcements Feed Section */}
              <View style={styles.updatesSection}>
                <View style={styles.updatesSecHeader}>
                  <Text style={[styles.updatesSecTitle, { color: colors.textMain }]}>📢 {t.officialUpdates}</Text>
                  <TouchableOpacity onPress={() => setActiveTab('updates')}>
                    <Text style={[styles.viewAllText, { color: colors.accentGold }]}>View All {'>'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Important Temple Announcement Card 1 */}
                <View style={[styles.announcementCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1590050752117-238cb061295a?q=80&w=600&auto=format&fit=crop' }} 
                    style={styles.announcementImage} 
                  />
                  <View style={styles.announcementContent}>
                    <View style={styles.announcementMeta}>
                      <Text style={[styles.announcementTag, { backgroundColor: colors.textMain }]}>{t.festivals}</Text>
                      <Text style={[styles.announcementDate, { color: colors.textSub }]}>25 Aug - 27 Aug</Text>
                    </View>
                    <Text style={[styles.announcementTitle, { color: colors.textMain }]}>Janmashtami Celebrations</Text>
                    <Text style={[styles.announcementDesc, { color: colors.textSub }]} numberOfLines={2}>
                      Special programs, maha abhishek, kirtan and delicious mahaprasadam feast.
                    </Text>
                    <TouchableOpacity style={styles.viewDetailsBtn}>
                      <Text style={[styles.viewDetailsText, { color: colors.textMain }]}>{t.viewDetails}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Important Temple Announcement Card 2 (Timing Change Alert) */}
                <View style={[styles.timingsAlertCard, { borderColor: colors.accentGold }]}>
                  <View style={styles.alertIconBg}>
                    <Text style={{ fontSize: 18 }}>⏰</Text>
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertTitle, { color: colors.textMain }]}>Mangala Arati Timing Change</Text>
                    <Text style={[styles.alertDesc, { color: colors.textSub }]}>
                      From tomorrow onwards, Mangala Arati starts at 4:15 AM onwards.
                    </Text>
                  </View>
                </View>
              </View>

            </View>
          )}

          {/* TAB 2: SADHANA (Interactive Japa Counter + Daily Log Checksheet) */}
          {activeTab === 'sadhana' && (
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
          )}

          {/* TAB 3: UPDATES (Temple vs Community Feeds) */}
          {activeTab === 'updates' && (
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
          )}

          {/* TAB 4: JOURNEY (Sadhana Charts and metrics) */}
          {activeTab === 'journey' && (
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
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <View style={styles.tabContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textMain }]}>👤 {t.profileTab}</Text>

              {/* Profile Card Info */}
              <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={[styles.profileAvatar, { backgroundColor: colors.textMain }]}>
                  <Text style={styles.profileAvatarText}>A</Text>
                </View>
                <Text style={[styles.profileName, { color: colors.textMain }]}>Arjun Das</Text>
                <Text style={[styles.profileEmail, { color: colors.textSub }]}>arjun@iskcondevotee.com</Text>
              </View>

              {/* Application Settings Option */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.settingsHeader, { color: colors.textMain }]}>⚙️ Settings</Text>
                
                {/* Language Switch */}
                <View style={styles.settingsRow}>
                  <Text style={[styles.settingsLabel, { color: colors.textSub }]}>{t.language}</Text>
                  <View style={styles.settingsBtnGroup}>
                    <TouchableOpacity 
                      onPress={() => setLang('en')} 
                      style={[styles.settingsToggleBtn, lang === 'en' && { backgroundColor: colors.textMain }]}
                    >
                      <Text style={[styles.settingsBtnText, { color: lang === 'en' ? colors.pureWhite : colors.textSub }]}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setLang('te')} 
                      style={[styles.settingsToggleBtn, lang === 'te' && { backgroundColor: colors.textMain }]}
                    >
                      <Text style={[styles.settingsBtnText, { color: lang === 'te' ? colors.pureWhite : colors.textSub }]}>తెలుగు</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Theme Mode Option */}
                <View style={styles.settingsRow}>
                  <Text style={[styles.settingsLabel, { color: colors.textSub }]}>Color Theme</Text>
                  <View style={styles.settingsBtnGroup}>
                    <TouchableOpacity 
                      onPress={() => setIsDarkMode(false)} 
                      style={[styles.settingsToggleBtn, !isDarkMode && { backgroundColor: colors.textMain }]}
                    >
                      <Text style={[styles.settingsBtnText, { color: !isDarkMode ? colors.pureWhite : colors.textSub }]}>{t.lightMode}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setIsDarkMode(true)} 
                      style={[styles.settingsToggleBtn, isDarkMode && { backgroundColor: colors.textMain }]}
                    >
                      <Text style={[styles.settingsBtnText, { color: isDarkMode ? colors.pureWhite : colors.textSub }]}>{t.darkMode}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>
          )}

        </ScrollView>

        {/* BOTTOM TAB NAVIGATION BAR */}
        <View style={[styles.navTabBar, { backgroundColor: colors.navBg, borderTopColor: colors.divider }]}>
          
          {/* TAB 1: HOME */}
          <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'home' ? colors.navActive : colors.navInactive }]}>🏠</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'home' ? colors.navActive : colors.navInactive }]}>
              {t.home}
            </Text>
          </TouchableOpacity>

          {/* TAB 2: SADHANA */}
          <TouchableOpacity onPress={() => setActiveTab('sadhana')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'sadhana' ? colors.navActive : colors.navInactive }]}>📿</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'sadhana' ? colors.navActive : colors.navInactive }]}>
              {t.sadhanaTab}
            </Text>
          </TouchableOpacity>

          {/* TAB 3: UPDATES */}
          <TouchableOpacity onPress={() => setActiveTab('updates')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'updates' ? colors.navActive : colors.navInactive }]}>📢</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'updates' ? colors.navActive : colors.navInactive }]}>
              {t.updatesTab}
            </Text>
          </TouchableOpacity>

          {/* TAB 4: JOURNEY */}
          <TouchableOpacity onPress={() => setActiveTab('journey')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'journey' ? colors.navActive : colors.navInactive }]}>🌱</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'journey' ? colors.navActive : colors.navInactive }]}>
              {t.journeyTab}
            </Text>
          </TouchableOpacity>

          {/* TAB 5: PROFILE */}
          <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.navTabItem}>
            <Text style={[styles.navTabIcon, { color: activeTab === 'profile' ? colors.navActive : colors.navInactive }]}>👤</Text>
            <Text style={[styles.navTabText, { color: activeTab === 'profile' ? colors.navActive : colors.navInactive }]}>
              {t.profileTab}
            </Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  headerBar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarDummy: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 11,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 5,
  },
  langToggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 15,
  },
  langToggleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  greetingCard: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subGreetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  bellIcon: {
    padding: 8,
  },
  dashboardSection: {
    marginTop: 10,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dashCard: {
    width: (SCREEN_WIDTH - 80) / 3,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 150,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dashEmoji: {
    fontSize: 24,
  },
  dashLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  dashValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  dashValueText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  dashSubValue: {
    fontSize: 8,
    color: '#8A7D69',
    textAlign: 'center',
  },
  dashButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 6,
    width: '100%',
  },
  dashButtonText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sadhanaProgressDots: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  progDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  streakBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 15,
    borderWidth: 1,
    padding: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  streakStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatVal: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakStatLbl: {
    fontSize: 11,
    marginTop: 2,
  },
  updatesSection: {
    paddingHorizontal: 16,
  },
  updatesSecHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  updatesSecTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  announcementCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  announcementImage: {
    width: '100%',
    height: 140,
  },
  announcementContent: {
    padding: 16,
  },
  announcementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTag: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  announcementDate: {
    fontSize: 11,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  announcementDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  viewDetailsBtn: {
    marginTop: 12,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  timingsAlertCard: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    backgroundColor: '#FFFDF0',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE99E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertDesc: {
    fontSize: 11,
    marginTop: 2,
  },
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
  profileCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 4,
  },
  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  settingsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingsBtnGroup: {
    flexDirection: 'row',
  },
  settingsToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    marginLeft: 6,
  },
  settingsBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  navTabBar: {
    height: 75,
    flexDirection: 'row',
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 15,
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabIcon: {
    fontSize: 22,
  },
  navTabText: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default App;
