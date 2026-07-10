import { View, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import { ModernTopTabBar } from "@/components/navbar/ModernTopBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RequestsInbox from "@/components/cards/ApprovalsScreen/RequestsInbox";
import RequestsHistory from "@/components/cards/ApprovalsScreen/RequestsHistory";

const Tab = createMaterialTopTabNavigator();

const ApprovalsScreen = () => {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.Base_Background }}
            edges={["bottom"]}
        >
            <View style={styles.container}>
                <CustomHeader title="Approvals" />
                <Tab.Navigator
                    initialRouteName="RequestsInbox"
                    tabBar={(props) => <ModernTopTabBar {...props} />}
                    screenOptions={{
                        swipeEnabled: true,
                    }}
                >
                    <Tab.Screen
                        name="RequestsInbox"
                        component={RequestsInbox}
                        options={{ title: "Requests Inbox" }}
                    />
                    <Tab.Screen
                        name="RequestsHistory"
                        component={RequestsHistory}
                        options={{ title: "Requests History" }}
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

export default ApprovalsScreen;
