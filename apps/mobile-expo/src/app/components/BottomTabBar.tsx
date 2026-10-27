import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppTab, DevoteeRole, IDevotee } from '@temple/models';

interface BottomTabBarProps {
  activeTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  colors: any;
  t: any;
  devotee: IDevotee | null;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onNavigate,
  colors,
  t,
  devotee,
}) => {
  return (
    <View style={[styles.navTabBar, { backgroundColor: colors.navBg, borderTopColor: colors.divider }]}>
      <TouchableOpacity onPress={() => onNavigate(AppTab.HOME)} style={styles.navTabItem}>
        <View style={styles.tabIconWrapper}>
          <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.HOME ? 1 : 0.6 }]}>🛕</Text>
        </View>
        <Text style={[styles.navTabText, { color: activeTab === AppTab.HOME ? colors.navActive : colors.navInactive }]}>
          {t.home}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate(AppTab.SADHANA)} style={styles.navTabItem}>
        <View style={styles.tabIconWrapper}>
          <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.SADHANA ? 1 : 0.6 }]}>📿</Text>
        </View>
        <Text style={[styles.navTabText, { color: activeTab === AppTab.SADHANA ? colors.navActive : colors.navInactive }]}>
          {t.sadhanaTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate(AppTab.UPDATES)} style={styles.navTabItem}>
        <View style={styles.tabIconWrapper}>
          <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.UPDATES ? 1 : 0.6 }]}>🔔</Text>
        </View>
        <Text style={[styles.navTabText, { color: activeTab === AppTab.UPDATES ? colors.navActive : colors.navInactive }]}>
          {t.updatesTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate(AppTab.COMMUNITY)} style={styles.navTabItem}>
        <View style={styles.tabIconWrapper}>
          <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.COMMUNITY ? 1 : 0.6 }]}>🪷</Text>
        </View>
        <Text style={[styles.navTabText, { color: activeTab === AppTab.COMMUNITY ? colors.navActive : colors.navInactive }]}>
          Community
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate(AppTab.PROFILE)} style={styles.navTabItem}>
        <View style={styles.tabIconWrapper}>
          {devotee?.avatarUrl ? (
            <Image
              source={{ uri: devotee.avatarUrl }}
              style={[
                styles.navTabAvatar,
                { borderColor: activeTab === AppTab.PROFILE ? colors.navActive : 'transparent' },
              ]}
            />
          ) : (
            <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.PROFILE ? 1 : 0.6 }]}>🧘</Text>
          )}
        </View>
        <Text style={[styles.navTabText, { color: activeTab === AppTab.PROFILE ? colors.navActive : colors.navInactive }]}>
          {t.profileTab}
        </Text>
      </TouchableOpacity>

      {devotee?.role === DevoteeRole.ADMIN && (
        <TouchableOpacity onPress={() => onNavigate(AppTab.ADMIN)} style={styles.navTabItem}>
          <View style={styles.tabIconWrapper}>
            <Text style={[styles.navTabIcon, { fontSize: 20, opacity: activeTab === AppTab.ADMIN ? 1 : 0.6 }]}>⚙️</Text>
          </View>
          <Text style={[styles.navTabText, { color: activeTab === AppTab.ADMIN ? colors.navActive : colors.navInactive }]}>
            Admin
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  navTabAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  tabIconWrapper: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
