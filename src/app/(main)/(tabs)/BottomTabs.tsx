import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../screens/home";
import ProfileScreen from "../screens/profile";
import { colors, FONTS } from "@/constants/theme";
import { moderateScale } from "react-native-size-matters";
import GradientIcon from "@/components/icons/GradientIcon";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Base_Background }}
      edges={["bottom"]}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          // When focused, we handle the color via GradientIcon,
          // so we set this to transparent or a matching green
          tabBarActiveTintColor: colors.Brand_Green,
          tabBarInactiveTintColor: "rgba(0,0,0,0.4)",
          tabBarStyle: {
            height: moderateScale(60),
            paddingBottom: moderateScale(10),
            backgroundColor: "#fff",
            borderTopLeftRadius: moderateScale(24),
            borderTopRightRadius: moderateScale(24),
            // Elevated shadow for 'Rich' look
            elevation: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            borderTopWidth: 0,
            position: "absolute",
          },
          tabBarLabelStyle: {
            fontSize: moderateScale(11),
            fontFamily: FONTS.bold, // Switched to your defined fonts
            // marginTop: moderateScale(-4),
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <GradientIcon
                  IconComponent={Ionicons}
                  name="home"
                  size={moderateScale(25)}
                />
              ) : (
                <Ionicons
                  size={moderateScale(24)}
                  name="home-outline"
                  color={color}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <GradientIcon
                  IconComponent={FontAwesome}
                  name="user"
                  size={moderateScale(26)}
                />
              ) : (
                <FontAwesome
                  size={moderateScale(25)}
                  name="user-o"
                  color={color}
                />
              ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTabs;
