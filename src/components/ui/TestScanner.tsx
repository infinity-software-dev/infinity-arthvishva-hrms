import React, { useState } from "react";
import { View, Button, Text, ScrollView, StyleSheet } from "react-native";
import { useScannerStore } from "@/store/useScannerStore";
import { moderateScale } from "react-native-size-matters";

export default function TestScannerScreen() {
  const openScanner = useScannerStore((state) => state.openScanner);
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[] | null>(
    null,
  );

  const handleTestRegister = () => {
    openScanner(
      "register", // 'register' skips the matching phase and just returns your live face
      null,
      (newDescriptor, imageBase64) => {
        // SUCCESS CALLBACK
        console.log("============= FACE DETECTED =============");
        console.log("Array Length:", newDescriptor.length); // Should be 128
        console.log("Raw Descriptor Data:", newDescriptor);
        console.log("=========================================");

        setCapturedDescriptor(newDescriptor);
        alert("Check your console! Array captured.");
      },
      (errorMsg) => {
        // ERROR CALLBACK
        alert("Camera Error: " + errorMsg);
      },
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        title="Test Face Registration"
        onPress={handleTestRegister}
        color="#573CFF"
      />

      {capturedDescriptor && (
        <View style={styles.resultBox}>
          <Text style={styles.title}>Captured 128-D Array:</Text>
          <Text style={styles.codeText}>
            [{" "}
            {capturedDescriptor
              .slice(0, 5)
              .map((n) => n.toFixed(3))
              .join(", ")}{" "}
            ... ]
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  resultBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  title: { fontWeight: "bold", marginBottom: 10 },
  codeText: { fontFamily: "monospace", fontSize: moderateScale(12) },
});
