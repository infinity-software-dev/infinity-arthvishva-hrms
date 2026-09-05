import FaceScannerEngine from "@/components/ui/FaceScannerEngine";
import OfflineScreen from "@/components/ui/OfflineScreen";
import { colors, FONTS } from "@/constants/theme";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import {
  Ubuntu_400Regular_Italic,
  Ubuntu_700Bold,
  useFonts,
} from "@expo-google-fonts/ubuntu";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Ubuntu_700Bold,
    Ubuntu_400Regular_Italic,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Use hideAsync() for newer Expo versions
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <OfflineScreen />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* These map directly to the (auth) and (main) folders we are creating */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(setup)" options={{ headerShown: false }} />

        {/* Shared Legal Modals */}
        <Stack.Screen
          name="legal/terms"
          options={{
            presentation: "modal",
            headerTitle: "Terms of Service",
            headerStyle: {
              backgroundColor: colors.BRAND_PRIMARY,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.bold,
            },
          }}
        />
        <Stack.Screen
          name="legal/privacy"
          options={{
            presentation: "modal",
            headerTitle: "Privacy Policy",
            headerStyle: {
              backgroundColor: colors.BRAND_SECONDARY,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.bold,
            },
          }}
        />
        <Stack.Screen
          name="legal/licenses"
          options={{
            presentation: "modal",
            headerTitle: "Open Source Licenses",
            headerStyle: {
              backgroundColor: colors.BRAND_SECONDARY,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.bold,
            },
          }}
        />

        <Stack.Screen
          name="globalAlert/index"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="deactivedAccount/DeactivatedAccountScreen"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "fade",
          }}
        />
      </Stack>
      <FaceScannerEngine />
    </>
  );
}
