import { useEffect, useRef, useState } from "react";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";

type UseMyLocationOptions = {
  defaultRegion?: Region;
};

export const useMyLocation = (options?: UseMyLocationOptions) => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) return;
      try {
        const location = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;
        const region: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setUserLocation(region);
        mapRef.current?.animateToRegion(region, 500);
      } catch {
        // Permission denied or location unavailable: keep default
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleUserLocationChange = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setUserLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const handleMyLocation = async () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(userLocation, 500);
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const region: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    mapRef.current?.animateToRegion(region, 1000);
  };

  const myLocationRegion = userLocation ?? options?.defaultRegion ?? null;

  return {
    mapRef,
    myLocationRegion,
    handleUserLocationChange,
    handleMyLocation,
  };
};
