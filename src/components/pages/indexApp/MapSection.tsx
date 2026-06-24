import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import BusinessMarker from "./BusinessMarker";
import { ABIDJAN_REGION } from "@/constants/default";
import { MutableRefObject } from "react";

const MAP_ZOOM = 16;

type LatLng = { latitude: number; longitude: number };

const getCameraCenterAboveBottomSheet = (location: LatLng, collapsedHeight: number) => {
  const metersPerPixel = 156543.03392 * Math.cos(location.latitude * Math.PI / 180) / Math.pow(2, MAP_ZOOM);
  const degreesPerPixel = metersPerPixel / 111320;
  const offsetLatitude = collapsedHeight / 2 * degreesPerPixel;
  return {
    latitude: location.latitude - offsetLatitude,
    longitude: location.longitude
  };
};

type MapSectionProps = {
  mapRef: MutableRefObject<MapView | null>;
  businesses: Business[] | undefined;
  businessSelected: Business | null;
  collapsedHeight: number;
  onUserLocationChange: (event: any) => void;
  onSelectBusiness: (business: Business) => void;
};

const MapSection = React.memo(function MapSection({
    mapRef,
    businesses,
    businessSelected,
    collapsedHeight,
    onUserLocationChange,
    onSelectBusiness
   }: MapSectionProps) {
    React.useEffect(() => {
      if (!businessSelected || collapsedHeight === 0) return;
      const center = getCameraCenterAboveBottomSheet(businessSelected.location, collapsedHeight);
      mapRef.current?.animateCamera({
        center,
        zoom: MAP_ZOOM
      }, {
        duration: 500
      });
    }, [businessSelected, collapsedHeight, mapRef]);
    return <MapView ref={mapRef} style={{
        width: '100%',
        height: '100%'
      }} provider={PROVIDER_GOOGLE} initialRegion={ABIDJAN_REGION} userInterfaceStyle="light" showsUserLocation showsMyLocationButton={false} onUserLocationChange={onUserLocationChange}>{businesses?.map(business => <BusinessMarker key={business.id} business={business} isSelected={businessSelected?.id === business.id} onSelect={onSelectBusiness} />)}</MapView>;
  });
export default MapSection;
