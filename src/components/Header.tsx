import { Link } from "./Link";

export interface HeaderProps {
  showGameNavigation?: boolean;
}

export function Header({ showGameNavigation = true }: HeaderProps) {
  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            variant="ghost"
            className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent hover:no-underline"
          >
            BlackTable
          </Link>
          <nav className="space-x-6">
            <Link to="/" variant="ghost">
              Home
            </Link>
            {showGameNavigation && (
              <>
                <Link to="/game" variant="ghost">
                  Quick Play
                </Link>
                <Link to="/rooms" variant="ghost">
                  Game Rooms
                </Link>
              </>
            )}
            <Link to="/settings" variant="ghost">
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
