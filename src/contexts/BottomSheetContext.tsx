import BottomSheetLayout from "@/components/ui/BottomSheet/BottomSheetLayout";
import { usePathname } from "expo-router";
import { createContext, useState, useRef, ReactNode, useCallback, useMemo, useEffect } from "react";
import { Animated, Pressable } from "react-native";

// Types
export type BottomSheetItem = {
  id: string;
  content: ReactNode;
  title?: string;
  onClose?: () => void;
  expanded?: boolean;
  bgEnabled?: boolean;
};

export type BottomSheetContextType = {
  open: (id: string, content: ReactNode, onClose: () => void, bgEnabled: boolean, title?: string) => void;
  close: (id: string) => void;
  closeAll: () => void;
  isExpanded: boolean;
  expand: () => void;
  collapsedHeight: number;
  setCollapsedHeight: (height: number) => void;
};

// Context
export const BottomSheetContext = createContext<BottomSheetContextType | null>(null);


type BottomSheetProviderProps = { children: ReactNode };


export function BottomSheetProvider({ children }: BottomSheetProviderProps) {
  const [items, setItems] = useState<BottomSheetItem[]>([]);
  const [closingIds, setClosingIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const closedIdsRef = useRef<Set<string>>(new Set());
  // Ref vers items pour accéder à la valeur courante sans recréer les callbacks
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  // Transition séquentielle sheet→sheet : le sheet sortant slide down avant l'arrivée du suivant
  const pendingItemRef = useRef<BottomSheetItem | null>(null);
  const [transitioningOutId, setTransitioningOutId] = useState<string | null>(null);
  // Backdrop unique partagé entre tous les sheets (évite le flash au remount)
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const open = useCallback((id: string, content: ReactNode, onClose?: () => void, bgEnabled: boolean = true, title?: string) => {
    closedIdsRef.current.delete(id);
    const current = itemsRef.current;
    const exists = current.some((item) => item.id === id);
    if (exists) {
      // Mise à jour en place (pas de transition)
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, content, onClose, bgEnabled, title } : item
        )
      );
      return;
    }
    setExpandedId(null);
    const newItem: BottomSheetItem = { id, content, onClose, bgEnabled, title };
    if (current.length > 0) {
      // Un sheet est déjà affiché : on le fait slide down, puis on ajoutera le nouveau
      pendingItemRef.current = newItem;
      setTransitioningOutId(current[current.length - 1].id);
    } else {
      setItems((prev) => [...prev, newItem]);
    }
  }, []);

  const confirmTransitionedOut = useCallback(() => {
    // Appelé par le Layout sortant après son slide down → on ajoute le sheet en attente
    const pending = pendingItemRef.current;
    pendingItemRef.current = null;
    setTransitioningOutId(null);
    if (pending) {
      setItems((prev) => [...prev, pending]);
    }
  }, []);

  const close = useCallback((id: string) => {
    const item = itemsRef.current.find((sheet) => sheet.id === id);
    if (item && !closedIdsRef.current.has(id)) {
      closedIdsRef.current.add(id);
      item.onClose?.();
      // Marquer comme en cours de fermeture (garde dans items pour l'animation)
      setClosingIds((prev) => new Set(prev).add(id));
    }
  }, []);

  const confirmClose = useCallback((id: string) => {
    // Appelé par Layout après l'animation de fermeture
    setClosingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setItems((prev) => prev.filter((sheet) => sheet.id !== id));
    closedIdsRef.current.delete(id);
  }, []);

  const closeAll = useCallback(() => {
    const current = itemsRef.current;
    if (current.length === 0) return;
    const last = current[current.length - 1];
    // Notifier tous les onClose (reset des states parents)
    current.forEach((item) => {
      if (!closedIdsRef.current.has(item.id)) {
        closedIdsRef.current.add(item.id);
        item.onClose?.();
      }
    });
    // Garder seulement le dernier pour l'animer (slide down)
    setItems([last]);
    setClosingIds((prev) => new Set(prev).add(last.id));
    setExpandedId(null);
  }, []);

  // Fermer tous les sheets ouverts lors d'une navigation vers une autre page
  const pathname = usePathname();
  useEffect(() => {
    if (itemsRef.current.length > 0) {
      closeAll();
    }
  }, [pathname, closeAll]);

  // Récupérer le dernier item (le plus récent)
  const active = items.length === 0 ? null : items[items.length - 1];
  const isExpanded = active != null && expandedId === active.id;

  const expand = useCallback(() => {
    if (active) {
      setExpandedId(active.id);
    }
  }, [active]);

  // Le backdrop est visible si le sheet actif le demande (bgEnabled !== false)
  const showBackdrop = active != null && active.bgEnabled !== false;
  useEffect(() => {
    Animated.timing(backdropOpacity, {
      toValue: showBackdrop ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showBackdrop, backdropOpacity]);

  const value = useMemo(
    () => ({
      open,
      close,
      closeAll,
      isExpanded,
      expand,
      collapsedHeight,
      setCollapsedHeight,
    }),
    [open, close, closeAll, isExpanded, expand, collapsedHeight, setCollapsedHeight]
  );
  
  return (
    <BottomSheetContext.Provider value={value}>
      {children}

      {/* Backdrop unique partagé, toujours monté pour permettre le fondu de sortie */}
      <Animated.View
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(4, 16, 6, 0.5)", opacity: backdropOpacity, zIndex: 5 }}
        pointerEvents={showBackdrop ? "auto" : "none"}
      >
        <Pressable className="absolute inset-0" onPress={closeAll} />
      </Animated.View>

      {/* Layout unique - affiche seulement l'actif */}
      {active && (
        <BottomSheetLayout
          key={active.id}
          sheetId={active.id}
          onBackdropPress={closeAll}
          onClosed={confirmClose}
          isClosing={closingIds.has(active.id)}
          isTransitioningOut={transitioningOutId === active.id}
          onTransitionedOut={confirmTransitionedOut}
          bgEnabled={active.bgEnabled}
          title={active.title}
          expanded={isExpanded}
          onCollapsedHeightChange={setCollapsedHeight}
        >
          {active.content}
        </BottomSheetLayout>
      )}
    </BottomSheetContext.Provider>
  );
}
