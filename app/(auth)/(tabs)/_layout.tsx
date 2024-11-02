import { Colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

const CreateTabIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={styles.createIconContainer}>
    <Ionicons name="add" size={size} color={color} />
  </View>
);

const Layout = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <CreateTabIcon color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.selectionAsync();
            router.push("/(modal)/create");
          },
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;

const styles = StyleSheet.create({
  logoutText: {
    marginRight: 10,
    color: "blue",
  },
  createIconContainer: {
    backgroundColor: Colors.itemBackground,
    borderRadius: 8,
    padding: 6,
  },
});
