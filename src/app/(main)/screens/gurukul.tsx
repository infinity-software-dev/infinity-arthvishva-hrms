import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import VideoCard from "@/components/cards/GurukulScreen/VideoCard";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGurukulVideos } from "@/hooks/useGurukulVideos";

export default function GurukulScreen() {
  const { state, actions } = useGurukulVideos();

  // UI Renderers
  const renderFooter = () => {
    if (!state.isFetchingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.Brand_Green} />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (state.isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="videocam-outline"
          size={moderateScale(48)}
          color="#CBD5E1"
        />
        <Text style={styles.emptyText}>
          {state.searchQuery
            ? "No videos found for this search."
            : "No videos available in Gurukul yet."}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <CustomHeader title="IA Gurukul" />

        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={moderateScale(20)} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search learning videos..."
              placeholderTextColor="#94A3B8"
              value={state.searchQuery}
              onChangeText={actions.setSearchQuery}
              autoCorrect={false}
            />
            {state.searchQuery.length > 0 && (
              <Ionicons
                name="close-circle"
                size={moderateScale(20)}
                color="#94A3B8"
                onPress={() => actions.setSearchQuery("")}
              />
            )}
          </View>
        </View>

        {/* Main List */}
        {state.isLoading && state.page === 1 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.Brand_Green} />
          </View>
        ) : (
          <FlatList
            data={state.videos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <VideoCard video={item} onPress={actions.handleVideoPress} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={actions.handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={state.isRefreshing}
                onRefresh={actions.handleRefresh}
                tintColor={colors.Brand_Green}
                colors={[colors.Brand_Green]}
              />
            }
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: moderateScale(16),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    height: moderateScale(46),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#0F172A",
  },
  listContainer: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
  footerLoader: {
    paddingVertical: moderateScale(20),
    alignItems: "center",
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
    textAlign: "center",
  },
});
