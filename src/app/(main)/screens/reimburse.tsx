// src/app/(main)/screens/reimburse.tsx
import { View, StyleSheet } from "react-native";
import React from "react";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ModernTopTabBar } from "@/components/navbar/ModernTopBar";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import ReimbursementForm from "@/components/cards/ReimbursementScreen/ReimbursementForm";
import ReimbursementHistory from "@/components/cards/ReimbursementScreen/ReimbursementHistory";

const Tab = createMaterialTopTabNavigator();

const ReimbursementScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <CustomHeader title="Apply Reimbursement" />

        <Tab.Navigator
          initialRouteName="ApplyReimbursement"
          tabBar={(props) => <ModernTopTabBar {...props} />}
          screenOptions={{
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="ApplyReimbursement"
            component={ReimbursementForm}
            options={{ title: "Apply" }}
          />
          <Tab.Screen
            name="ReimbursementHistory"
            component={ReimbursementHistory}
            options={{ title: "History" }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
});

export default ReimbursementScreen;
