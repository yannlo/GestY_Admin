import { useContext} from "react";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";

// Hook pour accès impératif au contexte
export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (!context) throw new Error("useBottomSheet doit être dans BottomSheetProvider");
  return context;
}
