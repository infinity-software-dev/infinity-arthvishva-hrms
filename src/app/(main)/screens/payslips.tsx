import { View, StyleSheet } from "react-native";
import React from "react";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ModernTopTabBar } from "@/components/navbar/ModernTopBar";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import OldPayrollTab from "@/components/cards/PayrollScreen/OldPayrollTab";
import NewPayrollTab from "@/components/cards/PayrollScreen/NewPayrollTab";

const Tab = createMaterialTopTabNavigator();

const PaySlipsScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <CustomHeader title="Payslips Center" />

        <Tab.Navigator
          initialRouteName="NewPayrollTab"
          tabBar={(props) => <ModernTopTabBar {...props} />}
          screenOptions={{
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="NewPayrollTab"
            component={NewPayrollTab}
            options={{ title: "Generate New" }}
          />
          <Tab.Screen
            name="OldPayrollTab"
            component={OldPayrollTab}
            options={{ title: "Payroll History" }}
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

export default PaySlipsScreen;
