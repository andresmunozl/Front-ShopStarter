import { Sidebar } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";

import SimpleBar from "simplebar-react";
import React from "react";
import NavCollapse from "./NavCollapse";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isHovered: boolean;
}

// Mapea el role del usuario a la clave de heading correspondiente
const roleToHeadingKey = (role: string): string | string[] => {
  switch (role) {
    case "ADMIN":
      // Admin ve ambas secciones
      return ["heading.admin", "heading.system"];
    case "VENDEDOR":
      return "heading.seller";
    case "CLIENTE":
      return "heading.client";
    default:
      return "";
  }
};

const SidebarLayout: React.FC<SidebarProps> = ({ isHovered }) => {
  const { user } = useAuth();
  const { t } = useTranslation("sidebarTrad");

  let allowedHeadings: string[] = [];

  if (user?.role) {
    const headingKey = roleToHeadingKey(user.role);
    allowedHeadings = Array.isArray(headingKey) ? headingKey : [headingKey];
  }

  // Filtrar contenido del sidebar según el ROL usando las claves de heading
  const filteredContent = SidebarContent?.filter(item => allowedHeadings.includes(item.heading ?? ""));

  const isCollapsed = !isHovered;

  return (
    <Sidebar
      className={`fixed h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-darkgray shadow-sm transition-all duration-300 ease-in-out ${isHovered ? "w-64" : "w-20"}`}
      aria-label="Sidebar"
    >
      <div className="sidebar-logo-spacer h-4"></div>

      <SimpleBar className="h-[calc(100vh_-_100px)] overflow-x-hidden">
        <Sidebar.Items className={`${isCollapsed ? "px-2" : "px-4"} transition-all duration-300`}>
          <Sidebar.ItemGroup className="sidebar-nav">
            {filteredContent?.map((item, index) => (
              <div className="mb-4" key={item.heading || index}>
                {/* Heading traducido dinámicamente */}
                {!isCollapsed && item.heading && (
                  <h5 className="text-link dark:text-white/70 font-semibold text-xs pb-3 uppercase tracking-widest opacity-100 transition-opacity duration-300">
                    {t(item.heading)}
                  </h5>
                )}
                {item.children?.map((child, idx) => (
                  <div key={child.id || idx} className="mb-1">
                    {child.children ? (
                      <NavCollapse item={child} isCollapsed={isCollapsed} />
                    ) : (
                      // Si NavItems necesita el nombre traducido, pásale t(child.name)
                      <NavItems item={{ ...child, name: t(child.name) }} isCollapsed={isCollapsed} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </SimpleBar>
    </Sidebar>
  );
};

export default SidebarLayout;