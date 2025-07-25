import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  tablePosition?: number;
}

export interface GameStats {
  cardsPlayed: number;
  gamesPlayed: number;
  totalPlayTime: number;
  lastPlayed?: Date;
}

export interface PlayerContextValue {
  currentPlayer: Player | null;
  players: Player[];
  gameStats: GameStats;
  setCurrentPlayer: (player: Player) => void;
  addPlayer: (player: Omit<Player, "id">) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  updateGameStats: (updates: Partial<GameStats>) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
}

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentPlayer, setCurrentPlayerState] = useState<Player | null>({
    id: "player-1",
    name: "Guest Player",
    isOnline: true,
    tablePosition: 0,
  });

  const [players, setPlayers] = useState<Player[]>([
    {
      id: "player-1",
      name: "Guest Player",
      isOnline: true,
      tablePosition: 0,
    },
  ]);

  const [gameStats, setGameStats] = useState<GameStats>({
    cardsPlayed: 0,
    gamesPlayed: 0,
    totalPlayTime: 0,
    lastPlayed: undefined,
  });

  const setCurrentPlayer = useCallback((player: Player) => {
    setCurrentPlayerState(player);
  }, []);

  const addPlayer = useCallback((player: Omit<Player, "id">) => {
    const newPlayer: Player = {
      ...player,
      id: `player-${Date.now()}`,
    };
    setPlayers((prev) => [...prev, newPlayer]);
  }, []);

  const updatePlayer = useCallback(
    (id: string, updates: Partial<Player>) => {
      setPlayers((prev) =>
        prev.map((player) =>
          player.id === id ? { ...player, ...updates } : player
        )
      );

      if (currentPlayer?.id === id) {
        setCurrentPlayerState((prev) =>
          prev ? { ...prev, ...updates } : null
        );
      }
    },
    [currentPlayer]
  );

  const removePlayer = useCallback(
    (id: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id));

      if (currentPlayer?.id === id) {
        setCurrentPlayerState(null);
      }
    },
    [currentPlayer]
  );

  const updateGameStats = useCallback((updates: Partial<GameStats>) => {
    setGameStats((prev) => ({ ...prev, ...updates }));
  }, []);

  const contextValue: PlayerContextValue = {
    currentPlayer,
    players,
    gameStats,
    setCurrentPlayer,
    addPlayer,
    updatePlayer,
    removePlayer,
    updateGameStats,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}
