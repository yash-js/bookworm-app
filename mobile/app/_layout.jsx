import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useFonts } from 'expo-font'
import * as Updates from 'expo-updates';

SplashScreen.preventAutoHideAsync();


function RootLayout() {
  const router = useRouter()
  const segments = useSegments()

  const { checkAuth, user, token } = useAuthStore()

  const [loaded, error] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])
  useEffect(() => {
    const checkForUpdate = async () => {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); // Reloads app with new update
      }
    };
    checkForUpdate();
    checkAuth()
  }, [])

  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;
    if (!inAuthScreen && !isSignedIn) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)")
    }

  }, [user, token, segments])


  return <SafeAreaProvider>
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </SafeScreen>
    <StatusBar style="dark" />
  </SafeAreaProvider>
}
export default RootLayout