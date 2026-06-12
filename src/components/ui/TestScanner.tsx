import React, { useState } from "react";
import { View, Button, Text, ScrollView, StyleSheet } from "react-native";
import { useScannerStore } from "@/store/useScannerStore";
import { moderateScale } from "react-native-size-matters";

export default function ScannerRegistrationScreen() {
  const openScanner = useScannerStore((state) => state.openScanner);

  // Update state to hold the array of arrays
  const [capturedDescriptors, setCapturedDescriptors] = useState<number[][] | null>(null);

  const handleTestRegister = () => {
    openScanner(
      "register",
      null,
      (newDescriptors, imageBase64) => {
        // SUCCESS CALLBACK
        console.log("============= FACE BURST DETECTED =============");
        console.log("Profiles Captured:", newDescriptors.length); // Should be 3
        if (newDescriptors.length > 0) {
          console.log("Array 1 Length:", newDescriptors[0].length); // Should be 128
        }
        console.log("===============================================");

        setCapturedDescriptors(newDescriptors);
        alert(`Success! Captured ${newDescriptors.length} face profiles.`);
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
        title="Test Face Burst Registration"
        onPress={handleTestRegister}
        color="#573CFF"
      />

      {capturedDescriptors && (
        <View style={styles.resultBox}>
          <Text style={styles.title}>Captured Profiles ({capturedDescriptors.length}):</Text>

          {capturedDescriptors.map((desc, index) => (
            <View key={index} style={styles.profileRow}>
              <Text style={styles.subTitle}>Profile {index + 1}:</Text>
              <Text style={styles.codeText}>
                [ {desc.slice(0, 5).map((n) => n.toFixed(3)).join(", ")} ... ]
              </Text>
            </View>
          ))}
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
  title: { fontWeight: "bold", marginBottom: 15, fontSize: moderateScale(16) },
  subTitle: { fontWeight: "600", marginTop: 10, color: "#573CFF" },
  profileRow: { marginBottom: 10 },
  codeText: { fontFamily: "monospace", fontSize: moderateScale(12), color: "#333" },
});