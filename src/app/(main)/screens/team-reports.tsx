import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";

import { CustomHeader } from "@/components/navbar/CustomHeader";
import { useTeamReports } from "@/hooks/useTeamReports";
import { colors, FONTS } from "@/constants/theme";
import { ReportAccordionCard } from "@/components/cards/TeamReportsScreen/ReportAccordionCard";

const TeamReportsScreen = () => {
  const {
    selectedDate,
    reports,
    loading,
    refreshing,
    weekRibbon,
    showDatePicker,
    setSelectedDate,
    setShowDatePicker,
    handleRefresh,
    onDatePickerChange,
    handleToggleReadStatus,
  } = useTeamReports();

  const unreadCount = reports.filter((report) => !report.isReportRead).length;

  return (
    <View style={styles.container}>
      <CustomHeader title="Team Reports" />

      {/* --- DASHBOARD HEADER --- */}
      <View style={styles.headerControlPanel}>
        <View style={styles.summaryInfoRow}>
          <Text style={styles.panelTitleText}>Daily Standup Logs</Text>
          {reports.length > 0 && (
            <View style={[styles.statsBadge, unreadCount === 0 && styles.statsBadgeClean]}>
              <Text style={[styles.statsBadgeText, unreadCount === 0 && { color: colors.Success_Green }]}>
                {unreadCount === 0 ? "All Reviewed" : `${unreadCount} Unread`}
              </Text>
            </View>
          )}
        </View>

        {/* --- HORIZONTAL WEEK RIBBON --- */}
        <View style={styles.calendarRibbonRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScrollContainer}
          >
            {weekRibbon.map((day) => {
              const isSelected = selectedDate === day.dateString;
              return (
                <TouchableOpacity
                  key={day.dateString}
                  activeOpacity={0.85}
                  onPress={() => setSelectedDate(day.dateString)}
                  style={[styles.dateChip, isSelected && styles.dateChipActive]}
                >
                  <Text style={[styles.dayNameLabel, isSelected && styles.textWhite]}>
                    {day.isToday && !isSelected ? "Today" : day.dayName}
                  </Text>
                  <Text style={[styles.dayNumLabel, isSelected && styles.textWhite]}>
                    {day.dayNum}
                  </Text>
                  <View style={[styles.dotMarker, isSelected && { backgroundColor: "#FFFFFF" }]} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Date Picker Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
            style={styles.masterPickerBtn}
          >
            <Ionicons name="calendar" size={moderateScale(18)} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CONTENT WORKSPACE --- */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.BRAND_SECONDARY} />
          <Text style={styles.loadingText}>Fetching submitted reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ReportAccordionCard item={item} onToggleRead={handleToggleReadStatus} />
          )}
          contentContainerStyle={styles.listContentBody}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.BRAND_SECONDARY}
              colors={[colors.BRAND_SECONDARY]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="document-text-outline" size={moderateScale(32)} color="#94A3B8" />
              </View>
              <Text style={styles.emptyHeadline}>No Reports Submitted</Text>
              <Text style={styles.emptySubtext}>
                No team members have registered a daily work summary log for this specific date selection.
              </Text>
            </View>
          }
        />
      )}

      {/* --- NATIVE MODAL COMPONENT --- */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(selectedDate)}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onDatePickerChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  headerControlPanel: {
    backgroundColor: "#FFFFFF",
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(12),
  },
  panelTitleText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#0F172A",
  },
  statsBadge: {
    backgroundColor: `${colors.BRAND_SECONDARY}12`,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  statsBadgeClean: {
    backgroundColor: `${colors.Success_Green}12`,
  },
  statsBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: colors.BRAND_SECONDARY,
  },
  calendarRibbonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: moderateScale(16),
    paddingRight: moderateScale(8),
  },
  ribbonScrollContainer: {
    gap: moderateScale(8),
    paddingRight: moderateScale(12),
  },
  dateChip: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: moderateScale(46),
    height: moderateScale(56),
    backgroundColor: "#F1F5F9",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(4),
  },
  dateChipActive: {
    backgroundColor: colors.BRAND_SECONDARY,
    shadowColor: colors.BRAND_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  dayNameLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(9),
    color: "#64748B",
    textTransform: "uppercase",
  },
  dayNumLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(14),
    color: "#0F172A",
    marginTop: moderateScale(1),
  },
  dotMarker: {
    width: moderateScale(3),
    height: moderateScale(3),
    borderRadius: moderateScale(1.5),
    backgroundColor: "transparent",
    marginTop: moderateScale(3),
  },
  textWhite: {
    color: "#FFFFFF",
  },
  masterPickerBtn: {
    width: moderateScale(42),
    height: moderateScale(54),
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(4),
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(20),
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    marginTop: moderateScale(10),
  },
  listContentBody: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(30),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: moderateScale(80),
    paddingHorizontal: moderateScale(24),
  },
  emptyIconCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(14),
  },
  emptyHeadline: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#334155",
    marginBottom: moderateScale(4),
  },
  emptySubtext: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#64748B",
    textAlign: "center",
    lineHeight: moderateScale(18),
  },
});

export default TeamReportsScreen;