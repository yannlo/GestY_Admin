import React from "react";
import BusinessBottomSheet from "@/components/ui/BottomSheet/BusinessBottomSheet";
import SearchBottomSheet from "@/components/ui/BottomSheet/SearchBottomSheet";

interface Props {
  businessSelected: Business | null;
  search: string;
  setSearch: (s: string) => void;
  results: Business[] | null;
  isSearchVisible: boolean;
  onBusinessClose: () => void;
  onBusinessPress: () => void;
  onSearchClose: () => void;
  onSearchSelect: (b: Business) => void;
}

const BottomSheets = React.memo(function BottomSheets({
  businessSelected,
  search,
  setSearch,
  results,
  isSearchVisible,
  onBusinessClose,
  onBusinessPress,
  onSearchClose,
  onSearchSelect,
}: Props) {
  return (
    <>
      {businessSelected && (
        <BusinessBottomSheet
          business={businessSelected}
          visible
          onClose={onBusinessClose}
          onPress={onBusinessPress}
        />
      )}
      {results && isSearchVisible && (
        <SearchBottomSheet
          search={search}
          setSearch={setSearch}
          businesses={results}
          visible
          onClose={onSearchClose}
          onSelect={onSearchSelect}
        />
      )}
    </>
  );
});

export default BottomSheets;
