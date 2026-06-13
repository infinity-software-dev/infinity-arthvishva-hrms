import { View, StyleSheet } from "react-native";
import React from "react";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ModernTopTabBar } from "@/components/navbar/ModernTopBar";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import ApplyTab from "@/components/cards/ResignationScreen/ApplyTab";
import HistoryTab from "@/components/cards/ResignationScreen/HistoryTab";

const Tab = createMaterialTopTabNavigator();

const ResignationScreen = () => {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.Base_Background }}
            edges={["bottom"]}
        >
            <View style={styles.container}>
                <CustomHeader title="Resignation Center" />

                <Tab.Navigator
                    initialRouteName="Apply Resignation"
                    tabBar={(props) => <ModernTopTabBar {...props} />}
                    screenOptions={{
                        swipeEnabled: true,
                    }}
                >
                    <Tab.Screen
                        name="Apply Resignation"
                        component={ApplyTab}
                        options={{ title: "Apply" }}
                    />
                    <Tab.Screen
                        name="Resignation History"
                        component={HistoryTab}
                        options={{ title: "History" }}
                    />
                </Tab.Navigator>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Base_Background,
    },
});

export default ResignationScreen