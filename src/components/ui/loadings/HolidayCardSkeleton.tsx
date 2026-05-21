import React from "react";
import { View, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { SkeletonCanvas, SkeletonItem } from "../SkeletonCanvas";

export const HolidayCardSkeleton = () => {
  return (
    // We apply the main card styling directly to the SkeletonCanvas
    <SkeletonCanvas style={styles.card}>
      {/* Header Row: Title lines and Badge */}
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          {/* Two lines to represent numberOfLines={2} */}
          <SkeletonItem style={styles.titleLine1} />
          <SkeletonItem style={styles.titleLine2} />
        </View>
        {/* The Badge */}
        <SkeletonItem style={styles.badgeSkeleton} />
      </View>

      {/* Date Row */}
      <View style={styles.dateContainer}>
        {/* Calendar Icon */}
        <SkeletonItem style={styles.iconSkeleton} />
        {/* Date Text */}
        <SkeletonItem style={styles.dateLine} />
      </View>

      {/* Description: Three lines of varying widths */}
      <View style={styles.descriptionContainer}>
        <SkeletonItem style={styles.descLineFull} />
        <SkeletonItem style={styles.descLineMedium} />
        <SkeletonItem style={styles.descLineShort} />
      </View>
    </SkeletonCanvas>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(12),
  },
  titleWrapper: {
    flex: 1,
    marginRight: moderateScale(16),
  },
  titleLine1: {
    width: "100%",
    height: moderateScale(16),
    borderRadius: moderateScale(4),
    marginBottom: moderateScale(6),
  },
  titleLine2: {
    width: "70%",
    height: moderateScale(16),
    borderRadius: moderateScale(4),
  },
  badgeSkeleton: {
    width: moderateScale(60),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  iconSkeleton: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(2),
    marginRight: moderateScale(6),
  },
  dateLine: {
    width: moderateScale(100),
    height: moderateScale(12),
    borderRadius: moderateScale(4),
  },
  descriptionContainer: {
    marginTop: moderateScale(4),
  },
  descLineFull: {
    width: "100%",
    height: moderateScale(12),
    borderRadius: moderateScale(4),
    marginBottom: moderateScale(6),
  },
  descLineMedium: {
    width: "90%",
    height: moderateScale(12),
    borderRadius: moderateScale(4),
    marginBottom: moderateScale(6),
  },
  descLineShort: {
    width: "60%",
    height: moderateScale(12),
    borderRadius: moderateScale(4),
  },
});
