import { useEffect, useRef, useState } from "react";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";

export const useMyLocation = () => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  const handleUserLocationChange = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setUserLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.013,
      longitudeDelta: 0.013,
    });
  };

  const handleMyLocation = async () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(userLocation, 200);
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const region: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region, 400);
  };

  return {
    mapRef,
    handleUserLocationChange,
    handleMyLocation,
  };
};
