import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from '@/constants/theme';
import { usePayrolls } from "@/hooks/usePayrolls";
import PayrollCard from "@/components/cards/PayrollScreen/PayrollCard";

const OldPayrollTab = () => {
  const { state, actions } = usePayrolls();

  // Fetch the list when the tab mounts
  useEffect(() => {
    actions.fetchPayrolls();
  }, []);

  const renderHeader = () => (
    <View style={styles.historyHeader}>
      <Text style={styles.sectionTitle}>Statement History</Text>
      {state.isLoading && (
        <ActivityIndicator size="small" color={colors.Brand_Green} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={state.payrollList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PayrollCard
            item={item}
            onPress={() => console.log("Navigate to Slip Detail", item._id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={state.isLoading && !state.isGenerating}
            onRefresh={actions.fetchPayrolls}
            colors={[colors.Brand_Green]}
            tintColor={colors.Brand_Green}
          />
        }
        ListEmptyComponent={
          !state.isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#CBD5E1"
              />
              <Text style={styles.emptyTitle}>No statements found</Text>
              <Text style={styles.emptySub}>
                You haven't generated any payroll slips yet.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  listContainer: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#0F172A",
    marginBottom: moderateScale(16),
  },
  emptyState: {
    alignItems: "center",
    marginTop: moderateScale(40)
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#475569",
    marginTop: moderateScale(12),
  },
  emptySub: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#94A3B8",
    marginTop: moderateScale(4),
  },
});

export default OldPayrollTab;