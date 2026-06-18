import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import DefaultHeader from "@/components/layouts/header/DefaultHeader";
import ProfileHeader from "@/components/layouts/header/ProfileHeader";


export default function () {
  return (
    <>
      <StatusBar backgroundColor="#effbf1" barStyle="dark-content" />
      <Stack screenOptions={{ header: (props) => <DefaultHeader {...props} /> }}>
        <Stack.Screen name="index" options={{ header: () => <ProfileHeader /> }} />
        <Stack.Screen name="edit" options={{ title: "Mon profil" }} />
      </Stack>
    </>
  );
}