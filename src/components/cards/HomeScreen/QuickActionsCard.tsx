import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { ACTIONS } from "@/local-storage/quickActionData";
import { Href, router } from "expo-router";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - moderateScale(40);

interface QuickActionsProps {
  isLeadershipRole: boolean;
  pendingApprovalsCount: number;
}

export default function QuickActions({
  isLeadershipRole,
  pendingApprovalsCount
}: QuickActionsProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Initialize animated value for opacity tracking
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Triggers the constant looping fade animation
  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2, // Dims down to 20% opacity
          duration: 800, // Speed of fading out (in ms)
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1, // Returns to 100% full opacity
          duration: 800, // Speed of fading back in (in ms)
          useNativeDriver: true,
        }),
      ])
    );

    blinkAnimation.start();

    return () => blinkAnimation.stop();
  }, [blinkAnim]);

  // Process array dynamically based on leadership status and live metrics
  const paginatedActions = useMemo(() => {
    // Step A: Filter by leadership role only
    let filtered = ACTIONS.filter((action) => {
      if (action.id === "approvals") {
        return isLeadershipRole;
      }
      return true;
    });

    // Step B: Inject live notification dot/badge states dynamically
    filtered = filtered.map((action) => {
      if (action.id === "approvals") {
        return {
          ...action,
          showBadge: pendingApprovalsCount > 0,
          badgeCount: pendingApprovalsCount,
        };
      }
      return action;
    });

    // Step C: Chunking into pages of 6 items
    const pages = [];
    for (let i = 0; i < filtered.length; i += 6) {
      pages.push(filtered.slice(i, i + 6));
    }
    return pages;
  }, [isLeadershipRole, pendingApprovalsCount]);

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
                <View style={styles.iconContainer}>
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

                  {/* Blinking Badge rendering */}
                  {action.showBadge && (
                    <Animated.View style={[styles.numericBadge, { opacity: blinkAnim }]}>
                      <Text style={styles.badgeText}>{action.badgeCount}</Text>
                    </Animated.View>
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
                  currentPage === index ? colors.BRAND_PRIMARY : "#D1D5DB",
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
  iconContainer: {
    position: "relative",
    marginBottom: moderateScale(8),
  },
  iconBox: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(18),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  numericBadge: {
    position: "absolute",
    top: moderateScale(-2),
    right: moderateScale(-4),
    minWidth: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    backgroundColor: "#FF0069",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(4),
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: moderateScale(10),
    fontFamily: FONTS.bold,
    textAlign: "center",
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