import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import apiClient from "@/apis/client";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { Ionicons } from "@expo/vector-icons";

// types/announcement.ts
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdBy: { name: string; role: string; profileImageUrl?: string };
  createdAt: string;
  expiresAt?: string;
}

const AnnouncementScreen = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/announcements/my");
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: getPriorityColor(item.priority) },
        ]}
      />
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.footer}>
          <Text style={styles.author}>
            By {item.createdBy?.name || "Admin"}
          </Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <CustomHeader title="Announcements" />
      <FlatList
        data={announcements}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchAnnouncements}
            tintColor={colors.BRAND_SECONDARY}
            colors={[colors.BRAND_SECONDARY]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle" size={48} color="#888" />
              <Text style={styles.empty}>No new announcements.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

// Helper for dynamic colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return colors.Danger_Red;
    case "High":
      return colors.Warning_Yellow;
    default:
      return colors.BRAND_PRIMARY;
  }
};

const styles = StyleSheet.create({
  list: { padding: moderateScale(16) },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(16),
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  priorityIndicator: { width: moderateScale(6) },
  contentWrapper: { padding: moderateScale(16), flex: 1 },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    color: "#0F172A",
    marginBottom: moderateScale(8),
  },
  content: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#475569",
    marginBottom: moderateScale(12),
  },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  author: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#94A3B8",
  },
  date: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(11),
    color: "#94A3B8",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  empty: {
    textAlign: "center",
    marginTop: moderateScale(50),
    color: "#94A3B8",
  },
});

export default AnnouncementScreen;
