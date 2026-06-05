import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

// Components
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import NewComplaintModal from "@/components/modals/NewComplaintModal";
import UniversalButton from "@/components/buttons/UniversalButton";
import ComplaintCard from "./ComplaintCard"; // Ensure this matches your file structure

// Hooks
import { useComplaintsHistory } from "@/hooks/useComplaintsHistory";
import { useHelpDeskGeneral } from "@/hooks/useHelpDeskGeneral";

export default function ComplaintHistory() {
  // 1. Data Fetching Hook
  const { state: historyState, actions: historyActions } = useComplaintsHistory();

  // 2. UI & Modal Hook
  const { state: generalState, actions: generalActions } = useHelpDeskGeneral();

  return (
    <View style={styles.container}>
      {/* List Content */}
      {historyState.isLoading && !historyState.isRefreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.Brand_Green} />
        </View>
      ) : (
        <FlatList
          data={historyState.complaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ComplaintCard complaint={item} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={historyState.isRefreshing}
              onRefresh={historyActions.handleRefresh}
              tintColor={colors.Brand_Green}
              colors={[colors.Brand_Green]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={moderateScale(48)}
                color="#CBD5E1"
              />
              <Text style={styles.emptyText}>
                You haven't raised any complaints.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <UniversalButton
        title="Raise Ticket"
        onPress={generalActions.openModal}
        color={colors.Brand_Green}
        icon={<Ionicons name="add" size={moderateScale(24)} color="#FFFFFF" />}
        style={styles.fab}
      />

      {/* New Complaint Modal */}
      <CustomBottomModal
        onClose={generalActions.closeModal}
        title="Raise new complaint"
        isVisible={generalState.isModalVisible}
      >
        <NewComplaintModal
          isSubmitting={generalState.isSubmitting}
          onSubmit={async (payload) => {
            // 1. Submit the complaint
            const result = await generalActions.submitComplaint(payload);

            // 2. If successful, silently refresh the list behind the scenes
            if (result.success) {
              historyActions.refreshComplaints(true);
            }
            return result;
          }}
        />
      </CustomBottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  content: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(100), // Extra padding so the FAB doesn't cover the last item
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: moderateScale(24),
    right: moderateScale(16),
    backgroundColor: colors.Brand_Green,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(30),
    shadowColor: colors.Brand_Green_Dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: moderateScale(80),
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#94A3B8",
    marginTop: moderateScale(12),
  },
});