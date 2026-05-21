import React from "react";
import { View, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { SkeletonCanvas, SkeletonItem } from "../SkeletonCanvas";

export default function HighlightsSkeleton() {
  return (
    <View style={styles.card}>
      {/* 1. Icon Shape */}
      <SkeletonCanvas style={styles.iconSkeleton}>
        <SkeletonItem style={{ flex: 1 }} />
      </SkeletonCanvas>

      <View style={styles.content}>
        <View style={styles.row}>
          {/* 2. Type Label Shape */}
          <SkeletonCanvas style={styles.typeSkeleton}>
            <SkeletonItem style={{ flex: 1 }} />
          </SkeletonCanvas>
          {/* 3. Time Shape */}
          <SkeletonCanvas style={styles.timeSkeleton}>
            <SkeletonItem style={{ flex: 1 }} />
          </SkeletonCanvas>
        </View>

        {/* 4. Title Shape */}
        <SkeletonCanvas style={styles.titleSkeleton}>
          <SkeletonItem style={{ flex: 1 }} />
        </SkeletonCanvas>

        {/* 5. Desc Shape */}
        <SkeletonCanvas style={styles.descSkeleton}>
          <SkeletonItem style={{ flex: 1 }} />
        </SkeletonCanvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: moderateScale(12),
    backgroundColor: "#FFF",
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(12),
    alignItems: "center",
  },
  iconSkeleton: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
  },
  content: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  typeSkeleton: {
    width: "30%",
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  timeSkeleton: {
    width: "15%",
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  titleSkeleton: {
    width: "70%",
    height: moderateScale(14),
    borderRadius: moderateScale(4),
    marginBottom: moderateScale(6),
  },
  descSkeleton: {
    width: "90%",
    height: moderateScale(10),
    borderRadius: moderateScale(4),
  },
});
