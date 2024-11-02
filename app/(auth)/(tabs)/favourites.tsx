import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

const activityList = ["All", "Replies", "Mentions", "Verified"];

const favourites = () => {
  const [active, setActive] = useState("All");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Stack.Screen
        options={{
          title: "Activity",
          headerTitle: (props) => (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                paddingTop: 10,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {props.children}
              </Text>
            </View>
          ),
          headerShadowVisible: false,
        }}
      />

      <View>
        <FlatList
          data={activityList}
          horizontal
          style={{ padding: 10 }}
          renderItem={({ item }) =>
            active === item ? (
              <TouchableOpacity onPress={() => setActive(item)}>
                <View style={styles.activeBox}>
                  <Text style={styles.activeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setActive(item)}>
                <View style={styles.box}>
                  <Text style={styles.text}>{item}</Text>
                </View>
              </TouchableOpacity>
            )
          }
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center", color: Colors.border }}>
          No Recent Activity
        </Text>
      </View>
    </View>
  );
};

export default favourites;

const styles = StyleSheet.create({
  activeBox: {
    backgroundColor: "#000",
    width: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  activeText: {
    textAlign: "center",
    color: "#fff",
    padding: 9,
    fontSize: 15,
  },
  box: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    width: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  text: {
    textAlign: "center",
    color: "#000",
    padding: 9,
    fontSize: 15,
  },
});
