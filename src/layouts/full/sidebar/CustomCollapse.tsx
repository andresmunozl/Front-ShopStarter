
import { twMerge } from "tailwind-merge";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const CustomCollapse: React.FC<{
    label: string;
    open: boolean;
    children:any;
    onClick: () => void;
    icon: string;
    className?: string;
    isPro?:boolean;
    isCollapsed?: boolean;
  }> = ({ label, open, onClick, icon, children, className, isPro, isCollapsed = false }) => {
    return (
      <div className="transition-all duration-300">
        <div
          className={twMerge(
            "flex cursor-pointer mb-1 items-center justify-between rounded-lg px-4 py-[11px] gap-3 text-[15px] transition-all duration-300",
            className,
            isCollapsed && "px-2 justify-center"
          )}
          onClick={onClick}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <Icon icon={icon} height={20} className="transition-transform duration-300 transform group-hover:scale-110" />
            </div>
            <span className={`transition-all duration-300 origin-left whitespace-nowrap ${
              isCollapsed ? 'opacity-0 w-0 scale-95' : 'opacity-100 w-auto scale-100'
            }`}>
              {label}
            </span>
          </div>
          
          <div className={`flex items-center gap-0.5 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            {isPro && <span className="py-0.5 px-2 text-[10px] bg-secondary/10 text-secondary rounded mr-1">Pro</span>}
            <HiOutlineChevronDown
              className={twMerge("transform transition-transform", open ? "rotate-180" : "rotate-0")}
            />
          </div>
        </div>
        
        <div
          className={twMerge(
            "overflow-hidden transition-all duration-300 ease-in-out",
            (!isCollapsed && open) ? "max-h-[500px]" : "max-h-0"
          )}
        >
          {children}
        </div>
      </div>
    );
  };

  export {CustomCollapse}