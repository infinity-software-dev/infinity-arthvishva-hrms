import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import ActionModal from "@/components/modals/AlertModal";
import { colors, FONTS } from "@/constants/theme";
import { usePayrolls } from "@/hooks/usePayrolls";
import GenerateFilterCard from "@/components/cards/PayrollScreen/GenerateFilterCard";
import SpotlightCard from "@/components/cards/PayrollScreen/SpotlightCard";
import PayrollCard from "@/components/cards/PayrollScreen/PayrollCard";

const PaySlipsScreen = () => {
  const { state, actions } = usePayrolls();

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      <GenerateFilterCard
        fromDate={state.fromDate}
        toDate={state.toDate}
        formatDateForUI={actions.formatDateForUI}
        onShowFromPicker={() => actions.setShowFromPicker(true)}
        onShowToPicker={() => actions.setShowToPicker(true)}
        onGenerate={actions.handleGenerate}
        isGenerating={state.isGenerating}
      />

      <SpotlightCard
        slip={state.latestSlip}
        onPress={() => console.log("Open Latest")}
      />

      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Statement History</Text>
        {state.isLoading && (
          <ActivityIndicator size="small" color={colors.Brand_Blue} />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <CustomHeader title="Pay Slips" />

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
            colors={[colors.Brand_Blue]}
            tintColor={colors.Brand_Blue}
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
                Adjust dates or generate a new slip above.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Screen-Level Overlays (Modals & Pickers) */}
      <ActionModal
        visible={state.actionModal.visible}
        title={state.actionModal.title}
        message={state.actionModal.message}
        onConfirm={actions.closeActionModal}
        confirmText="Got it"
        confirmColor={
          state.actionModal.type === "success"
            ? colors.Brand_Green
            : colors.Danger_Red
        }
        icon={
          state.actionModal.type === "success" ? (
            <Ionicons
              name="checkmark-circle"
              size={moderateScale(32)}
              color={colors.Brand_Green}
            />
          ) : (
            <Ionicons
              name="alert-circle"
              size={moderateScale(32)}
              color={colors.Danger_Red}
            />
          )
        }
      />

      {(Platform.OS === "ios"
        ? state.showFromPicker
        : state.showFromPicker) && (
        <DateTimePicker
          value={state.fromDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            if (Platform.OS === "android") actions.setShowFromPicker(false);
            if (date) actions.setFromDate(date);
          }}
        />
      )}

      {(Platform.OS === "ios" ? state.showToPicker : state.showToPicker) && (
        <DateTimePicker
          value={state.toDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            if (Platform.OS === "android") actions.setShowToPicker(false);
            if (date) actions.setToDate(date);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.Base_Background },
  listContainer: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
  headerComponent: { paddingBottom: moderateScale(8) },
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
  emptyState: { alignItems: "center", marginTop: moderateScale(40) },
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

export default PaySlipsScreen;
