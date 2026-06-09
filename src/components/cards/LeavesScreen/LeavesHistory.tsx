// screens/LeavesHistory.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { fetchMyLeaves } from "@/services/leavesService";
import LeaveBalanceCard from "./LeaveBalanceCard";
import LeaveDetailsModal from "@/components/modals/LeaveDetailsModal";
import LeaveHistoryCard from "./LeaveHistoryCard";
import { useIsFocused } from "expo-router";

export default function LeavesHistory() {
  const isFocused = useIsFocused();
  const [leavesData, setLeavesData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState({
    total: 0, approved: 0, pending: 0, rejected: 0, cancelled: 0,
  });

  // 1. Separate your loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  // 2. Pass a "silent" flag to the fetcher
  const loadLeaves = useCallback(async (isSilent = false) => {
    // Only trigger the main loader if it's NOT a silent background fetch
    if (!isSilent) {
      setIsInitialLoading(true);
    }

    try {
      const data = await fetchMyLeaves();
      setLeavesData(data.leaves);
      if (data.summary) setSummaryData(data.summary);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 3. Smart Focus Trigger
  useEffect(() => {
    if (isFocused) {
      // If we already have data, fetch silently in the background!
      // If we don't have data, show the main loader.
      const hasData = leavesData.length > 0;
      loadLeaves(hasData);
    }
  }, [isFocused]);

  // 4. Dedicated Pull-to-Refresh Handler
  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    loadLeaves(true);
  };

  // 5. Update the conditional render to use the new initial load state
  if (isInitialLoading && leavesData.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.Brand_Green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeaveBalanceCard
        data={summaryData}
        title="Leave History"
        subTitle="YOUR ATTENDANCE RECORD"
        iconName="calendar-outline"
      />

      <FlatList
        data={leavesData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <LeaveHistoryCard
            item={item}
            onPress={() => setSelectedLeave(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handlePullToRefresh}
            tintColor={colors.Brand_Green}
            colors={[colors.Brand_Green]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={moderateScale(48)} color="#CBD5E1" />
            <Text style={styles.emptyText}>No leave history found</Text>
          </View>
        }
      />

      {/*  Mount the Details Modal */}
      <LeaveDetailsModal
        isVisible={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leaveData={selectedLeave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
    padding: moderateScale(16),
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: moderateScale(40),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: moderateScale(60),
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#94A3B8",
    marginTop: moderateScale(12),
  },
});