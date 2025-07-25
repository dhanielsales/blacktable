import { type ReactNode } from "react";
import { Header } from "./Header";
import { Link } from "./Link";

export interface LayoutProps {
  children: ReactNode;
  showGameNavigation?: boolean;
  showFooter?: boolean;
}

export function Layout({
  children,
  showGameNavigation = true,
  showFooter = true,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Header showGameNavigation={showGameNavigation} />

      <main className="flex-1">{children}</main>

      {showFooter && (
        <footer className="bg-black/30 backdrop-blur-sm border-t border-gray-700 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  BlackTable
                </h3>
                <p className="text-gray-400 mt-2">
                  Virtual Card Gaming Platform
                </p>
              </div>
              <div className="flex space-x-8">
                <Link to="/settings" variant="ghost" size="sm">
                  Settings
                </Link>
                <Link href="#" external variant="ghost" size="sm">
                  Privacy Policy
                </Link>
                <Link href="#" external variant="ghost" size="sm">
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>
                &copy; 2025 BlackTable. Built with React Three Fiber and
                TypeScript.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
