import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { useHelpDesk } from "@/hooks/useHelpDesk";

export default function GeneralDesk() {
  const { state, actions } = useHelpDesk();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SLA Guidelines Banner */}
      <View style={styles.slaBanner}>
        <Ionicons
          name="information-circle"
          size={moderateScale(24)}
          color={colors.Brand_Blue}
        />
        <View style={styles.slaTextWrapper}>
          <Text style={styles.slaTitle}>Support Hours</Text>
          <Text style={styles.slaDesc}>
            Our Help Desk operates from{" "}
            <Text style={{ fontFamily: FONTS.bold }}>9:30 AM to 6:30 PM</Text>,
            Monday to Saturday.
          </Text>
        </View>
      </View>

      {/* FAQs Section */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

      <View style={styles.faqCard}>
        {state.faqs.map((faq, index) => {
          const isExpanded = state.expandedFaqIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.faqItem,
                index !== state.faqs.length - 1 && styles.faqBorder,
              ]}
              activeOpacity={0.7}
              onPress={() => actions.toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.questionText}>{faq.q}</Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={moderateScale(20)}
                  color="#94A3B8"
                />
              </View>
              {isExpanded && <Text style={styles.answerText}>{faq.a}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.Base_Background },
  content: { padding: moderateScale(16), paddingBottom: moderateScale(100) },
  slaBanner: {
    flexDirection: "row",
    backgroundColor: `${colors.Brand_Blue}15`,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(24),
  },
  slaTextWrapper: { marginLeft: moderateScale(12), flex: 1 },
  slaTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(14),
    color: colors.Brand_Blue,
    marginBottom: moderateScale(4),
  },
  slaDesc: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#334155",
    lineHeight: moderateScale(18),
  },
  sectionTitle: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    color: "#0F172A",
    marginBottom: moderateScale(12),
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  faqItem: { padding: moderateScale(16) },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(14),
    color: "#1E293B",
    paddingRight: moderateScale(12),
  },
  answerText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    marginTop: moderateScale(12),
    lineHeight: moderateScale(20),
  },
});
