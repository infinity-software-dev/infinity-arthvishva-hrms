import { View, StyleSheet } from "react-native";
import React from "react";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ModernTopTabBar } from "@/components/navbar/ModernTopBar";
import ApplyLeaves from "@/components/cards/LeavesScreen/ApplyLeaves";
import LeavesHistory from "@/components/cards/LeavesScreen/LeavesHistory";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

const LeaveScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <CustomHeader title="Leave Center" />

        <Tab.Navigator
          initialRouteName="ApplyLeaves"
          tabBar={(props) => <ModernTopTabBar {...props} />}
          screenOptions={{
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="ApplyLeaves"
            component={ApplyLeaves}
            options={{ title: "Apply" }}
          />
          <Tab.Screen
            name="LeavesHistory"
            component={LeavesHistory}
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

export default LeaveScreen;
