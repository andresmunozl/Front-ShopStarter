
import  {useState, useEffect } from "react";
import { ChildItem } from "../Sidebaritems";
import NavItems from "../NavItems";
import { useLocation } from "react-router";
import { CustomCollapse } from "../CustomCollapse";
import React from "react";
import { Tooltip } from "flowbite-react";

interface NavCollapseProps {
  item: ChildItem;
  isCollapsed?: boolean;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ item, isCollapsed = false }: any) => {
  const location = useLocation();
  const pathname = location.pathname;

  const activeDD = item.children.find((t: { url: string }) => t.url === pathname);
  const [isOpen, setIsOpen] = useState<boolean>(!!activeDD);

  // Sync open state with active child but only when expanded
  useEffect(() => {
    if (!isCollapsed && activeDD) {
      setIsOpen(true);
    }
  }, [isCollapsed, activeDD]);

  const handleToggle = () => {
    if (!isCollapsed) {
      setIsOpen((prev) => !prev);
    }
  };

  const content = (
    <CustomCollapse
      label={item.name}
      open={isCollapsed ? false : isOpen}
      onClick={handleToggle}
      icon={item.icon} 
      isPro={item.isPro}
      isCollapsed={isCollapsed}
      className={
        Boolean(activeDD)
          ? "!text-white bg-primary rounded-xl shadow-md"
          : "rounded-xl dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5"
      }
    >
      {!isCollapsed && item.children && (
        <div className="sidebar-dropdown ml-4 border-l border-gray-100 dark:border-white/10 mt-1 pl-2">
          {item.children.map((child: any) => (
            <React.Fragment key={child.id}>
              {child.children ? (
                <NavCollapse item={child} isCollapsed={isCollapsed} />
              ) : (
                <NavItems item={child} isCollapsed={isCollapsed} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </CustomCollapse>
  );

  return isCollapsed ? (
    <Tooltip content={item.name} placement="right" style="light">
      <div className="mb-1">{content}</div>
    </Tooltip>
  ) : content;
};

export default NavCollapse;
