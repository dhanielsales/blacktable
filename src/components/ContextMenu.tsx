import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({
  isOpen,
  position,
  items,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const isOpeningRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      isOpeningRef.current = true;
      // Reset the opening flag after the current event loop
      const timer = setTimeout(() => {
        isOpeningRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = position.x;
    let newY = position.y;

    // Adjust if menu would go off-screen horizontally
    if (position.x + rect.width > viewportWidth) {
      newX = viewportWidth - rect.width - 10;
    }

    // Adjust if menu would go off-screen vertically
    if (position.y + rect.height > viewportHeight) {
      newY = viewportHeight - rect.height - 10;
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks during the opening event loop
      if (isOpeningRef.current) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners immediately
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-48 rounded-md border border-gray-600 bg-black/90 backdrop-blur-sm shadow-lg"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <div className="py-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={cn(
              "flex w-full items-center px-3 py-2 text-sm transition-colors",
              "hover:bg-gray-800 focus:bg-gray-800 focus:outline-none",
              {
                "text-gray-300 hover:text-white":
                  item.variant !== "danger" && !item.disabled,
                "text-red-400 hover:text-red-300 hover:bg-red-900/20":
                  item.variant === "danger" && !item.disabled,
                "text-gray-500 cursor-not-allowed": item.disabled,
              }
            )}
          >
            {item.icon && (
              <span className="mr-2 flex h-4 w-4 items-center justify-center">
                {item.icon}
              </span>
            )}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
