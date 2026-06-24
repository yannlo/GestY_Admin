import { useContext } from "react";
import {
  BottomSheetActionsContext,
  BottomSheetStateContext,
} from "@/contexts/BottomSheetContext";

export function useBottomSheetActions() {
  const ctx = useContext(BottomSheetActionsContext);
  if (!ctx) throw new Error("useBottomSheet doit être dans BottomSheetProvider");
  return ctx;
}

export function useBottomSheetState() {
  const ctx = useContext(BottomSheetStateContext);
  if (!ctx) throw new Error("useBottomSheet doit être dans BottomSheetProvider");
  return ctx;
}

// Hook combiné pour compatibilité (provoque un re-render si l'état ou les actions changent)
export function useBottomSheet() {
  return {
    ...useBottomSheetActions(),
    ...useBottomSheetState(),
  };
}