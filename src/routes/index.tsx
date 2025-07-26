import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Layout } from "../components/Layout";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            Virtual Card Gaming Table
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Experience immersive card gaming in a 3D environment. Play with
            friends around virtual pentagon tables with realistic card physics
            and interactions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={() => alert("Get Started!")}
            >
              Get Started Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => alert("Learn More!")}
            >
              Learn More
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-red-600/50 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-red-600">
                Quick Play
              </h3>
              <p className="text-gray-300 mb-6">
                Jump straight into the game with 5 pentagon tables. Perfect for
                testing card movements and exploring the 3D environment.
              </p>
              <Link to="/game" variant="primary" size="lg">
                Start Playing
              </Link>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-red-600/50 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-red-600">
                Game Rooms
              </h3>
              <p className="text-gray-300 mb-6">
                Create or join multiplayer rooms. Manage players, customize
                tables, and enjoy collaborative card gaming experiences.
              </p>
              <Link to="/rooms" variant="secondary" size="lg">
                Browse Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
