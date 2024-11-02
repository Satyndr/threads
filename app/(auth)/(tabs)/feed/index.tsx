import Thread from "@/components/Thread";
import ThreadComposer from "@/components/ThreadComposer";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";

const index = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    { initialNumItems: 5 }
  );
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation();
  // Create a shared value to store the scroll offset
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const updateTabbar = () => {
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }

    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { marginBottom: newMarginBottom } });
  };

  // Create an animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabbar)();
      }
    },
  });

  const onLoadmore = () => {
    loadMore(5);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        navigation
          .getParent()
          ?.setOptions({ tabBarStyle: { marginBottom: 0 } });
      };
    }, [])
  );

  return (
    <Animated.FlatList
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      data={results}
      renderItem={({ item }) =>
        results ? (
          <Link href={`/feed/${item._id}`} asChild>
            <TouchableOpacity>
              <Thread
                thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
              />
            </TouchableOpacity>
          </Link>
        ) : (
          <ActivityIndicator />
        )
      }
      onEndReached={onLoadmore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <View style={{ paddingBottom: 16 }}>
          <Image
            source={require("@/assets/images/threads-logo-black.png")}
            style={{ width: 40, height: 40, alignSelf: "center" }}
          />
          <ThreadComposer isPreview />
        </View>
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      contentContainerStyle={{ paddingVertical: top }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default index;

const styles = StyleSheet.create({});
