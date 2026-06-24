import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { listBusinesses } from "@/services/businessApi";
import { useMyLocation } from "@/hooks/useMyLocation";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useBottomSheetActions, useBottomSheetState } from "@/hooks/useBottomSheet";
import MapSection from "@/components/pages/indexApp/MapSection";
import OverlayControls from "@/components/pages/indexApp/OverlayControls";
import BottomSheets from "@/components/pages/indexApp/BottomSheets";

export default function App() {
  const [businessSelected, setBusinessSelected] = useState<Business | null>(null);
  const businessSelectedRef = useRef(businessSelected);
  businessSelectedRef.current = businessSelected;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [search, setSearch] = useState("");
  const pendingBusinessRef = useRef<Business | null>(null);
  const isSelectingSearchRef = useRef(false);
  const isReturningToSearchRef = useRef(false);

  const { businessId } = useLocalSearchParams<{ businessId?: string }>();
  const { closeAll } = useBottomSheetActions();
  const { collapsedHeight } = useBottomSheetState();
  const { mapRef, handleUserLocationChange, handleMyLocation } = useMyLocation({ showMyLocationByDefault: false });
  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: listBusinesses,
  });

  const normalizedSearch = search.trim().toLowerCase();
  const results = useMemo<Business[] | null>(() => {
    if (!normalizedSearch) return businesses ?? null;
    return businesses?.filter(({ name }) => name.toLowerCase().includes(normalizedSearch)) ?? null;
  }, [normalizedSearch, businesses]);

  useEffect(() => {
    if (!businessId || !businesses) return;
    const found = businesses.find((b) => b.id === businessId);
    if (!found) return;
    setBusinessSelected(found);
  }, [businessId, businesses]);

  const handleBottomSheetClose = useCallback(() => {
    if (!isReturningToSearchRef.current) {
      setSearch('');
    }
    isReturningToSearchRef.current = false;
    setBusinessSelected(null);
  }, []);

  const handleBusinessPress = useCallback(() => {
    if (businessSelected) {
      router.push(`/business/${businessSelected.id}`);
    }
  }, [businessSelected]);

  const handleSelectBusiness = (business: Business) => {
    setIsSearchVisible(false);
    if (business.id === businessSelectedRef.current?.id) return;
    if (businessSelectedRef.current) {
      pendingBusinessRef.current = business;
      closeAll();
    } else {
      setBusinessSelected(business);
    }
  };

  const handleSearchClose = () => {
    if (isSelectingSearchRef.current) {
      isSelectingSearchRef.current = false;
      return;
    }
    setSearch('');
    setIsSearchVisible(false);
  };

  const handleSearchSelect = (business: Business) => {
    isSelectingSearchRef.current = true;
    setIsSearchVisible(false);
    setBusinessSelected(business);
  };

  const isSearchedNextAvailable = () => {
    if (!businessSelected || search.length === 0 || !results) return false;
    const index = results.findIndex((b) => b.id === businessSelected.id);
    if (index < 0) return false;
    return index < results.length - 1;
  };

  const getSearchedNext = () => {
    if (!isSearchedNextAvailable() || !results || !businessSelected) return;
    const index = results.findIndex((b) => b.id === businessSelected.id);
    setBusinessSelected(results[index + 1]);
  };

  const isSearchedPreviousAvailable = () => {
    if (!businessSelected || search.length === 0 || !results) return false;
    const index = results.findIndex((b) => b.id === businessSelected.id);
    return index > 0;
  };

  const getSearchedPrevious = () => {
    if (!isSearchedPreviousAvailable() || !results || !businessSelected) return;
    const index = results.findIndex((b) => b.id === businessSelected.id);
    setBusinessSelected(results[index - 1]);
  };

  useEffect(() => {
    if (collapsedHeight === 0 && pendingBusinessRef.current) {
      const next = pendingBusinessRef.current;
      pendingBusinessRef.current = null;
      setBusinessSelected(next);
    }
  }, [collapsedHeight]);

  const toggleSearchVisible = () => {
    if (!isSearchVisible && search.length > 0 && businessSelected) {
      isReturningToSearchRef.current = true;
    }
    setBusinessSelected(null);
    if (isSearchVisible) setSearch('');
    setIsSearchVisible((prev) => !prev);
  };

  const searchIconName = isSearchVisible ? "close" : search.length > 0 ? "undo" : "search";

  return (
    <View className="flex-1 items-center justify-center bg-gy-gray-50 pb-safe">
      <MapSection
        mapRef={mapRef}
        businesses={businesses}
        businessSelected={businessSelected}
        collapsedHeight={collapsedHeight}
        onUserLocationChange={handleUserLocationChange}
        onSelectBusiness={handleSelectBusiness}
      />
      <OverlayControls
        searchIconName={searchIconName}
        isSearchVisible={isSearchVisible}
        search={search}
        businessSelected={businessSelected}
        onToggleSearch={toggleSearchVisible}
        onMyLocation={handleMyLocation}
        onPrevious={getSearchedPrevious}
        onNext={getSearchedNext}
        isPreviousAvailable={isSearchedPreviousAvailable}
        isNextAvailable={isSearchedNextAvailable}
      />
      <BottomSheets
        businessSelected={businessSelected}
        search={search}
        setSearch={setSearch}
        results={results}
        isSearchVisible={isSearchVisible}
        onBusinessClose={handleBottomSheetClose}
        onBusinessPress={handleBusinessPress}
        onSearchClose={handleSearchClose}
        onSearchSelect={handleSearchSelect}
      />
    </View>
  );
}