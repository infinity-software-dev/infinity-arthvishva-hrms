import "../../notify";

import GlossyLogo from "@/components/glossy/GlossyLogo";
import {
  checkGlobalAlertStatus,
  updateFcmTokenService,
} from "@/services/appService";
import { getMyProfile } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { resetAndNavigate } from "@/utils/NavigationHelper";
import { getFcmToken } from "@/utils/NotificationHelper";
import { getAppPermissionReport } from "@/utils/PermissionCheck";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { initializeAppConfigs } from "@/services/configService";

SplashScreen.preventAutoHideAsync();
// This tells the OS to show the banner even when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // 1. shouldShowBanner replaces the old 'alert' for the drop-down effect
    shouldShowBanner: true,

    // 2. shouldShowList ensures it stays in the notification center
    shouldShowList: true,

    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// const newDescriptor = [
//   -0.13362763822078705, 0.06862928718328476, 0.10133456438779831,
//   0.01825484074652195, -0.0025324898306280375, -0.10837329924106598,
//   -0.051980599761009216, -0.06014789640903473, 0.1751706302165985,
//   -0.09231427311897278, 0.23246389627456665, 0.0997704267501831,
//   -0.1840025782585144, -0.02298077940940857, -0.019733689725399017,
//   0.06425294280052185, -0.11385432630777359, -0.06280165165662766,
//   -0.13973060250282288, -0.08019591122865677, -0.0020763149950653315,
//   0.03456421568989754, 0.09480355679988861, 0.07923814654350281,
//   -0.09726736694574356, -0.29079607129096985, -0.12308265268802643,
//   -0.16931429505348206, 0.06815789639949799, -0.1323537975549698,
//   -0.04647010564804077, -0.08061586320400238, -0.1248052790760994,
//   -0.05770976096391678, -0.0031300103291869164, 0.050468385219573975,
//   0.002972087822854519, -0.07284507900476456, 0.25850924849510193,
//   0.032434042543172836, -0.1579737365245819, -0.023031964898109436,
//   0.00635119341313839, 0.2710525095462799, 0.21583588421344757,
//   0.010264151729643345, 0.046836063265800476, -0.0643182173371315,
//   0.08635621517896652, -0.15625421702861786, 0.09695973247289658,
//   0.08372141420841217, 0.15036030113697052, 0.06136499345302582,
//   0.11911626160144806, -0.2296696901321411, 0.031123315915465355,
//   0.07079123705625534, -0.11475086212158203, 0.09194781631231308,
//   0.00005731172859668732, -0.09421417862176895, -0.026560228317975998,
//   0.06134437397122383, 0.22602291405200958, 0.11287768930196762,
//   -0.12028694897890091, -0.12229744344949722, 0.13918200135231018,
//   -0.19289860129356384, 0.008547516539692879, 0.11156072467565536,
//   -0.11164798587560654, -0.1363028883934021, -0.22877591848373413,
//   0.019696058705449104, 0.46526268124580383, 0.12761062383651733,
//   -0.23031184077262878, 0.02302885614335537, -0.13779230415821075,
//   -0.09661415219306946, 0.0357833057641983, 0.1474403440952301,
//   -0.12365885078907013, 0.05090202018618584, -0.11565051972866058,
//   0.02171531319618225, 0.15793220698833466, 0.06357380002737045,
//   -0.044179487973451614, 0.16018220782279968, -0.014603938907384872,
//   0.041122015565633774, 0.08123093843460083, -0.0009322247933596373,
//   -0.16548360884189606, -0.04691854864358902, -0.06544172763824463,
//   -0.054532602429389954, 0.037232063710689545, -0.10598742961883545,
//   -0.010657711885869503, 0.051262252032756805, -0.19323794543743134,
//   0.1268191784620285, 0.011451948434114456, -0.05297071486711502,
//   0.007509127724915743, 0.06876326352357864, -0.08741859346628189,
//   -0.03143394738435745, 0.18499480187892914, -0.21780504286289215,
//   0.21157054603099823, 0.16267964243888855, 0.0289619043469429,
//   0.170376718044281, 0.059432972222566605, 0.10432370752096176,
//   -0.02604673244059086, 0.0463872030377388, -0.11405826359987259,
//   -0.021960612386465073, -0.05156920850276947, -0.05933263152837753,
//   0.1507270783185959, 0.014971233904361725,
// ];

export default function Index() {
  const setUser = useAuthStore((state) => state.setUser);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    let isMounted = true;
    const versionCode = parseInt(DeviceInfo.getBuildNumber(), 10);

    const initializeApp = async () => {
      try {
        // 1. Check for Global Alerts FIRST
        const isAlertActive = await checkGlobalAlertStatus(versionCode);
        if (!isMounted) return;

        if (isAlertActive) {
          setTimeout(() => resetAndNavigate("/globalAlert/GlobalAlert"), 1000);

          return;
        }

        // 2. If no alert, proceed to check Auth Status
        const [_, accessToken] = await Promise.all([
          initializeAppConfigs(),
          SecureStore.getItemAsync("accessToken"),
        ]);

        if (accessToken) {
          const profile = await getMyProfile();

          if (profile) {
            setUser(profile);
            // refreshUser({ faceDescriptor: newDescriptor });  //this is for temporary testing
            const report = await getAppPermissionReport();

            if (report.allMandatoryGranted) {
              if (report.notifications) {
                const fcmToken = await getFcmToken();
                if (fcmToken) {
                  updateFcmTokenService(fcmToken);
                }
              }
              // Everything is perfect -> Go to Home
              resetAndNavigate("/(main)/screens/home");
            } else {
              // Missing mandatory setup -> Force Setup Screen
              resetAndNavigate("/(setup)/permissions");
            }
          } else {
            resetAndNavigate("/(auth)/login");
          }
        } else {
          resetAndNavigate("/(auth)/login");
        }
      } catch (error) {
        if (isMounted) {
          resetAndNavigate("/(auth)/login");
        }
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LinearGradient
      colors={["#2076C7", "#1CADA3"]}
      style={styles.mainContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar hidden />
      <SafeAreaView style={{ flex: 1, width: "100%" }} edges={["bottom"]}>
        <View style={styles.centerContent}>
          <View style={styles.glowContainer}>
            <GlossyLogo
              text="HRMS"
              imageSource={require("@/assets/images/ic_launcher_index.png")}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  glowContainer: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF8C69",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
});
