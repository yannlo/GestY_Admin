import "@/app/global.css";
import React, { useEffect, useId, useRef } from "react";
import { useBottomSheetActions } from "@/hooks/useBottomSheet";

export type BottomSheetBaseProps = {
  visible: boolean;
  bgVisible?: boolean;
  onClose: () => void;
  header?: React.ReactNode | string;
  children: React.ReactNode;
};

// BottomSheet déclaratif - le dernier ouvert remplace le précédent
export default function BottomSheetBase({
  visible,
  bgVisible = true,
  onClose,
  header,
  children,
}: BottomSheetBaseProps) {
  const generatedId = useId();
  const { open, close } = useBottomSheetActions();
  const isOpenRef = useRef(false);

  // Refs vers les valeurs courantes pour éviter de recréer les effets
  const onCloseRef = useRef(onClose);
  const childrenRef = useRef(children);
  const headerRef = useRef(header);
  const bgVisibleRef = useRef(bgVisible);
  onCloseRef.current = onClose;
  childrenRef.current = children;
  headerRef.current = header;
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
        headerRef.current
      );
    } else if (isOpenRef.current) {
      isOpenRef.current = false;
      close(generatedId);
    }
  }, [visible, generatedId, open, close]);

  // Mise à jour du contenu en place quand le sheet est déjà ouvert
  useEffect(() => {
    if (visible && isOpenRef.current) {
      open(generatedId, childrenRef.current, () => onCloseRef.current(), bgVisibleRef.current, headerRef.current);
    }
  }, [header, children, visible, generatedId, open]);

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

