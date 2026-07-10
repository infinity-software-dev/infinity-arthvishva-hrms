import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { colors, FONTS } from "@/constants/theme";

export function ModernTopTabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Format the label
        const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
        const label =
          typeof rawLabel === "string"
            ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)
            : rawLabel;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.activeBackground,
                { opacity: isFocused ? 1 : 0 },
              ]}
            />

            {/* The Text Layer */}
            <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.Base_Background,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    gap: moderateScale(8),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(10),
  },
  activeBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(20),
    shadowColor: colors.BRAND_SECONDARY_Dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#94A3B8",
    zIndex: 2,
  },
  activeTabText: {
    fontFamily: FONTS.bold,
    color: colors.BRAND_SECONDARY_Dark,
  },
});
