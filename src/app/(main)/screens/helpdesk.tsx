import { View, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { ModernTopTabBar } from "@/components/navbar/ModernTopBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ComplaintHistory from "@/components/cards/HelpDeskScreen/ComplaintHistory";
import GeneralDesk from "@/components/cards/HelpDeskScreen/GeneralDesk";

const Tab = createMaterialTopTabNavigator();

const HelpDeskScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <CustomHeader title="Help Desk" />
        <Tab.Navigator
          initialRouteName="GeneralDesk"
          tabBar={(props) => <ModernTopTabBar {...props} />}
          screenOptions={{
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="GeneralDesk"
            component={GeneralDesk}
            options={{ title: "General" }}
          />
          <Tab.Screen
            name="ComplaintHistory"
            component={ComplaintHistory}
            options={{ title: "Complaints" }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HelpDeskScreen;
