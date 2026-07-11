import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, LayoutAnimation } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { WorkReport } from "@/hooks/useTeamReports";

interface CardProps {
    item: WorkReport;
    onToggleRead: (id: string, currentState: boolean) => void;
}

export const ReportAccordionCard = ({ item, onToggleRead }: CardProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const toggleCollapseState = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={[styles.cardContainer, item.isReportRead && styles.cardContainerRead]}>

            {/* Trigger Row */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleCollapseState}
                style={styles.cardHeaderRow}
            >
                <View style={styles.profileSection}>
                    {item.reportParticipant?.profileImageUrl ? (
                        <Image source={{ uri: item.reportParticipant.profileImageUrl }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarFallbackText}>{item.reportParticipant?.name?.charAt(0) || "E"}</Text>
                        </View>
                    )}

                    <View style={styles.metaTextDataBlock}>
                        <Text style={styles.employeeNameText} numberOfLines={1}>{item.reportParticipant?.name || "Employee"}</Text>
                        <Text style={styles.employeePositionText} numberOfLines={1}>{item.reportParticipant?.position || "Team Member"}</Text>
                    </View>
                </View>

                <View style={styles.rightHeaderControls}>
                    <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={moderateScale(16)}
                        color="#64748B"
                    />
                </View>
            </TouchableOpacity>

            {/* Expandable Body */}
            {expanded && (
                <View style={styles.collapsibleContentBody}>

                    {/* Section: Today's Work */}
                    <View style={[styles.fieldBlockSegment, styles.leftBorderSuccess]}>
                        <Text style={[styles.fieldBlockLabel, { color: colors.Success_Green }]}>Today's Work Tasks</Text>
                        <Text style={styles.fieldBlockValueText}>{item.todayWork || "No updates logged."}</Text>
                    </View>

                    {/* Section: Pending Work */}
                    <View style={[styles.fieldBlockSegment, styles.leftBorderWarning]}>
                        <Text style={[styles.fieldBlockLabel, { color: colors.Warning_Yellow }]}>Pending Tasks Remaining</Text>
                        <Text style={styles.fieldBlockValueText}>{item.pendingWork || "No pending updates logged."}</Text>
                    </View>

                    {/* Section: Issues Faced */}
                    <View style={[styles.fieldBlockSegment, styles.leftBorderMuted]}>
                        <Text style={[styles.fieldBlockLabel, { color: "#64748B" }]}>
                            Issues Faced / Blockers
                        </Text>
                        <Text style={styles.fieldBlockValueText}>{item.issuesFaced || "None logged."}</Text>
                    </View>

                    {/* Tray Actions */}
                    <View style={styles.actionTrayFooterRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setExpanded(false);
                                onToggleRead(item._id, item.isReportRead);
                            }}
                            style={[styles.actionSubmitBtn, item.isReportRead ? styles.btnMutedColor : styles.btnBrandPrimaryColor]}
                        >
                            <Ionicons
                                name={item.isReportRead ? "eye-off-outline" : "checkmark-circle-outline"}
                                size={moderateScale(14)}
                                color="#FFFFFF"
                                style={{ marginRight: moderateScale(4) }}
                            />
                            <Text style={styles.actionSubmitBtnText}>
                                {item.isReportRead ? "Mark Unread" : "Mark as Reviewed"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: moderateScale(8),
        overflow: "hidden",
        elevation: 1,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
    },
    cardContainerRead: {
        opacity: 0.55,
        backgroundColor: colors.Base_Background,
    },
    cardHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: moderateScale(12),
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatarImage: {
        width: moderateScale(34),
        height: moderateScale(34),
        borderRadius: moderateScale(17),
        backgroundColor: "#F1F5F9",
    },
    avatarFallback: {
        width: moderateScale(34),
        height: moderateScale(34),
        borderRadius: moderateScale(17),
        backgroundColor: "#E2E8F0",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarFallbackText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(13),
        color: "#475569",
    },
    metaTextDataBlock: {
        marginLeft: moderateScale(10),
        flex: 1,
    },
    employeeNameText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(13),
        color: "#0F172A",
    },
    employeePositionText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(11),
        color: "#64748B",
        marginTop: moderateScale(1),
    },
    rightHeaderControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(6),
    },
    collapsibleContentBody: {
        paddingHorizontal: moderateScale(12),
        paddingBottom: moderateScale(12),
        backgroundColor: "#FAFAFA",
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        borderStyle: "dashed",
    },
    fieldBlockSegment: {
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(8),
        padding: moderateScale(10),
        marginTop: moderateScale(10),
        borderLeftWidth: 3,
    },
    leftBorderSuccess: { borderLeftColor: colors.Success_Green },
    leftBorderWarning: { borderLeftColor: colors.Warning_Yellow },
    leftBorderMuted: { borderLeftColor: "#CBD5E1" },
    fieldBlockLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(9),
        textTransform: "uppercase",
        letterSpacing: 0.3,
        marginBottom: moderateScale(2),
    },
    fieldBlockValueText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(12),
        color: "#334155",
        lineHeight: moderateScale(16),
    },
    actionTrayFooterRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: moderateScale(12),
    },
    actionSubmitBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(8),
    },
    btnBrandPrimaryColor: {
        backgroundColor: colors.BRAND_SECONDARY,
    },
    btnMutedColor: {
        backgroundColor: "#64748B",
    },
    actionSubmitBtnText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(11),
        color: "#FFFFFF",
    },
});