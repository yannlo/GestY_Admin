import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import DefaultHeader from "@/components/layout/header/DefaultHeader";


export default function () {
  return (
    <>
      <StatusBar backgroundColor="#effbf1" barStyle="dark-content" />
      <Stack screenOptions={{ header: (props) => <DefaultHeader {...props} /> }}>
        <Stack.Screen name="auth" options={{ title: "Paramètres de connexion" }} />
        <Stack.Screen name="setPassword" options={{ title: "Modifier le mot de passe" }} />
      </Stack>
    </>
  );
}