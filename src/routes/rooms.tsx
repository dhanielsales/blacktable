import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { Link } from "../components/Link";

export const Route = createFileRoute("/rooms")({
  component: Rooms,
});

interface GameRoom {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
  created: Date;
}

function Rooms() {
  const [rooms] = useState<GameRoom[]>([
    {
      id: "1",
      name: "Casual Game Night",
      players: 3,
      maxPlayers: 5,
      status: "waiting",
      created: new Date("2025-01-23T20:00:00"),
    },
    {
      id: "2",
      name: "Tournament Table",
      players: 5,
      maxPlayers: 5,
      status: "playing",
      created: new Date("2025-01-23T19:30:00"),
    },
    {
      id: "3",
      name: "Beginners Welcome",
      players: 1,
      maxPlayers: 4,
      status: "waiting",
      created: new Date("2025-01-23T21:15:00"),
    },
  ]);

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const getStatusColor = (status: GameRoom["status"]) => {
    switch (status) {
      case "waiting":
        return "text-green-400";
      case "playing":
        return "text-blue-400";
      case "finished":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: GameRoom["status"]) => {
    switch (status) {
      case "waiting":
        return "Waiting for players";
      case "playing":
        return "Game in progress";
      case "finished":
        return "Game finished";
      default:
        return "Unknown";
    }
  };

  return (
    <Layout>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Game Rooms</h1>
            <Button variant="primary" onClick={() => setShowCreateRoom(true)}>
              Create Room
            </Button>
          </div>

          {/* Room List */}
          <div className="grid gap-6 mb-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>
                        Players: {room.players}/{room.maxPlayers}
                      </span>
                      <span className={getStatusColor(room.status)}>
                        {getStatusText(room.status)}
                      </span>
                      <span>Created: {room.created.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {room.status === "waiting" &&
                      room.players < room.maxPlayers && (
                        <Link to="/game" variant="primary">
                          Join Room
                        </Link>
                      )}
                    <Link to="/game" variant="secondary">
                      Spectate
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {rooms.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎮</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">No active rooms</h3>
              <p className="text-gray-400 mb-8">
                Be the first to create a game room!
              </p>
              <Button variant="primary" onClick={() => setShowCreateRoom(true)}>
                Create First Room
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Create New Room</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Here you would typically create the room
                console.log("Creating room:", newRoomName);
                setShowCreateRoom(false);
                setNewRoomName("");
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Enter room name..."
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Max Players
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none">
                  <option value="2">2 Players</option>
                  <option value="3">3 Players</option>
                  <option value="4">4 Players</option>
                  <option value="5">5 Players</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Create Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
