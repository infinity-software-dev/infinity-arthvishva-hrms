import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { colors } from "@/constants/theme";

const DirectoryScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View>
        <CustomHeader title="Directory" />
      </View>
    </SafeAreaView>
  );
};

export default DirectoryScreen;
