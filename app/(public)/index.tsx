import { Colors } from "@/constants/Colors";
import { useOAuth } from "@clerk/clerk-expo";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });

  const handleFacebookLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await googleAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/login.png")}
        style={styles.loginImage}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>How would you like to use Threads?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleFacebookLogin}
          >
            <View style={styles.loginButtonContent}>
              <Image
                source={require("@/assets/images/instagram_icon.webp")}
                style={styles.loginButtonImage}
              />
              <Text style={styles.loginButtonText}>
                Continue with Instagram
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              Log in or create a Threads profile with your Instagram account.
            </Text>
          </TouchableOpacity>

          {/* For tetstingh with a different account */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoogleLogin}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Continue with Google</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Use without a profile</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              You can browse Threads without a profile, but won't be able to
              post, interact or get personalised recommendations.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          // onPress={triggerError}
          >
            <Text style={styles.switchAccountButtonText}>Switch accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff9fe",
  },
  loginImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  title: {
    fontSize: 17,
    fontFamily: "DMSans_500Medium",
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButtonImage: {
    width: 40,
    height: 40,
  },
  loginButtonSubtitle: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: "#acacac",
    marginTop: 5,
  },
  switchAccountButtonText: {
    fontSize: 14,
    color: Colors.border,
    alignSelf: "center",
  },
});
