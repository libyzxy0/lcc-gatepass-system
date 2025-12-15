import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/utils/auth-store";
import { useColors } from "@/hooks/useColors";
import * as SystemUI from "expo-system-ui";
import { Toast } from "@/components";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
    NunitoMedium: require("../assets/fonts/Nunito-Medium.ttf"),
    NunitoItalic: require("../assets/fonts/Nunito-Italic.ttf"),
    NunitoSemiBold: require("../assets/fonts/Nunito-SemiBold.ttf"),
    NunitoBold: require("../assets/fonts/Nunito-Bold.ttf"),
    ...Ionicons.font
  });

  SystemUI.setBackgroundColorAsync(useColors().background);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, phoneNumber, getSession, visitor, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const retrieveSession = async () => {
      try {
        await getSession();
        if (visitor === null) {
          await logout();
          router.push('/phone');
        }
      } catch (error) {
        router.push('/phone');
        console.error(error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    retrieveSession();
  }, [])

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <SafeAreaProvider>
        <Stack>
          <Stack.Protected guard={isLoggedIn}>

            <Stack.Protected guard={!visitor?.activated}>
              <Stack.Screen
                name="otp"
                options={{
                  headerShown: false,
                  animation: "fade"
                }}
              />
            </Stack.Protected>
            <Stack.Protected guard={visitor?.activated}>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  animation: "fade"
                }}
              />
            </Stack.Protected>
          </Stack.Protected>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Protected guard={phoneNumber}>
              <Stack.Screen
                name="pin"
                options={{
                  headerShown: false,
                  animation: "fade"
                }}
              />

            </Stack.Protected>
            <Stack.Protected guard={!phoneNumber}>
              <Stack.Screen
                name="phone"
                options={{
                  headerShown: false,
                  animation: "fade"
                }}
              />
            </Stack.Protected>

            <Stack.Screen
              name="new/[phonenum]"
              options={{
                headerShown: false,
                animation: "fade"
              }}
            />
          </Stack.Protected>

        </Stack>
        <Toast />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
