import { useRef, useState } from "react";
import { Modal, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Button } from "@/components/ui/Button";
import ButtonInput from "@/components/ui/Input/ButtonInput";
import ThemedText from "@/components/ui/ThemedText";

export type LocationInputProps = {
  value: BusinessForm["location"];
  onAddPress: () => void;
  onRemove: () => void;
  error?: string;
  required?: boolean;
};

export default function LocationInput({ value, onAddPress, onRemove, error, required }: LocationInputProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  return (
    <View className="gap-4">
      <ButtonInput
        label="Localisation"
        required={required}
        isFullFilled={!!value}
        onPress={value ? onRemove : onAddPress}
        buttonLabel="Ajouter"
        buttonIcon="addLocationAlt"
        error={error}
      />
      {value && (
        <Button
          className="self-end mr-8"
          iconLeft="location-on"
          variant="ghost"
          title="Voir la localisation"
          onPress={() => setIsModalVisible(true)}
        />
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-gy-gray-50">
          <View className="flex-row items-center justify-between px-6 pt-safe pb-4 bg-gy-white border-b border-gy-gray-200">
            <ThemedText format="settingsMenuTitle" color="black">Localisation enregistrée</ThemedText>
            <Button variant="ghost" title="Fermer" onPress={() => setIsModalVisible(false)} />
          </View>
          <View className="flex-1">
            {value && (
              <MapView
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: value.latitude,
                  longitude: value.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                userInterfaceStyle="light"
                showsUserLocation
                showsMyLocationButton={false}
              >
                <Marker coordinate={value} />
              </MapView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
