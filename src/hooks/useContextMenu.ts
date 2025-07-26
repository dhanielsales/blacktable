import { useState, useCallback } from "react";

export interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  cardId: string | null;
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    cardId: null,
  });

  const openContextMenu = useCallback(
    (x: number, y: number, cardId: string) => {
      setContextMenu({
        isOpen: true,
        position: { x, y },
        cardId,
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      cardId: null,
    });
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
}
