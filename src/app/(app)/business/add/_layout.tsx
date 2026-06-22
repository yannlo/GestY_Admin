import { Stack } from "expo-router";
import DefaultHeader from "@/components/layouts/Header/DefaultHeader";
import { FormDataProvider } from "@/contexts/FormDataContext";
import { DEFAULT_BUSINESS } from "@/constants/default";



export default function () {
  return (
    <FormDataProvider defaultValue={DEFAULT_BUSINESS}>
      <Stack screenOptions={{ header: (props) => <DefaultHeader {...props} /> }} >
        <Stack.Screen name="index" options={{ title: "Ajout d'une entreprise" }} />
        <Stack.Screen name="map" options={{ title: "Ajouter la localisation" }} />
        <Stack.Screen name="account" options={{ title: "Ajout de compte" }} />
      </Stack>
    </FormDataProvider>
  );
}
