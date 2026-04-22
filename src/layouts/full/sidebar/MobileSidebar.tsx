import { Sidebar } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
// @ts-ignore
import SimpleBar from "simplebar-react";
import React from "react";
import FullLogo from "../shared/logo/FullLogo";
import 'simplebar-react/dist/simplebar.min.css';
import Upgrade from "./Upgrade";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

// Mapeo igual que en el sidebar de escritorio:
const roleToHeadingKey = (role: string): string | string[] => {
  switch (role) {
    case "ADMIN":
      return ["heading.admin", "heading.system"];
    case "VENDEDOR":
      return "heading.seller";
    case "CLIENTE":
      return "heading.client";
    default:
      return "";
  }
};

const MobileSidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation("sidebarTrad");

  let allowedHeadings: string[] = [];

  if (user?.role) {
    const headingKey = roleToHeadingKey(user.role);
    allowedHeadings = Array.isArray(headingKey) ? headingKey : [headingKey];
  }

  // Filtrar el contenido del sidebar por role y claves
  const filteredContent = SidebarContent?.filter(item =>
    allowedHeadings.includes(item.heading ?? "")
  );

  return (
    <Sidebar
      className="fixed menu-sidebar pt-0 bg-white dark:bg-darkgray transition-all"
      aria-label="Sidebar with multi-level dropdown example"
    >
      <div className="px-5 py-4 pb-7 flex items-center sidebarlogo">
        <FullLogo />
      </div>
      <SimpleBar className="h-[calc(100vh_-_242px)]">
        <Sidebar.Items className="px-5 mt-2">
          <Sidebar.ItemGroup className="sidebar-nav hide-menu">
            {filteredContent &&
              filteredContent.map((item, index) => (
                <div className="caption" key={item.heading || index}>
                  <React.Fragment key={index}>
                    {/* Heading traducido */}
                    <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                      {t(item.heading)}
                    </h5>
                    {item.children?.map((child, i) => (
                      <React.Fragment key={child.id ?? i}>
                        {/* Name traducido */}
                        <NavItems item={{ ...child, name: t(child.name) }} />
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                </div>
              ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </SimpleBar>
      <Upgrade />
    </Sidebar>
  );
};

export default MobileSidebar;