import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useFonts } from 'expo-font'
import * as Sentry from 'sentry-expo';

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: 'https://34013ae7757101d59b3151605aad236d@o4509257691299841.ingest.us.sentry.io/4509257692151808',
  enableInExpoDevelopment: true,
  debug: true, // optional, for verbose console logs
  sendDefaultPii: true,
});

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
export default Sentry.wrap(RootLayout);