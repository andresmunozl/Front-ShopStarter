
import {  Sidebar } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
// @ts-ignore
import SimpleBar from "simplebar-react";
import React, { useState } from "react";
import NavCollapse from "./NavCollapse";
import { useAuth } from "../../../context/AuthContext";

const SidebarLayout = () => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Filtrar contenido del sidebar según el ROL
  const filteredContent = SidebarContent?.filter(item => {
    if (!user) return false;
    if (item.heading === user.role) return true;
    if (user.role === 'ADMIN' && (item.heading === 'SISTEMA' || item.heading === 'Apps')) return true;
    return false;
  });

  const isCollapsed = !isHovered;

  return (
    <>
      <div 
        className="xl:block hidden sticky top-[72px] z-40 w-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar
          className={`fixed h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-darkgray transition-all duration-300 ease-in-out ${isHovered ? 'w-64 shadow-xl' : 'w-20'}`}
          aria-label="Sidebar"
        >
          <div className="sidebar-logo-spacer h-4"></div>
          
          <SimpleBar className="h-[calc(100vh_-_100px)] overflow-x-hidden">
            <Sidebar.Items className={`${isCollapsed ? 'px-2' : 'px-5'} transition-all duration-300`}>
              <Sidebar.ItemGroup className="sidebar-nav">
                {filteredContent?.map((item, index) => (
                  <div className="mb-4" key={item.heading || index}>
                    {!isCollapsed && (
                      <h5 className="text-link dark:text-white/70 font-semibold text-xs pb-3 uppercase tracking-widest opacity-100 transition-opacity duration-300">
                        {item.heading}
                      </h5>
                    )}
                    {item.children?.map((child, idx) => (
                      <div key={child.id || idx} className="mb-1">
                        {child.children ? (
                          <NavCollapse item={child} isCollapsed={isCollapsed} />
                        ) : (
                          <NavItems item={child} isCollapsed={isCollapsed} />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarLayout;
