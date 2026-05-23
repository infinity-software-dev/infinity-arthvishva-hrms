import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

// Components
import { CustomHeader } from "@/components/navbar/CustomHeader";

// Hook
import { useDirectory } from "@/hooks/useDirectory";
import DirectoryCard, {
  DirectoryEmployee,
} from "@/components/cards/DirectoryScreen/DirectoryCard";

const DirectoryScreen = () => {
  const { state, actions } = useDirectory();
  const { employees, isLoading, isFetchingMore, searchQuery } = state;

  const renderItem = ({ item }: { item: DirectoryEmployee }) => (
    <DirectoryCard employee={item} />
  );

  const renderFooter = () => {
    if (!isFetchingMore) return <View style={{ height: moderateScale(20) }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.Brand_Green} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="people-outline"
          size={moderateScale(48)}
          color="#94A3B8"
        />
        <Text style={styles.emptyText}>No employees found.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* ── WRAP HEADER & SEARCH ── */}
      {/* accessible={false} ensures screen readers don't treat the whole background as a button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <CustomHeader title="Directory" />

          {/* ── SEARCH BAR ── */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons
                name="search"
                size={moderateScale(20)}
                color="#94A3B8"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, email, or phone..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={actions.setSearchQuery}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Ionicons
                  name="close-circle"
                  size={moderateScale(20)}
                  color="#94A3B8"
                  onPress={() => {
                    actions.setSearchQuery("");
                    Keyboard.dismiss(); // Optional: Close keyboard when clearing search
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* ── LIST ── */}
      {isLoading && employees.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.Brand_Green} />
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item, index) => item.email + index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onEndReached={actions.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && employees.length > 0}
              onRefresh={actions.handleRefresh}
              tintColor={colors.Brand_Green}
              colors={[colors.Brand_Green]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#1E293B",
  },
  listContent: {
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(20),
  },
  footerLoader: {
    paddingVertical: moderateScale(20),
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(60),
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(15),
    color: "#64748B",
    marginTop: moderateScale(12),
  },
});

export default DirectoryScreen;
