import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { useHighlights } from "@/hooks/useHighlights";
import HighlightsSkeleton from "@/components/ui/loadings/HighlightsSkeleton";

export default function HighlightsFeed() {
  const { updates, isLoading } = useHighlights();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {isLoading ? "Fetching Updates..." : `Highlights (${updates.length})`}
        </Text>
        {/* {!isLoading && updates.length > 0 && (
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )} */}
      </View>

      {isLoading ? (
        <>
          <HighlightsSkeleton />
          <HighlightsSkeleton />
        </>
      ) : updates.length > 0 ? (
        updates.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.theme + "15" },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={moderateScale(20)}
                color={item.theme}
              />
            </View>

            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={[styles.type, { color: item.theme }]}>
                  {item.type}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.desc}
              </Text>
            </View>

            {/* <Ionicons
              name="chevron-forward"
              size={moderateScale(16)}
              color="#9CA3AF"
            /> */}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="notifications-off-outline"
            size={moderateScale(40)}
            color="#D1D5DB"
          />
          <Text style={styles.emptyText}>No highlights for today.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(30),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(15),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#1F2937",
  },
  viewAll: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: colors.Brand_Blue,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: moderateScale(12),
    marginRight: moderateScale(8),
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(2),
  },
  type: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(10),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  time: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: moderateScale(10),
    color: "#9CA3AF",
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(14),
    color: "#1F2937",
    marginBottom: moderateScale(2),
  },
  desc: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: moderateScale(12),
    color: "#6B7280",
    lineHeight: moderateScale(16),
  },
  skeletonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  skeletonIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    backgroundColor: "#F3F4F6",
  },
  skeletonTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  skeletonBar: {
    height: moderateScale(8),
    backgroundColor: "#F3F4F6",
    borderRadius: moderateScale(4),
  },
  emptyState: {
    paddingVertical: moderateScale(30),
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: moderateScale(16),
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyText: {
    marginTop: moderateScale(10),
    fontFamily: "Nunito_600SemiBold",
    color: "#9CA3AF",
    fontSize: moderateScale(13),
  },
});
