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
import { useHelpDesk } from "@/hooks/useHelpDesk";
import ComplaintCard from "./ComplaintCard";
import UniversalButton from "@/components/buttons/UniversalButton";

export default function ComplaintHistory() {
  const { state, actions } = useHelpDesk();

  return (
    <View style={styles.container}>
      {/* List Content */}
      {state.isLoading && !state.isRefreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.Brand_Green} />
        </View>
      ) : (
        <FlatList
          data={state.complaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ComplaintCard complaint={item} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          // 2. ADD THE REFRESH CONTROL HERE
          refreshControl={
            <RefreshControl
              refreshing={state.isRefreshing}
              onRefresh={actions.handleRefresh}
              tintColor={colors.Brand_Green} // Colors the spinner on iOS
              colors={[colors.Brand_Green]} // Colors the spinner on Android
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
          onSubmit={actions.submitComplaint}
          isSubmitting={state.isSubmitting}
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
    paddingBottom: moderateScale(100),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Floating Action Button Styles
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
  // Empty State Styles
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
