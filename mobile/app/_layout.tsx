import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/utils/auth-store";
import { useColors } from "@/hooks/useColors";
import * as SystemUI from "expo-system-ui";
import { Toast } from "@/components";
import { checkNumber } from "@/api/helper/check-num";
import { normalize } from "@/utils/format-ph-number";
import SplashLoading from '@/components/SplashLoading'

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
    NunitoMedium: require("../assets/fonts/Nunito-Medium.ttf"),
    NunitoItalic: require("../assets/fonts/Nunito-Italic.ttf"),
    NunitoSemiBold: require("../assets/fonts/Nunito-SemiBold.ttf"),
    NunitoBold: require("../assets/fonts/Nunito-Bold.ttf"),
    ...Ionicons.font,
  });

  SystemUI.setBackgroundColorAsync(useColors().background);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {
    isLoggedIn,
    getSession,
    visitor,
    logout,
    phoneNumber
  } = useAuthStore();

  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await getSession();
        if (visitor === null) {
          await logout();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSessionReady(true);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn && visitor?.activated === false) {
      router.replace('/otp');
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (sessionReady) {
      SplashScreen.hideAsync();
    }
  }, [sessionReady]);

  if (!sessionReady) {
    return <SplashLoading />
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <SafeAreaProvider>
        <Stack>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="otp"
              options={{ headerShown: false, animation: "fade" }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Protected guard={!!phoneNumber}>
              <Stack.Screen
                name="pin"
                options={{ headerShown: false, animation: "fade" }}
              />
            </Stack.Protected>

            <Stack.Protected guard={!phoneNumber}>
              <Stack.Screen
                name="phone"
                options={{ headerShown: false, animation: "fade" }}
              />
            </Stack.Protected>

            <Stack.Screen
              name="new/[phonenum]"
              options={{ headerShown: false, animation: "fade" }}
            />
          </Stack.Protected>
        </Stack>

        <Toast />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
