import { useState, useEffect } from "react";
import { Navbar } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Drawer } from "flowbite-react";
import MobileSidebar from "../sidebar/MobileSidebar";
import Notification from "./notification";
import Profile from "./Profile";
import Cart from "./Cart";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useAuth();

  // Manejador del scroll para añadir efecto de transparencia y desenfoque (sticky) al bajar la página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Estado para el sidebar móvil (menú hamburguesa)
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-[50] transition-all duration-300 ${isSticky
          ? "bg-gradient-to-r from-[#2CD4D9]/90 via-[#3A17E4]/90 to-[#0A014A]/90 backdrop-blur-md shadow-lg py-2 text-white"
          : "bg-gradient-to-r from-[#2CD4D9] via-[#3A17E4] to-[#0A014A] py-4 text-white"
          }`}
      >
        <Navbar fluid className="bg-transparent dark:bg-transparent px-4">
          <div className="flex items-center justify-between w-full">
            
            {/* Sección Izquierda: Botón de menú móvil y Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 flex text-white dark:text-white xl:hidden hover:bg-white/10 rounded-xl justify-center items-center transition-colors"
                aria-label="Abrir menú"
              >
                <Icon icon="solar:hamburger-menu-line-duotone" height={22} />
              </button>
              
              <div className="hidden sm:block">
                <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center">
                    <span className="opacity-90">Shop</span>
                    <span className="text-white ml-0.5">Starter</span>
                 </h2>
              </div>
            </div>

            {/* Sección Derecha: Notificaciones, Carrito y Perfil */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Lógica de Rol: El carrito solo se muestra a los Clientes */}
              {user?.role === 'CLIENTE' && (
                <div className="flex items-center">
                  <Cart variant="light" />
                </div>
              )}

              {/* Las notificaciones son visibles para todos los roles (Vendedor, Cliente, Admin) */}
              <div className="flex items-center">
                <Notification variant="light" />
              </div>

              {/* Divisor visual */}
              <div className="h-6 w-[1px] bg-white-20 mx-1 hidden sm:block"></div>

              {/* Menú desplegable del Perfil de Usuario */}
              <Profile variant="light" />
              
            </div>
          </div>
        </Navbar>
      </header>

      {/* Menú lateral móvil deslizante */}
      <Drawer open={isOpen} onClose={handleClose} className="w-72 p-0">
        <Drawer.Items className="h-full">
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;
