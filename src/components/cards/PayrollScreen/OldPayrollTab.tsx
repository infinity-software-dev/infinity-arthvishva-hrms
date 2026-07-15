import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from '@/constants/theme';
import { usePayrolls } from "@/hooks/usePayrolls";
import PayrollCard from "@/components/cards/PayrollScreen/PayrollCard";
import HistoricalPayrollModal from '@/components/modals/HistoricalPayrollModal';

const OldPayrollTab = () => {
  const { state, actions } = usePayrolls();

  // Local state strictly for modal visibility
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    actions.fetchPayrolls();
  }, []);

  const handleCardPress = async (payrollId: string) => {
    // 1. Call the hook to fetch detailed data
    const success = await actions.fetchPayrollDetails(payrollId);

    // 2. Only show the modal if the API call succeeded
    if (success) {
      setModalVisible(true);
    }
  };

  const renderHeader = () => (
    <View style={styles.historyHeader}>
      <Text style={styles.sectionTitle}>Statement History</Text>
      {/* Show loading spinner if fetching list OR fetching details */}
      {(state.isLoading || state.isFetchingDetails) && (
        <ActivityIndicator size="small" color={colors.BRAND_SECONDARY} />
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
            onPress={() => handleCardPress(item._id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={state.isLoading && !state.isGenerating}
            onRefresh={actions.fetchPayrolls}
            colors={[colors.BRAND_SECONDARY]}
            tintColor={colors.BRAND_SECONDARY}
          />
        }
        ListEmptyComponent={
          !state.isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No statements found</Text>
              <Text style={styles.emptySub}>
                You haven't generated any payroll slips yet.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Modal renders using the enriched data stored in the hook state */}
      <HistoricalPayrollModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        slip={state.selectedSlip}
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