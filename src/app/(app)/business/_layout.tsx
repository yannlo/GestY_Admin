import { Stack } from "expo-router";
import DefaultHeader from "@/components/layouts/Header/DefaultHeader";



export default function () {
  return (
      <Stack screenOptions={{ header: (props) => <DefaultHeader {...props} /> }} >
        <Stack.Screen name="[id]" options={{ title: "Informations de l'entreprise" }} />
        <Stack.Screen name="add" options={{ headerShown: false }} />
      </Stack>
  );
}
