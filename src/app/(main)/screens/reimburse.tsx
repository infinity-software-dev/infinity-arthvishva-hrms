import { View, Image, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import { CustomHeader } from "@/components/navbar/CustomHeader";

const ExpenseScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["bottom"]}
    >
      <CustomHeader title="Expenses" />

      <View style={styles.container}>
        <Image
          source={require("@/assets/images/coming-soon.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
  }
});

export default ExpenseScreen;