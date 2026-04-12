import { Button, Dropdown } from "flowbite-react";
import { Icon } from "@iconify/react";
import user1 from "/src/assets/images/profile/user-1.jpg";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";

interface ProfileProps {
  variant?: "light" | "dark";
}

const Profile = ({ variant = "dark" }: ProfileProps) => {
  const isDark = variant === "dark";
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44"
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="flex items-center gap-2 cursor-pointer group-hover/menu:text-primary p-2 rounded-lg hover:bg-lightprimary transition">
            <span className="h-10 w-10 flex justify-center items-center">
              <img
                src={user1}
                alt="logo"
                height="35"
                width="35"
                className="rounded-full"
              />
            </span>
            <div className="text-left hidden sm:block">
               <p className={`text-sm font-bold ${isDark ? 'text-dark' : 'text-white'}`}>{user?.username || 'Usuario'}</p>
               <p className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-white/70'}`}>{user?.role}</p>
            </div>
          </div>
        )}
      >

        <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:user-circle-outline" height={20} />
          Mi Perfil
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:letter-linear" height={20} />
          Mi Cuenta
        </Dropdown.Item>

        <div className="p-3 pt-0">
          <Button 
            onClick={handleLogout}
            size={'sm'} 
            className="w-full mt-2 border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none"
          >
            Cerrar Sesión
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
