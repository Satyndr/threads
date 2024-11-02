import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { UserProfile } from "@/components/UserProfile";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import Thread from "./Thread";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type ProfileProps = {
  userId?: Id<"users">;
  showBackButton?: boolean;
};

const Profile = ({ userId, showBackButton = false }: ProfileProps) => {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Threads");
  const { userProfile } = useUserProfile();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId || userProfile?._id },
    { initialNumItems: 10 }
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          // <Link href={`/feed/${item._id}`} asChild>
          // <TouchableOpacity>
          <Thread
            thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
          />
          // </TouchableOpacity>
          // </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven't posted anything yet.
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={24} color="#000" />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              ) : (
                // <MaterialCommunityIcons name="web" size={24} color="black" />
                <>
                  <View></View>
                </>
              )}

              {!showBackButton && (
                <View style={styles.headerIcons}>
                  <Ionicons name="logo-instagram" size={24} color="black" />
                  <TouchableOpacity onPress={() => signOut()}>
                    <Ionicons name="log-out-outline" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile && (
              <UserProfile userId={userProfile?._id} />
            )}

            <Tabs onTabChange={handleTabChange} />
          </>
        }
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  tabContentText: {
    fontSize: 16,
    marginVertical: 16,
    color: Colors.border,
    alignSelf: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
});
