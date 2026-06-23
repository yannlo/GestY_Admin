import { Platform, View } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useQuery } from "@tanstack/react-query";
import { IconButton } from "@/components/ui/Button";
import { listBusinesses } from "@/services/businessApi";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useMyLocation } from "@/hooks/useMyLocation";
import { router } from "expo-router";
import BusinessBottomSheet from "@/components/ui/BottomSheet/BusinessBottomSheet";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ABIDJAN_REGION } from "@/constants/default";
import BottomSheetStickyView from "@/components/ui/BottomSheet/BottomSheetStickyView";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import Icon from "@/components/ui/Icon";




const MAP_ZOOM = 16;

const getCameraCenterAboveBottomSheet = (location: LatLng, collapsedHeight: number): LatLng => {
  const metersPerPixel = (156543.03392 * Math.cos(location.latitude * Math.PI / 180)) / Math.pow(2, MAP_ZOOM);
  const degreesPerPixel = metersPerPixel / 111320;
  const offsetLatitude = (collapsedHeight / 2) * degreesPerPixel;
  return {
    latitude: location.latitude - offsetLatitude,
    longitude: location.longitude,
  };
};

export default function App() {

  const [businessSelected, setBusinessSelected] = useState<Business | null>(null);
  const pendingBusinessRef = useRef<Business | null>(null);
  const { businessId } = useLocalSearchParams<{ businessId?: string }>();
  const { closeAll, collapsedHeight } = useBottomSheet();
  const { mapRef, handleUserLocationChange, handleMyLocation } = useMyLocation({ showMyLocationByDefault: false });
  const isKeyboardVisibled = useKeyboardVisible();
  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: listBusinesses,
  });

  useEffect(() => {
    if (!businessId || !businesses) return;
    const found = businesses.find((b) => b.id === businessId);
    if (!found) return;
    setBusinessSelected(found);
  }, [businessId, businesses]);

  useEffect(() => {
    if (!businessSelected || collapsedHeight === 0) return;
    const center = getCameraCenterAboveBottomSheet(businessSelected.location, collapsedHeight);
    mapRef.current?.animateCamera({ center, zoom: MAP_ZOOM }, { duration: 500 });
  }, [businessSelected, collapsedHeight, mapRef]);

  const getMarkerColor = (status: Business["status"]) => {
    switch (status) {
      case "active": return "#0aa81d";
      case "suspended": return "#f2ba00";
      case "inactive": return "#2c3b31";
    }
  };

  const handleBottomSheetClose = () => {
    setBusinessSelected(null);
  };

  useEffect(() => {
    if (collapsedHeight === 0 && pendingBusinessRef.current) {
      const next = pendingBusinessRef.current;
      pendingBusinessRef.current = null;
      setBusinessSelected(next);
    }
  }, [collapsedHeight]);


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
      >
        {businesses?.map((business) => (
          <Marker
            key={business.id}
            coordinate={business.location}
            onPress={(e) => {
              e.preventDefault();
              if (business.id === businessSelected?.id) return;
              if (businessSelected) {
                pendingBusinessRef.current = business;
                closeAll();
              } else {
                setBusinessSelected(business);
              }
            }}
          >
            {businessSelected?.id === business.id ?
              <View >
                <Icon name="location-on" color={getMarkerColor(business.status)} className="size-12" fill />
              </View>
              :
              <View style={{ width: 18, height: 18, borderRadius: 8, backgroundColor: getMarkerColor(business.status), borderWidth: 2, borderColor: "white" }} />
            }
          </Marker>
        ))}
      </MapView>
      <View className="absolute top-0 bottom-0 justify-between items-end right-7 mb-safe pt-7 pb-20">
        <IconButton variant="outline" name="search" size="sm" onPress={() => { }} />

        <BottomSheetStickyView offset={{ open: -64, closed: 0 }}>
          <KeyboardStickyView
            className={`${isKeyboardVisibled ? "pb-4" : ""}`}
            offset={{ closed: 0, opened: Platform.OS === "ios" ? 16 : 0 }}

          >
            <View className="items-center justify-center gap-6">
              <IconButton variant="outline" name="myLocation" size="sm" onPress={handleMyLocation} />
              <IconButton name="add" size="lg" onPress={() => { router.push("/business/add") }} />
            </View>


          </KeyboardStickyView>
        </BottomSheetStickyView>
      </View>

      {businesses?.map((business) => (
        <BusinessBottomSheet
          key={business.id}
          visible={businessSelected?.id === business.id}
          onClose={handleBottomSheetClose}
          business={business}
          onPress={() => {
            router.push(`/business/${business.id}`)
          }}
        />
      ))}

    </View>
  );
}