import { Platform, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { IconButton } from "@/components/ui/Button";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useMyLocation } from "@/hooks/useMyLocation";
import { router } from "expo-router";


const ABIDJAN_REGION: Region = {
  latitude: 5.36,
  longitude: -4.0083,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

export default function App() {
  const { mapRef, handleUserLocationChange, handleMyLocation } = useMyLocation();
  const isKeyboardVisibled = useKeyboardVisible();

  return (
    <View className="flex-1 items-center justify-center bg-gy-gray-50 pb-safe">
      <MapView
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        provider={PROVIDER_GOOGLE}
        initialRegion={ABIDJAN_REGION}
        userInterfaceStyle="light"
        showsUserLocation
        showsMyLocationButton={false}
        onUserLocationChange={handleUserLocationChange}
      />
      <View className="absolute top-0 bottom-0 justify-between items-end right-7 mb-safe pt-7 pb-16">
        <IconButton variant="outline" name="search" size="sm" onPress={() => { }} />

        <KeyboardStickyView
          className={`${isKeyboardVisibled ? "pb-4" : ""}`}
          offset={{ closed: 0, opened: Platform.OS === "ios" ? 16 : 0 }}
          
        >
        <View className="items-center justify-center gap-6">
          <IconButton variant="outline" name="myLocation" size="sm" onPress={handleMyLocation} />
          <IconButton name="add" size="lg" onPress={() => {router.push("/business/add") }} />
        </View>


        </KeyboardStickyView>
      </View>



    </View>
  );
}