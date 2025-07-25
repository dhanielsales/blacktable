import { useState, useCallback } from "react";

export interface CardDragState {
  isDragging: boolean;
  selectedCardId: string | null;
  hoveredCell: { row: number; col: number } | null;
}

export function useCardDrag() {
  const [dragState, setDragState] = useState<CardDragState>({
    isDragging: false,
    selectedCardId: null,
    hoveredCell: null,
  });

  const startDrag = useCallback((cardId: string) => {
    setDragState((prev) => ({
      ...prev,
      isDragging: true,
      selectedCardId: cardId,
    }));
  }, []);

  const endDrag = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      selectedCardId: null,
      hoveredCell: null,
    }));
  }, []);

  const setHoveredCell = useCallback(
    (cell: { row: number; col: number } | null) => {
      setDragState((prev) => ({
        ...prev,
        hoveredCell: cell,
      }));
    },
    []
  );

  return {
    dragState,
    startDrag,
    endDrag,
    setHoveredCell,
  };
}
