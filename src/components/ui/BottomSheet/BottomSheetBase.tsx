import "@/app/global.css";
import React, { useEffect, useId, useRef } from "react";
import { useBottomSheet } from "@/hooks/useBottomSheet";

export type BottomSheetBaseProps = {
  visible: boolean;
  bgVisible?: boolean;
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
  const { open, close } = useBottomSheet();
  const isOpenRef = useRef(false);

  // Refs vers les valeurs courantes pour éviter de recréer les effets
  const onCloseRef = useRef(onClose);
  const childrenRef = useRef(children);
  const titleRef = useRef(title);
  const bgVisibleRef = useRef(bgVisible);
  onCloseRef.current = onClose;
  childrenRef.current = children;
  titleRef.current = title;
  bgVisibleRef.current = bgVisible;

  // Enregistrement / désenregistrement uniquement quand visible change
  useEffect(() => {
    if (visible) {
      isOpenRef.current = true;
      open(
        generatedId,
        childrenRef.current,
        () => onCloseRef.current(),
        bgVisibleRef.current,
        titleRef.current
      );
    } else if (isOpenRef.current) {
      isOpenRef.current = false;
      close(generatedId);
    }
  }, [visible, generatedId, open, close]);

  // Nettoyage au démontage (navigation vers une autre page) : fermer le sheet
  useEffect(() => {
    return () => {
      if (isOpenRef.current) {
        isOpenRef.current = false;
        close(generatedId);
      }
    };
  }, [generatedId, close]);

  return null;
}

