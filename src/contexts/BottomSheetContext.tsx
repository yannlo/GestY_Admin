import BottomSheetLayout from "@/components/ui/BottomSheet/BottomSheetLayout";
import { createContext, useState, useCallback, useRef, ReactNode } from "react";

// Types
export type BottomSheetItem = {
  id: string;
  content: ReactNode;
  onClose?: () => void;
  expanded?: boolean;
  bgEnabled?: boolean;
};

export type BottomSheetContextType = {
  open: (id: string, content: ReactNode, onClose: () => void, bgEnabled:boolean ) => void;
  close: (id: string) => void;
  closeAll: () => void;
  setExpanded: (id: string, expanded: boolean) => void;
  isExpanded: (id: string) => boolean;
};

// Context
export const BottomSheetContext = createContext<BottomSheetContextType | null>(null);


type BottomSheetProviderProps = { children: ReactNode };


export function BottomSheetProvider({ children }: BottomSheetProviderProps) {
  const [items, setItems] = useState<BottomSheetItem[]>([]);
  const closedIdsRef = useRef<Set<string>>(new Set());

  // Ouvrir ou mettre à jour un bottom sheet
  const open = useCallback((id: string, content: ReactNode, onClose?: () => void, bgEnabled: boolean = true) => {
    closedIdsRef.current.delete(id);
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex >= 0) {
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, content, onClose, bgEnabled } : item
        );
      }
      return [...prev, { id, content, onClose, bgEnabled }];
    });
  }, []);

  const close = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((sheet) => sheet.id === id);
      if (item && !closedIdsRef.current.has(id)) {
        closedIdsRef.current.add(id);
        queueMicrotask(() => item.onClose?.());
      }
      return prev.filter((sheet) => sheet.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    items.forEach((item) => {
      if (!closedIdsRef.current.has(item.id)) {
        closedIdsRef.current.add(item.id);
        queueMicrotask(() => item.onClose?.());
      }
    });
    setItems([]);
  }, [items]);

  // Récupérer le dernier item (le plus récent)
  const activeItem = useCallback(() => {
    if (items.length === 0) return null;
    return items[items.length - 1];
  }, [items]);

  const active = activeItem();

  const setExpanded = useCallback((id: string, expanded: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expanded } : item))
    );
  }, []);

  const isExpanded = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    return item?.expanded ?? false;
  }, [items]);

  const value = {
    open,
    close,
    closeAll,
    setExpanded,
    isExpanded,
  };

  return (
    <BottomSheetContext.Provider value={value}>
      {children}

      {/* Layout unique - affiche seulement l'actif */}
      {active && (
        <BottomSheetLayout
          onClose={closeAll}
          expanded={active.expanded}
          onExpandedChange={(expanded) => setExpanded(active.id, expanded)}
          bgEnabled={active.bgEnabled}
        >
          {active.content}
        </BottomSheetLayout>
      )}
    </BottomSheetContext.Provider>
  );
}
