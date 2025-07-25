import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [playerName, setPlayerName] = useState("Guest Player");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [graphicsQuality, setGraphicsQuality] = useState("high");
  const [showAnimations, setShowAnimations] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    // Here you would save to localStorage or send to server
    console.log("Settings saved:", {
      playerName,
      soundEnabled,
      graphicsQuality,
      showAnimations,
      autoSave,
    });

    // Show success message
    alert("Settings saved successfully!");
  };

  return (
    <Layout>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {/* Player Settings */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">
                  Player Settings
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none"
                    placeholder="Enter your name..."
                  />
                </div>
              </section>

              {/* Audio Settings */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">
                  Audio
                </h2>

                <div className="flex items-center justify-between mb-4">
                  <span>Sound Effects</span>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      soundEnabled ? "bg-red-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </section>

              {/* Graphics Settings */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">
                  Graphics
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Graphics Quality
                  </label>
                  <select
                    value={graphicsQuality}
                    onChange={(e) => setGraphicsQuality(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none"
                  >
                    <option value="low">Low (Better Performance)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Better Quality)</option>
                    <option value="ultra">Ultra (Best Quality)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span>Show Animations</span>
                  <button
                    type="button"
                    onClick={() => setShowAnimations(!showAnimations)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showAnimations ? "bg-red-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showAnimations ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </section>

              {/* Game Settings */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">
                  Game
                </h2>

                <div className="flex items-center justify-between mb-4">
                  <span>Auto-save Game State</span>
                  <button
                    type="button"
                    onClick={() => setAutoSave(!autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoSave ? "bg-red-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSave ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </section>

              {/* Actions */}
              <div className="flex space-x-4 pt-6 border-t border-gray-600">
                <Button type="submit" variant="primary" className="flex-1">
                  Save Settings
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setPlayerName("Guest Player");
                    setSoundEnabled(true);
                    setGraphicsQuality("high");
                    setShowAnimations(true);
                    setAutoSave(true);
                  }}
                >
                  Reset to Defaults
                </Button>
              </div>
            </form>
          </div>

          {/* App Information */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">App Information</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Build:</span>
                <span>2025.01.23</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span>Web</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
