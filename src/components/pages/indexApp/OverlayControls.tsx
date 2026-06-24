import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Button, IconButton } from "@/components/ui/Button";
import BottomSheetStickyView from "@/components/ui/BottomSheet/BottomSheetStickyView";

type OverlayControlsProps = {
  searchIconName: string;
  isSearchVisible: boolean;
  search: string;
  businessSelected: Business | null;
  onToggleSearch: () => void;
  onMyLocation: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isPreviousAvailable: () => boolean;
  isNextAvailable: () => boolean;
};

const OverlayControls = React.memo(function OverlayControls({
  searchIconName,
  isSearchVisible,
  search,
  businessSelected,
  onToggleSearch,
  onMyLocation,
  onPrevious,
  onNext,
  isPreviousAvailable,
  isNextAvailable
}: OverlayControlsProps) {
  const showSearchNavigation = !isSearchVisible && search.length > 0 && businessSelected;
  return <View className="absolute top-0 bottom-0 items-end left-7 right-7 mb-safe pt-7 pb-20 justify-between">
    <IconButton variant="outline" name={searchIconName} size="sm" onPress={onToggleSearch} />
    <BottomSheetStickyView offset={{
      open: -60,
      closed: 0
    }}>
      <View className="justify-end items-end gap-6">
        <View className="items-center justify-center gap-6">
          <IconButton variant="outline" name="myLocation" size="sm" onPress={onMyLocation} />
          {!showSearchNavigation && (
            <IconButton name="add" size="lg" onPress={() => { router.push("/business/add"); }} />
          )}
        </View>
        {showSearchNavigation && (
          <View className="w-full flex-row justify-between">
            <Button title="Precedant" variant="outline" iconLeft="ArrowBack" disabled={!isPreviousAvailable()} onPress={onPrevious} />
            <Button title="suivant" variant="outline" iconRight="ArrowForward" disabled={!isNextAvailable()} onPress={onNext} />
          </View>
        )}
      </View>
    </BottomSheetStickyView>
  </View>;
});
export default OverlayControls;
