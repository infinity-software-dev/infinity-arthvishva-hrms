import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";

// Types matching your Mongoose Schema
export interface VideoProps {
  _id: string;
  title: string;
  description?: string;
  cloudinaryUrl: string;
  thumbnail?: string;
  duration?: number; // In seconds
  createdAt: string;
  isActive: boolean;
  createdBy?: {
    name: string;
    profileImageUrl?: string;
  };
}

interface VideoCardProps {
  video: VideoProps;
  onPress: (video: VideoProps) => void;
}

export default function VideoCard({ video, onPress }: VideoCardProps) {
  // Helper to convert seconds to MM:SS
  const formatDuration = (totalSeconds?: number) => {
    if (!totalSeconds) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Helper to format MongoDB ISO date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, !video.isActive && styles.inactiveCard]}
      activeOpacity={0.8}
      onPress={() => onPress(video)}
    >
      {/* Thumbnail Section */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{
            uri:
              video.thumbnail ||
              "https://via.placeholder.com/600x400/E2E8F0/94A3B8?text=No+Thumbnail",
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Play Icon Overlay */}
        <View style={styles.playOverlay}>
          <Ionicons
            name="play-circle"
            size={moderateScale(48)}
            color="rgba(255, 255, 255, 0.9)"
          />
        </View>

        {/* Duration Pill */}
        {video.duration && (
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>
              {formatDuration(video.duration)}
            </Text>
          </View>
        )}

        {/* Inactive Badge (Optional, useful for admins) */}
        {!video.isActive && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveText}>Inactive</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        {video.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {video.description}
          </Text>
        ) : null}

        {/* Meta Footer */}
        <View style={styles.metaRow}>
          <View style={styles.authorContainer}>
            <Ionicons
              name="person-circle-outline"
              size={moderateScale(16)}
              color="#64748B"
            />
            <Text style={styles.authorText}>
              {video.createdBy?.name || "Admin"}
            </Text>
          </View>

          <Text style={styles.dateText}>{formatDate(video.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(16),
    overflow: "hidden",
    shadowColor: colors.BRAND_SECONDARY_Dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  inactiveCard: {
    opacity: 0.7,
  },
  thumbnailContainer: {
    width: "100%",
    height: moderateScale(200),
    backgroundColor: "#E2E8F0",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Slight dimming to make the play button pop
  },
  durationPill: {
    position: "absolute",
    bottom: moderateScale(10),
    right: moderateScale(10),
    backgroundColor: "rgba(15, 23, 42, 0.8)", // Dark slate background
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
  },
  durationText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#FFFFFF",
  },
  inactiveBadge: {
    position: "absolute",
    top: moderateScale(10),
    left: moderateScale(10),
    backgroundColor: colors.Danger_Red,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
  },
  inactiveText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(10),
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  contentContainer: {
    padding: moderateScale(16),
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    color: "#0F172A",
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(22),
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    marginBottom: moderateScale(12),
    lineHeight: moderateScale(18),
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateScale(4),
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  authorText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#64748B",
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(11),
    color: "#94A3B8",
  },
});
