import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { useVideoPlayer, VideoView } from "expo-video";
import { colors, FONTS } from "@/constants/theme";
import { VideoProps } from "@/components/cards/GurukulScreen/VideoCard";
import { StatusBar } from "expo-status-bar";

interface PlayerOverlayProps {
    video: VideoProps | null;
    onClose: () => void;
}

export default function PlayerOverlay({ video, onClose }: PlayerOverlayProps) {
    // Unconditional Hook Call to abide by React rules
    const player = useVideoPlayer(video?.cloudinaryUrl || null, (playerInstance) => {
        playerInstance.loop = false;
        if (video?.cloudinaryUrl) {
            playerInstance.play();
        }
    });

    return (
        <Modal
            visible={video !== null}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            {/* Dynamic light status bar items against the dark modal background */}
            <StatusBar style="light" />

            <View style={styles.modalWrapper}>
                {/* Top Handle Decorator for PageSheet feel */}
                <View style={styles.sheetHandle} />

                {/* Header Section */}
                <View style={styles.modalHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.categoryBadge}>LEARNING MODULE</Text>
                        <Text style={styles.modalTitle} numberOfLines={1}>
                            {video?.title || "Untitled Video"}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                        <Ionicons name="close" size={moderateScale(22)} color="#F1F5F9" />
                    </TouchableOpacity>
                </View>

                {/* Video Player Canvas Container */}
                <View style={styles.videoWrapper}>
                    <VideoView
                        player={player}
                        style={styles.videoPlayer}
                        nativeControls={true}
                        contentFit="contain"
                    />
                </View>

                {/* Info & Meta Details Section */}
                <View style={styles.detailsContainer}>
                    {video?.description ? (
                        <>
                            <Text style={styles.sectionHeading}>Description</Text>
                            <Text style={styles.videoDescription}>{video.description}</Text>
                        </>
                    ) : (
                        <View style={styles.emptyDescriptionState}>
                            <Ionicons name="information-circle-outline" size={20} color="#64748B" />
                            <Text style={styles.noDescriptionText}>No additional description available.</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    sheetHandle: {
        width: moderateScale(40),
        height: moderateScale(4),
        backgroundColor: "#334155",
        borderRadius: 2,
        alignSelf: "center",
        marginTop: moderateScale(10),
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: moderateScale(20),
        paddingTop: moderateScale(25),
        paddingBottom: moderateScale(20),
    },
    titleContainer: {
        flex: 1,
        paddingRight: moderateScale(16),
    },
    categoryBadge: {
        fontFamily: FONTS.extraBold,
        fontSize: moderateScale(10),
        color: colors.BRAND_SECONDARY,
        letterSpacing: 1,
        marginBottom: moderateScale(4),
    },
    modalTitle: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(18),
        color: "#FFFFFF",
    },
    closeButton: {
        backgroundColor: "#1E293B",
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },
    videoWrapper: {
        width: "100%",
        backgroundColor: "#000000",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#1E293B",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    videoPlayer: {
        width: "100%",
        aspectRatio: 16 / 9,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: "#1E293B",
        marginTop: moderateScale(20),
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        padding: moderateScale(24),
    },
    sectionHeading: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(13),
        color: "#94A3B8",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: moderateScale(10),
    },
    videoDescription: {
        fontFamily: FONTS.regular,
        fontSize: moderateScale(15),
        color: "#E2E8F0",
        lineHeight: moderateScale(22),
    },
    emptyDescriptionState: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(8),
        paddingTop: moderateScale(8),
    },
    noDescriptionText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#64748B",
    },
});