import { FC, useState } from 'react';
import { Outlet } from "react-router";
import ScrollToTop from 'src/components/shared/ScrollToTop';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const FullLayout: FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex w-full min-h-screen dark:bg-darkgray overflow-hidden">
      {/* Sidebar (izquierda) */}
      <div
        className={`xl:block hidden sticky top-0 z-40 transition-all duration-300 ease-in-out ${isHovered ? 'w-64' : 'w-20'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isHovered={isHovered} />
      </div>
      {/* Contenido principal (derecha) */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Header /> 
        <div className="bg-gradient-to-br from-[#CFFEFF] to-[#BBADFF] dark:bg-dark flex-grow rounded-bb p-6">
          <ScrollToTop>
            <div className="container-fluid mx-auto">
              <Outlet />
            </div>
          </ScrollToTop>
        </div>
      </div>
    </div>
  );
};

export default FullLayout;