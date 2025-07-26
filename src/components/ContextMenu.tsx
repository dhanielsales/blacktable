import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
  type?: "item" | "separator" | "submenu";
  submenu?: ContextMenuItem[];
  shortcut?: string;
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
  const submenuRef = useRef<HTMLDivElement>(null);
  const adjustedPositionRef = useRef<{ x: number; y: number }>(position);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isOpeningRef = useRef<boolean>(false);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      isOpeningRef.current = true;
      // Reset the opening flag after the current event loop
      const timer = setTimeout(() => {
        isOpeningRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    } else {
      // Clean up submenu timeout when menu closes
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
        submenuTimeoutRef.current = null;
      }
      setOpenSubmenu(null);
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

    adjustedPositionRef.current = { x: newX, y: newY };

    // Update the menu position directly
    menu.style.left = `${newX}px`;
    menu.style.top = `${newY}px`;
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  // Update submenu position when it opens
  useEffect(() => {
    if (openSubmenu && submenuRef.current) {
      const submenu = submenuRef.current;
      submenu.style.left = `${submenuPositionRef.current.x}px`;
      submenu.style.top = `${submenuPositionRef.current.y}px`;
    }
  }, [openSubmenu]);

  if (!isOpen) return null;

  const handleSubmenuHover = (
    item: ContextMenuItem,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Clear any pending timeout
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }

    if (item.type === "submenu" && item.submenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      submenuPositionRef.current = {
        x: rect.right + 5,
        y: rect.top,
      };
      setOpenSubmenu(item.id);
    }
  };

  const handleMouseLeave = () => {
    // Don't close immediately, add a delay to allow moving to submenu
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 300); // 300ms delay
  };

  const handleSubmenuMouseEnter = () => {
    // Clear the timeout when entering submenu
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
  };

  const handleSubmenuMouseLeave = () => {
    // Close submenu when leaving it
    setOpenSubmenu(null);
  };

  const renderMenuItem = (item: ContextMenuItem) => {
    // Render separator
    if (item.type === "separator") {
      return (
        <div
          key={item.id}
          className="my-1 h-px bg-gray-600 mx-1"
          role="separator"
        />
      );
    }

    // Render submenu item
    if (item.type === "submenu") {
      return (
        <button
          key={item.id}
          onMouseEnter={(e) => handleSubmenuHover(item, e)}
          disabled={item.disabled}
          className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm transition-colors",
            "hover:bg-gray-800 focus:bg-gray-800 focus:text-white",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            {
              "text-gray-300": !item.disabled,
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
          <ChevronRight className="ml-auto h-4 w-4" />
        </button>
      );
    }

    // Render regular item
    return (
      <button
        key={item.id}
        onClick={() => {
          if (!item.disabled && item.onClick) {
            item.onClick();
            onClose();
          }
        }}
        disabled={item.disabled}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm transition-colors",
          "hover:bg-gray-800 focus:bg-gray-800 focus:outline-none",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
        {item.shortcut && (
          <span className="ml-auto text-xs tracking-widest text-gray-500">
            {item.shortcut}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-600 bg-black/90 backdrop-blur-sm p-1 text-gray-300 shadow-lg animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseLeave={handleMouseLeave}
      >
        {items.map(renderMenuItem)}
      </div>

      {/* Render submenu */}
      {openSubmenu && (
        <div
          ref={submenuRef}
          className="fixed z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 bg-black/90 backdrop-blur-sm p-1 text-gray-300 shadow-lg animate-in fade-in-0 zoom-in-95"
          style={{
            left: submenuPositionRef.current.x,
            top: submenuPositionRef.current.y,
          }}
          onMouseEnter={handleSubmenuMouseEnter}
          onMouseLeave={handleSubmenuMouseLeave}
        >
          {items
            .find((item) => item.id === openSubmenu)
            ?.submenu?.map(renderMenuItem)}
        </div>
      )}
    </>
  );
}
