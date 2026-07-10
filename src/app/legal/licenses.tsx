import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useRouter } from "expo-router";
import { colors, FONTS } from "@/constants/theme";

export default function OpenSourceLicenses() {
  const router = useRouter();

  const openEmail = () => {
    Linking.openURL("mailto:support@infinityarthvishva.com");
  };

  const LicenseBlock = ({
    name,
    url,
    licenseText,
  }: {
    name: string;
    url: string;
    licenseText: string;
  }) => (
    <View style={styles.block}>
      <Text style={styles.libraryName}>{name}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(url)}
        activeOpacity={0.7}
      >
        <Text style={styles.libraryUrl}>{url}</Text>
      </TouchableOpacity>
      <Text style={styles.licenseText}>{licenseText}</Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />
      <Text style={styles.appTitle}>Infinity HRMS</Text>
      <Text style={styles.title}>Open Source Licenses</Text>
      <Text style={styles.meta}>
        This application uses open source libraries. Acknowledgements and
        license texts are reproduced below in compliance with open-source
        obligations.
      </Text>

      <LicenseBlock
        name="React Native"
        url="https://github.com/facebook/react-native"
        licenseText={`MIT License\nCopyright (c) Meta Platforms, Inc. and affiliates.\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.`}
      />

      <LicenseBlock
        name="Expo"
        url="https://github.com/expo/expo"
        licenseText={`MIT License\nCopyright (c) 2015-present 650 Industries, Inc.\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction under the MIT License terms.`}
      />

      <LicenseBlock
        name="React Navigation"
        url="https://github.com/react-navigation/react-navigation"
        licenseText={`MIT License\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including use, copy, modify, and distribute.`}
      />

      <LicenseBlock
        name="Zustand"
        url="https://github.com/pmndrs/zustand"
        licenseText={`MIT License\nCopyright (c) 2019 Paul Henschel\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions.`}
      />

      <LicenseBlock
        name="React Native Firebase"
        url="https://github.com/invertase/react-native-firebase"
        licenseText={`Apache License 2.0\nCopyright (c) 2016-present Invertase Limited.\nLicensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.\nYou may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0`}
      />

      <LicenseBlock
        name="Software Mansion Libraries (Reanimated / Gesture Handler)"
        url="https://github.com/software-mansion"
        licenseText={`MIT License\nCopyright (c) Software Mansion\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction.`}
      />

      <LicenseBlock
        name="Axios"
        url="https://github.com/axios/axios"
        licenseText={`MIT License\nCopyright (c) 2014-present Matt Zabriskie & Collaborators\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.`}
      />

      <LicenseBlock
        name="Lucide Icons"
        url="https://github.com/lucide-icons/lucide"
        licenseText={`ISC License\nCopyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather. All other copyright (c) for Lucide are held by Lucide Contributors 2022.\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.`}
      />

      <Text style={styles.metaSmall}>
        For questions or additional license details, contact{" "}
        <Text style={styles.emailLink} onPress={openEmail}>
          support@infinityarthvishva.com
        </Text>
        .
      </Text>

      {/* Internal Navigation Links Section */}
      <View style={styles.legalLinksContainer}>
        <TouchableOpacity
          onPress={() => router.push("/legal/privacy")}
          activeOpacity={0.7}
        >
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>

        <Text style={styles.separator}>•</Text>

        <TouchableOpacity
          onPress={() => router.push("/legal/terms")}
          activeOpacity={0.7}
        >
          <Text style={styles.link}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} Infinity Arthvishva. All rights reserved.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(50),
    backgroundColor: colors.Base_Background,
  },
  appTitle: {
    fontSize: moderateScale(24),
    fontFamily: FONTS.extraBold,
    color: "#0F172A",
    marginBottom: moderateScale(24),
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: FONTS.bold,
    color: "#0F172A",
    marginBottom: moderateScale(8),
  },
  meta: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.regular,
    color: "#475569",
    marginBottom: moderateScale(24),
    textAlign: "justify",
    lineHeight: moderateScale(20),
  },
  block: {
    marginBottom: moderateScale(24),
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
    paddingBottom: moderateScale(16),
  },
  libraryName: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.bold,
    color: "#0F172A",
    marginBottom: moderateScale(4),
  },
  libraryUrl: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.medium,
    color: colors.BRAND_PRIMARY,
    marginBottom: moderateScale(8),
  },
  licenseText: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.regular,
    color: "#64748B",
    lineHeight: moderateScale(18),
    textAlign: "justify",
  },
  metaSmall: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.medium,
    color: "#64748B",
    marginTop: moderateScale(16),
    marginBottom: moderateScale(24),
    lineHeight: moderateScale(18),
  },
  emailLink: {
    color: colors.BRAND_PRIMARY,
  },
  legalLinksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(16),
    gap: moderateScale(12),
  },
  link: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.semiBold,
    color: colors.BRAND_PRIMARY,
  },
  separator: {
    fontSize: moderateScale(14),
    color: "#CBD5E1",
  },
  footer: {
    textAlign: "center",
    marginTop: moderateScale(8),
    fontSize: moderateScale(11),
    fontFamily: FONTS.medium,
    color: "#94A3B8",
  },
});
