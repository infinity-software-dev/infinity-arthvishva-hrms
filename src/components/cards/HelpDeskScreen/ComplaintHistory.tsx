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
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import NewComplaintModal from "@/components/modals/NewComplaintModal";
import UniversalButton from "@/components/buttons/UniversalButton";
import ComplaintCard from "./ComplaintCard";
import { useHelpDesk } from "@/hooks/useHelpDesk";

export default function ComplaintHistory() {
  // Use the newly unified hook
  const { state, actions } = useHelpDesk();

  return (
    <View style={styles.container}>
      {/* List Content */}
      {state.isLoadingHistory && !state.isRefreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.Brand_Green} />
        </View>
      ) : (
        <FlatList
          data={state.complaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ComplaintCard complaint={item} onWithdraw={(id) => actions.handleWithdraw(id)} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={state.isRefreshing}
              onRefresh={actions.handleRefresh}
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
        onPress={actions.openModal}
        color={colors.Brand_Green}
        icon={<Ionicons name="add" size={moderateScale(24)} color="#FFFFFF" />}
        style={styles.fab}
      />

      {/* New Complaint Modal */}
      <CustomBottomModal
        onClose={actions.closeModal}
        title="Raise new complaint"
        isVisible={state.isModalVisible}
      >
        <NewComplaintModal
          isSubmitting={state.isSubmitting}
          onSubmit={async (payload) => {
            // Simply call submit; the hook already handles the background refresh!
            const result = await actions.submitComplaint(payload);
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