import "@/app/global.css"
import { View } from "react-native";
import { Button, IconButton } from "@/components/ui/Button";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useMyLocation } from "@/hooks/useMyLocation";
import LayoutWithBottomButtonBase from "@/components/layouts/Layout/LayoutWithBottomButtonBase";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import ThemedText from "@/components/ui/ThemedText";
import { useFormData } from "@/contexts/FormDataContext";
import { router } from "expo-router";
import { ABIDJAN_REGION } from "@/constants/default";

function getRegionCenter(region: Region): LatLng {
  return {
    latitude: region.latitude,
    longitude: region.longitude,
  };
}

export default function () {
  const { setFormData } = useFormData<BusinessForm>();
  const { mapRef, handleUserLocationChange, handleMyLocation } = useMyLocation({ defaultRegion: ABIDJAN_REGION });
  const [coordinate, setCoordinate] = useState<LatLng>(getRegionCenter(ABIDJAN_REGION));


  useEffect(() => {
    handleMyLocation();
  }, []);

  const RegistredLocation = () => {
    setFormData((prev) => {
      return {
        ...prev,
        location: coordinate,
      };
    });
    router.back()
  }

  return (
    <LayoutWithBottomButtonBase buttons={[
      <Button key="save" title="Enregistrer" fullWidth onPress={RegistredLocation} />
    ]}>
      <View className="flex-1 items-center justify-center bg-gy-gray-50">
        <MapView
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          provider={PROVIDER_GOOGLE}
          initialRegion={ABIDJAN_REGION}
          userInterfaceStyle="light"
          showsUserLocation
          showsMyLocationButton={false}
          onUserLocationChange={handleUserLocationChange}
          onRegionChangeComplete={
            (region) => setCoordinate(getRegionCenter(region))}
        />
        <View className="absolute inset-0 pointer-events-none items-center justify-center">
          <View style={{ transform: [{ translateY: -18 }] }}>
            <Icon name="location-on" className="text-gy-primary-500 size-12" fill />
          </View>
        </View>

        <View className="absolute bottom-0 right-10 mb-safe pb-10 gap-4 items-end">
          <IconButton variant="outline" name="myLocation" size="md" onPress={handleMyLocation} />
        </View>
      </View>
    </LayoutWithBottomButtonBase>
  );
}

