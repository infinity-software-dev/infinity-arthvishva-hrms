import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import { CustomHeader } from "@/components/navbar/CustomHeader";

const ExpenseScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View>
        <CustomHeader title="Expenses" />
      </View>
    </SafeAreaView>
  );
};

export default ExpenseScreen;
