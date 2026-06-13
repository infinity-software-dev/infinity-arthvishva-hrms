import AttendanceCard from "@/components/cards/SummaryScreen/AttendanceCard";
import StatsOverview from "@/components/cards/SummaryScreen/StatsOverview";
import { colors, FONTS } from "@/constants/theme";
import { useAttendanceSummary } from "@/hooks/useAttendanceSummary";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { AttendanceDayRecord } from "@/types/attendance";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import AttendanceDetails from "@/components/cards/SummaryScreen/AttendanceDetails";

const AttendanceSummaryScreen: React.FC = () => {
  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceDayRecord | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const {
    summaryStats,
    records,
    loading,
    formattedMonthYear,
    goToNextMonth,
    goToPrevMonth,
    refetch,
    markCorrectionAsRequested
  } = useAttendanceSummary();

  const handleOpenDetails = (record: AttendanceDayRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedRecord(null), 300); // Clear after slide animation finishes
  };


  const renderHeader = () => (
    <View>
      <View style={styles.monthSelector}>
        <TouchableOpacity
          onPress={goToPrevMonth}
          style={styles.arrowBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>{formattedMonthYear}</Text>

        <TouchableOpacity
          onPress={goToNextMonth}
          style={styles.arrowBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <StatsOverview stats={summaryStats} loading={loading} />
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <CustomHeader title="Attendance Summary" />
        <FlatList<AttendanceDayRecord>
          data={records}
          keyExtractor={(item) => item.date.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={colors.Brand_Green}
              colors={[colors.Brand_Green]}
            />
          }
          renderItem={({ item }) => (
            <AttendanceCard
              data={item}
              onViewDetails={() => handleOpenDetails(item)}
            />
          )}
        />

        <CustomBottomModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          title='Attendance Details'
        >
          {selectedRecord && <AttendanceDetails
            data={selectedRecord}
            onCorrectionSuccess={markCorrectionAsRequested}
          />}
        </CustomBottomModal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  listContent: {
    paddingHorizontal: moderateScale(8),
    paddingBottom: moderateScale(10),
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(24),
    marginTop: moderateScale(16),
  },
  monthText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(18),
    color: "#0F172A",
  },
  arrowBtn: {
    padding: moderateScale(8),
  },
  arrowText: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(18),
    color: "#64748B",
  },
});

export default AttendanceSummaryScreen;
