import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          contentStyle: { backgroundColor: "#fff" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
