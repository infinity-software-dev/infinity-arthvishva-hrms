import { View } from "react-native";
import React from "react";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

const PaySlipsScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View>
        <CustomHeader title="Payslips" />
      </View>
    </SafeAreaView>
  );
};

export default PaySlipsScreen;
