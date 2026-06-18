import "@/app/global.css";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import ThemedText from "../ThemedText";
import { useBottomSheet } from "@/hooks/useBottomSheet";


export type BottomSheetBaseProps = {
  visible: boolean;
  bgVisible?:boolean
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

// BottomSheet déclaratif - le dernier ouvert remplace le précédent
export default function BottomSheetBase({
  visible,
  bgVisible = true,
  onClose,
  title,
  children,
}: BottomSheetBaseProps) {

  const generatedId = useId();
  const { open, close, isExpanded } = useBottomSheet();
  const isOpenRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  // Mettre à jour le scroll quand expanded change
  useEffect(() => {
    const expanded = isExpanded(generatedId);
    setScrollEnabled(expanded);
    if (!expanded) {
      // Reset scroll to top when collapsed
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isExpanded, generatedId]);


  const renderContent = useCallback(() => (
    <View className="flex-1 px-4 pb-6">
      {title && (
        <View className="py-3 items-center">
          <ThemedText format="settingsMenuTitle" color="black">
            {title}
          </ThemedText>
        </View>
      )}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        scrollEnabled={scrollEnabled}
        bounces={false}
        overScrollMode="never"
      >
        {children}
      </ScrollView>
    </View>
  ), [title, children, scrollEnabled]);

  useEffect(() => {
    if (visible) {
      if (!isOpenRef.current) {
        isOpenRef.current = true;
      }
      open(generatedId, renderContent(), onClose, bgVisible);
    } else if (isOpenRef.current) {
      isOpenRef.current = false;
      close(generatedId);
    }
  }, [visible, renderContent, onClose, open, close, generatedId, bgVisible]);

  useEffect(() => {
    // Update content when scrollEnabled changes
    if (isOpenRef.current) {
      open(generatedId, renderContent(), onClose, bgVisible);
    }
  }, [scrollEnabled, open, generatedId, renderContent, onClose, bgVisible]);

  return null;
}