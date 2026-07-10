import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import ActionModal from "@/components/modals/AlertModal";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { HolidayCardSkeleton } from "@/components/ui/loadings/HolidayCardSkeleton";
import { colors, FONTS } from "@/constants/theme";
import { useHolidays } from "@/hooks/useHolidays";

const HolidayScreen = () => {
  const { state, actions } = useHolidays();

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <CustomHeader title="Holidays" />

      {state.loading && !state.refreshing ? (
        new Array(4).fill(0).map((_, index) => (
          <HolidayCardSkeleton key={index} />
        ))
      ) : (
        <FlatList
          data={state.holidays}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            const isPast = itemDate < today;

            const isNational = item.type === "National";

            // Base colors for the active state
            const baseAccent = isNational ? colors.Danger_Red : colors.BRAND_SECONDARY;

            // The left border dictates the visual hierarchy
            const accentColor = isPast ? "#CBD5E1" : baseAccent;

            // Ultra-subtle background for the badge
            const pastelBg = isPast ? "#F1F5F9" : `${baseAccent}10`;

            return (
              <View style={[styles.card, { borderLeftColor: accentColor }, isPast && styles.pastCard]}>

                {/* Header: Name & Badge */}
                <View style={styles.header}>
                  <Text style={[styles.name, isPast && styles.pastText]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: pastelBg }]}>
                    <Text style={[styles.badgeText, { color: isPast ? "#94A3B8" : baseAccent }]}>
                      {item.type}
                    </Text>
                  </View>
                </View>

                {/* Date Row: Clean, inline, icon-led */}
                <View style={styles.dateRow}>
                  <MaterialIcons
                    name="event"
                    size={moderateScale(16)}
                    color={isPast ? "#CBD5E1" : "#64748B"}
                  />
                  <Text style={[styles.dateText, isPast && styles.pastText]}>
                    {itemDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                {/* Description: Separated with margin, softer color */}
                {item.description && (
                  <Text style={[styles.description, isPast && { color: "#CBD5E1" }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={() => actions.loadData(true)}
              tintColor={colors.BRAND_SECONDARY}
              colors={[colors.BRAND_SECONDARY]}
            />
          }
        />
      )}

      <ActionModal
        visible={state.errorModal.visible}
        title={state.errorModal.title}
        message={state.errorModal.message}
        confirmText="Retry"
        confirmColor={colors.Danger_Red}
        icon={
          <MaterialIcons
            name="error-outline"
            size={30}
            color={colors.Danger_Red}
          />
        }
        onConfirm={() => {
          actions.closeErrorModal();
          actions.loadData(false);
        }}
        onCancel={actions.cancelErrorModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: moderateScale(24),
    paddingTop: moderateScale(16),
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginVertical: moderateScale(8),
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    paddingVertical: moderateScale(18),
    paddingHorizontal: moderateScale(20),
    // ─── MODERN ACCENT BORDER ───
    borderLeftWidth: moderateScale(5),
    borderWidth: 1,
    borderColor: "#F8FAFC",
    // ─── PREMIUM SOFT SHADOW ───
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  pastCard: {
    opacity: 0.65,
    backgroundColor: "#F8FAFC", // Slight tint for past events
    borderColor: "#F1F5F9",
    shadowOpacity: 0,
    elevation: 0,
  },
  pastText: {
    color: "#94A3B8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Keeps badge at top if name wraps to 2 lines
    marginBottom: moderateScale(12),
  },
  name: {
    fontSize: moderateScale(17),
    fontFamily: FONTS.extraBold,
    color: "#0F172A",
    flex: 1,
    marginRight: moderateScale(12),
    lineHeight: moderateScale(24),
  },
  badge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(8),
  },
  badgeText: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.bold,
    letterSpacing: 0.3,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: moderateScale(13),
    color: "#475569",
    fontFamily: FONTS.semiBold,
    marginLeft: moderateScale(8),
  },
  description: {
    fontSize: moderateScale(13),
    color: "#64748B",
    fontFamily: FONTS.medium,
    lineHeight: moderateScale(20),
    marginTop: moderateScale(10),
  },
});

export default HolidayScreen;