import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import UniversalButton from "@/components/buttons/UniversalButton"; // Adjust path if needed

// Matches your backend enums
const CATEGORIES = [
  "Facilities",
  "Work Environment",
  "Management",
  "Policy Violation",
  "Harassment",
  "Discrimination",
  "Other",
];

const PRIORITIES = ["Low", "Medium", "High"];

interface NewComplaintModalProps {
  onSubmit: (payload: {
    title: string;
    category: string;
    priority: string;
    description: string;
  }) => Promise<{ success: boolean; error?: any }>;
  isSubmitting: boolean;
}

export default function NewComplaintModal({
  onSubmit,
  isSubmitting,
}: NewComplaintModalProps) {
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!category) newErrors.category = "Please select a category";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Call the action passed down from the useHelpDesk hook
    const result = await onSubmit({
      title: title.trim(),
      category,
      priority,
      description: description.trim(),
    });

    // Only clear the form if the submission was actually successful
    if (result.success) {
      setTitle("");
      setCategory("");
      setPriority("Medium");
      setDescription("");
      setErrors({});
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" // Important: lets users tap Submit while keyboard is open
    >
      {/* 1. Title Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Issue Title <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.textInput, errors.title && styles.inputError]}
          placeholder="Briefly describe the issue..."
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          maxLength={100}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* 2. Category Selection (Pills) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Category <Text style={styles.asterisk}>*</Text>
        </Text>
        <View style={styles.pillContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, category === cat && styles.activePill]}
              onPress={() => {
                setCategory(cat);
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: "" }));
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pillText,
                  category === cat && styles.activePillText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category && (
          <Text style={styles.errorText}>{errors.category}</Text>
        )}
      </View>

      {/* 3. Priority Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {PRIORITIES.map((pri) => {
            const isActive = priority === pri;
            return (
              <TouchableOpacity
                key={pri}
                style={[
                  styles.priorityBox,
                  isActive && {
                    borderColor:
                      pri === "High"
                        ? colors.Danger_Red
                        : pri === "Medium"
                          ? colors.Rise_Orange || "#F97316"
                          : colors.Brand_Green,
                    backgroundColor:
                      pri === "High"
                        ? `${colors.Danger_Red}10`
                        : pri === "Medium"
                          ? `${colors.Rise_Orange || "#F97316"}10`
                          : `${colors.Brand_Green}10`,
                  },
                ]}
                onPress={() => setPriority(pri)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.priorityText,
                    isActive && {
                      color:
                        pri === "High"
                          ? colors.Danger_Red
                          : pri === "Medium"
                            ? colors.Rise_Orange || "#F97316"
                            : colors.Brand_Green,
                      fontFamily: FONTS.bold,
                    },
                  ]}
                >
                  {pri}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. Description Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Detailed Description <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.textInput,
            styles.textArea,
            errors.description && styles.inputError,
          ]}
          placeholder="Please provide as much detail as possible to help us resolve this quickly..."
          placeholderTextColor="#94A3B8"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description)
              setErrors((prev) => ({ ...prev, description: "" }));
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={2000}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}
      </View>

      {/* Submit Button */}
      <UniversalButton
        title="Submit Ticket"
        onPress={handleSubmit}
        isLoading={isSubmitting}
        color={colors.Brand_Green}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateScale(10),
  },
  inputGroup: {
    marginBottom: moderateScale(20),
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(13),
    color: "#334155",
    marginBottom: moderateScale(8),
  },
  asterisk: {
    color: colors.Danger_Red,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#0F172A",
  },
  textArea: {
    minHeight: moderateScale(100),
    paddingTop: moderateScale(12),
  },
  inputError: {
    borderColor: colors.Danger_Red,
    backgroundColor: `${colors.Danger_Red}05`,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(11),
    color: colors.Danger_Red,
    marginTop: moderateScale(4),
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
  pill: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(20),
  },
  activePill: {
    backgroundColor: colors.Brand_Blue,
    borderColor: colors.Brand_Blue,
  },
  pillText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#64748B",
  },
  activePillText: {
    color: "#FFFFFF",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  priorityBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: moderateScale(10),
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(10),
  },
  priorityText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(13),
    color: "#64748B",
  },
  submitBtn: {
    marginTop: moderateScale(10),
    marginBottom: moderateScale(20),
  },
});
