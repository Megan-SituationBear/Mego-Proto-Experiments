/**
 * TabToggle Component - Animated toggle with smooth transitions
 * 
 * AUTO-UPDATE: This component is shared and used in multiple places.
 * Any changes here automatically appear everywhere it's embedded:
 * - HomePage: Recent/Favorites/Suggested Templates toggle
 * - AIInput: Ask/Make mode toggle
 * 
 * Since it's a React component, updates propagate automatically!
 */

import { motion } from "framer-motion";

import { cn } from "./utils";

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

export interface TabToggleProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  size?: "xs" | "sm" | "default";
  variant?: "default" | "blue";
}

export function TabToggle({ tabs, activeTab, onTabChange, size = "default", variant = "default" }: TabToggleProps) {
  const isXSmall = size === "xs";
  const isSmall = size === "sm";
  const isBlue = variant === "blue";

  return (
    <div className={cn(
      "inline-flex flex-wrap items-center bg-slate-100 rounded-full relative w-full sm:w-auto",
      isXSmall ? "gap-0.5 p-0.5" : isSmall ? "gap-1 p-0.5" : "gap-1 sm:gap-2 p-1"
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-full transition-colors duration-200 flex items-center relative z-10 whitespace-nowrap flex-1 sm:flex-initial justify-center",
              isXSmall ? "px-4 py-0.5 gap-1 text-[10pt] font-[Inter,system-ui,sans-serif]" : isSmall ? "px-2 sm:px-3 py-1 gap-1 sm:gap-1.5 text-sm" : "px-3 sm:px-5 py-1.5 sm:py-2 gap-1.5 sm:gap-2 text-sm sm:text-base",
              isActive
                ? isBlue ? "text-white" : "text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`bubble-${size}-${variant}`}
                className={cn(
                  "absolute inset-0 shadow-sm rounded-full",
                  isBlue ? "bg-blue-500" : "bg-white"
                )}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="truncate">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 sm:px-2 py-0.5 rounded-full min-w-[20px] sm:min-w-[24px] text-center",
                  isXSmall ? "text-[9pt] font-[Inter,system-ui,sans-serif]" : isSmall ? "text-xs" : "text-xs sm:text-sm",
                  isActive
                    ? isBlue ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

