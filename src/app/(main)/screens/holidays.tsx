import React from "react";
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <CustomHeader title="Holidays" />

      {state.loading && !state.refreshing ? (
        <>
          <HolidayCardSkeleton />
          <HolidayCardSkeleton />
        </>
      ) : (
        <FlatList
          data={state.holidays}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isNational = item.type === "National";
            const accentColor = isNational
              ? colors.Danger_Red
              : colors.Brand_Green;
            const pastelBg = `${accentColor}14`;

            return (
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: pastelBg }]}>
                    <Text style={[styles.badgeText, { color: accentColor }]}>
                      {item.type}
                    </Text>
                  </View>
                </View>

                <View style={styles.dateContainer}>
                  <MaterialIcons
                    name="calendar-today"
                    size={moderateScale(13)}
                    color={colors.Brand_Blue}
                  />
                  <Text style={styles.date}>
                    {new Date(item.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                {item.description && (
                  <Text style={styles.description} numberOfLines={3}>
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
              tintColor={colors.Brand_Green}
              colors={[colors.Brand_Green]}
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: moderateScale(24),
    paddingTop: moderateScale(12),
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginVertical: moderateScale(6),
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(10),
  },
  name: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.bold,
    color: "#0F172A",
    flex: 1,
    marginRight: moderateScale(12),
    lineHeight: moderateScale(22),
  },
  badge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(99),
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontFamily: FONTS.bold,
    textTransform: "capitalize",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(8),
    alignSelf: "flex-start",
  },
  date: {
    fontSize: moderateScale(12),
    color: "#475569",
    fontFamily: FONTS.medium,
    marginLeft: moderateScale(6),
  },
  description: {
    fontSize: moderateScale(13),
    color: "#64748B",
    fontFamily: FONTS.regular,
    lineHeight: moderateScale(19),
    marginTop: moderateScale(12),
  },
});

export default HolidayScreen;
