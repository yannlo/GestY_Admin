import React from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import Icon from "@/components/ui/Icon";

const getMarkerColor = (status: any) => {
    switch (status) {
      case "active":
        return "#0aa81d";
      case "suspended":
        return "#f2ba00";
      case "inactive":
        return "#2c3b31";
    }
  };
  const BusinessMarker = React.memo(function BusinessMarker({
    business,
    isSelected,
    onSelect,
  }: {
    business: Business;
    isSelected: boolean;
    onSelect: (b: Business) => void;
  }) {
    const handlePress = React.useCallback((e: any) => {
      e.preventDefault();
      onSelect(business);
    }, [business, onSelect]);
    return <Marker key={business.id} coordinate={business.location} onPress={handlePress}>{isSelected ? <View><Icon name="location-on" color={getMarkerColor(business.status)} className="size-12" fill /></View> : <View style={{
          width: 18,
          height: 18,
          borderRadius: 8,
          backgroundColor: getMarkerColor(business.status),
          borderWidth: 2,
          borderColor: "white"
        }} />}</Marker>;
  });
export default BusinessMarker;
