import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { ACTIONS } from "@/local-storage/quickActionData";
import { Href, router } from "expo-router";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - moderateScale(40);

export default function QuickActions() {
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedActions = useMemo(() => {
    const pages = [];
    for (let i = 0; i < ACTIONS.length; i += 6) {
      pages.push(ACTIONS.slice(i, i + 6));
    }
    return pages;
  }, []);

  const handlePress = (route: Href) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={PAGE_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / PAGE_WIDTH,
          );
          setCurrentPage(pageIndex);
        }}
      >
        {paginatedActions.map((page, pageIndex) => (
          <View
            key={pageIndex}
            style={[styles.pageContainer, { width: PAGE_WIDTH }]}
          >
            {page.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => handlePress(action.route)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.iconBox, { backgroundColor: action.bgColor }]}
                >
                  {action.iconFamily === "Ionicons" ? (
                    <Ionicons
                      name={action.icon as any}
                      size={moderateScale(24)}
                      color={action.iconColor}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={moderateScale(24)}
                      color={action.iconColor}
                    />
                  )}
                </View>
                <Text style={styles.actionTitle} numberOfLines={1}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationDots}>
        {paginatedActions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width:
                  currentPage === index ? moderateScale(16) : moderateScale(6),
                backgroundColor:
                  currentPage === index ? colors.Brand_Blue : "#D1D5DB",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(25),
    marginBottom: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#1F2937",
    marginBottom: moderateScale(15),
  },
  pageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  actionItem: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  iconBox: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(18),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#4B5563",
    textAlign: "center",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(5),
  },
  dot: {
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    marginHorizontal: moderateScale(4),
  },
});
