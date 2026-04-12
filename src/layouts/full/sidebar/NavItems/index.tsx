import React from "react";
import { ChildItem } from "../Sidebaritems";
import { Sidebar, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router";

interface NavItemsProps {
  item: ChildItem;
  isCollapsed?: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ item, isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const content = (
    <Sidebar.Item
      to={item.url}
      target={item?.isPro ? "blank" : "_self"}
      as={Link}
      className={`transition-all duration-300 ${item.url == pathname
          ? "text-white bg-primary rounded-xl shadow-md"
          : "text-link bg-transparent group/link hover:bg-gray-50 dark:hover:bg-white/5"
        } ${isCollapsed ? 'px-2 flex justify-center' : 'px-4'}`}
    >
      <div className={`flex items-center gap-3 w-full transition-all duration-300`}>
        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
          {item.icon ? (
            <Icon icon={item.icon} className={`${item.color} transition-transform duration-300 ${!isCollapsed ? 'scale-110' : ''}`} height={20} />
          ) : (
            <span
              className={`${item.url == pathname
                  ? "bg-white"
                  : "bg-black/40 dark:bg-white/40"
                } h-1.5 w-1.5 rounded-full`}
            ></span>
          )}
        </div>
        
        <span className={`transition-all duration-300 origin-left whitespace-nowrap overflow-hidden ${
          isCollapsed ? 'opacity-0 w-0 scale-95' : 'opacity-100 w-auto scale-100'
        }`}>
          {item.name}
          {item.isPro && (
            <span className="ml-2 py-0.5 px-2 text-[10px] bg-secondary/10 text-secondary rounded animate-pulse">Pro</span>
          )}
        </span>
      </div>
    </Sidebar.Item>
  );

  return isCollapsed ? (
    <Tooltip content={item.name} placement="right" style="light">
      {content}
    </Tooltip>
  ) : content;
};

export default NavItems;
