import {
  Slot,
  SplashScreen,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { LogBox } from "react-native";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as Sentry from "@sentry/react-native";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

LogBox.ignoreLogs(["Clerk has been loaded with development keys"]);

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const routingInstrumentation = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    // new Sentry.ReactNativeTracing({
    //   routingInstrumentation,
    //   enableNativeFramesTracking: true,
    // }),
    Sentry.mobileReplayIntegration(),
  ],
});

const InititalLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/feed");
    } else if (!isSignedIn && inAuthGroup) {
      router.replace("/(public)");
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (user && user.user) {
      Sentry.setUser({
        email: user.user.emailAddresses[0].emailAddress,
        id: user.user.id,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  return <Slot />;
};

const RootLayout = () => {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InititalLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default Sentry.wrap(RootLayout);
