import type { Prettify } from "@/utils/types";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type MutableRefObject,
} from "react";

export interface CardData {
  id: string;
  front: string;
  back?: string;
  row: number;
  col: number;
}

export interface TableState {
  cards: CardData[];
  selectedCardId: string | null;
}

export interface HoverState {
  hoveredCell: { row: number; col: number } | null;
}

export interface TableContextValue {
  tableStates: Record<string, TableState>;
  hoverStatesRef: MutableRefObject<Record<string, HoverState>>;
  selectCard: (tableId: number, cardId: string) => void;
  deselectCard: (tableId: number) => void;
  moveCard: (tableId: number, cardId: string, row: number, col: number) => void;
  setHoveredCell: (
    tableId: number,
    cell: { row: number; col: number } | null
  ) => void;
  getHoveredCell: (tableId: number) => { row: number; col: number } | null;
  addCard: (
    tableId: number,
    card: Prettify<Omit<CardData, "id"> & { id?: string }>
  ) => void;
  removeCard: (tableId: number, cardId: string) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
}

interface TableProviderProps {
  children: ReactNode;
  numberOfTables: number;
  gridCols: number;
  gridRows: number;
}

export function getTableID(refIndex: number): string {
  return `table-${refIndex}-card-1`;
}

export function TableProvider({
  children,
  numberOfTables,
  // gridCols,
  // gridRows,
}: TableProviderProps) {
  // Use ref for hover states to avoid re-renders on mouse movement
  const hoverStatesRef = useRef<Record<string, HoverState>>({});

  const [tableStates, setTableStates] = useState<Record<string, TableState>>(
    () => {
      const initialStates: Record<string, TableState> = {};
      const initialHoverStates: Record<string, HoverState> = {};

      for (let i = 0; i < numberOfTables; i++) {
        const tableID = getTableID(i);
        initialStates[tableID] = {
          cards: [
            {
              id: tableID,
              front: "textures/44magnum.jpg",
              back: "textures/crypt-background.jpg",
              row: 0,
              col: 0,
            },
          ],
          selectedCardId: null,
        };

        initialHoverStates[tableID] = {
          hoveredCell: null,
        };
      }

      // Initialize the ref
      hoverStatesRef.current = initialHoverStates;

      return initialStates;
    }
  );

  const selectCard = useCallback((tableIndex: number, cardId: string) => {
    const tableId = getTableID(tableIndex);
    setTableStates((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        selectedCardId: cardId,
      },
    }));
  }, []);

  const deselectCard = useCallback((tableIndex: number) => {
    const tableId = getTableID(tableIndex);
    setTableStates((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        selectedCardId: null,
      },
    }));

    // Clear hover state when deselecting
    hoverStatesRef.current[tableId] = {
      hoveredCell: null,
    };
  }, []);

  const moveCard = useCallback(
    (tableIndex: number, cardId: string, row: number, col: number) => {
      console.log("moveCard", tableIndex, cardId, row, col);

      const tableId = getTableID(tableIndex);
      setTableStates((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          cards: prev[tableId].cards.map((card) =>
            card.id === cardId ? { ...card, row, col } : card
          ),
          selectedCardId: null,
        },
      }));

      // Clear hover state when moving card
      hoverStatesRef.current[tableId] = {
        hoveredCell: null,
      };
    },
    []
  );

  const setHoveredCell = useCallback(
    (tableIndex: number, cell: { row: number; col: number } | null) => {
      const tableId = getTableID(tableIndex);
      // Update ref directly without triggering re-render
      hoverStatesRef.current[tableId] = {
        hoveredCell: cell,
      };
    },
    []
  );

  const getHoveredCell = useCallback((tableIndex: number) => {
    const tableId = getTableID(tableIndex);
    return hoverStatesRef.current[tableId]?.hoveredCell || null;
  }, []);

  const addCard = useCallback(
    (tableIndex: number, card: Omit<CardData, "id"> & { id?: string }) => {
      const tableId = getTableID(tableIndex);
      const cardId = card.id || `${tableId}-${Date.now()}`;
      setTableStates((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          cards: [...prev[tableId].cards, { ...card, id: cardId }],
        },
      }));
    },
    []
  );

  const removeCard = useCallback((tableIndex: number, cardId: string) => {
    const tableId = getTableID(tableIndex);
    setTableStates((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        cards: prev[tableId].cards.filter((card) => card.id !== cardId),
      },
    }));
  }, []);

  const contextValue: TableContextValue = {
    tableStates,
    hoverStatesRef,
    selectCard,
    deselectCard,
    moveCard,
    setHoveredCell,
    getHoveredCell,
    addCard,
    removeCard,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}
