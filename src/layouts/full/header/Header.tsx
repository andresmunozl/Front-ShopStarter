import { useState, useEffect } from "react";
import { Navbar } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Drawer } from "flowbite-react";
import MobileSidebar from "src/layouts/full/sidebar/MobileSidebar.tsx";
import Notification from "src/layouts/full/header/notification.tsx";
import Profile from "src/layouts/full/header/Profile.tsx";
import Cart from "src/layouts/full/header/Cart.tsx";
import { useAuth } from "../../../context/AuthContext";
import LanguageSelector from "../../../components/LanguageSelector/LanguageSelector";
import { useTranslation } from "react-i18next";

import "src/layouts/full/header/Header.css";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation("headerTrad");

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <header className={`ss-header${isSticky ? " ss-header--sticky" : ""}`}>
        <Navbar fluid className="ss-navbar">
          <div className="ss-nav-main">
            {/* Izquierda */}
            <div className="ss-nav-left">
              <button
                onClick={() => setIsOpen(true)}
                className="ss-burger"
                aria-label={t('openMenu')}
              >
                <Icon icon="solar:hamburger-menu-line-duotone" height={24} />
              </button>
              <div className="ss-logo">
                <h2>
                  <span className="ss-logo-main">{t('logoShop')}</span>
                  <span className="ss-logo-highlight">{t('logoStarter')}</span>
                </h2>
              </div>
            </div>
            {/* Derecha */}
            <div className="ss-nav-right">
              <LanguageSelector />
              {user?.role === "CLIENTE" && <Cart variant="light" />}
              <Notification variant="light" />
              <div className="ss-divider" />
              <Profile variant="light" />
            </div>
          </div>
        </Navbar>
      </header>
      {/* Drawer personalizado con z-index alto */}
      <Drawer
        open={isOpen}
        onClose={handleClose}
        className="w-72 p-0 custom-drawer-z"
      >
        <Drawer.Items className="h-full">
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;