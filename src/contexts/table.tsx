import type { Prettify } from "@/utils/types";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
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
  hoveredCell: { row: number; col: number } | null;
}

export interface TableContextValue {
  tableStates: Record<string, TableState>;
  selectCard: (tableId: number, cardId: string) => void;
  deselectCard: (tableId: number) => void;
  moveCard: (tableId: number, cardId: string, row: number, col: number) => void;
  setHoveredCell: (
    tableId: number,
    cell: { row: number; col: number } | null
  ) => void;
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
  // const [tableGridRefs] = useState<Record<string, TableState>>();
  const [tableStates, setTableStates] = useState<Record<string, TableState>>(
    () => {
      const initialStates: Record<string, TableState> = {};
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
          hoveredCell: null,
        };
      }

      return initialStates;
    }
  );

  useEffect(() => {
    console.log(tableStates);
  }, [tableStates]);

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
        hoveredCell: null,
      },
    }));
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
          hoveredCell: null,
        },
      }));
    },
    []
  );

  const setHoveredCell = useCallback(
    (tableIndex: number, cell: { row: number; col: number } | null) => {
      const tableId = getTableID(tableIndex);
      setTableStates((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          hoveredCell: cell,
        },
      }));
    },
    []
  );

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
    selectCard,
    deselectCard,
    moveCard,
    setHoveredCell,
    addCard,
    removeCard,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}
