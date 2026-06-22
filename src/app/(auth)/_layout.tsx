import DefaultHeader from "@/components/layouts/Header/DefaultHeader";
import { Stack } from "expo-router";

export default function () {
  return <Stack screenOptions={{ header: (props) => <DefaultHeader {...props} /> }}>
    <Stack.Screen name="login" options={{ headerShown: false }} />
    <Stack.Screen name="forgetPassword" options={{ title: "Mot de passe oublié" }} />
  </Stack>;
}
