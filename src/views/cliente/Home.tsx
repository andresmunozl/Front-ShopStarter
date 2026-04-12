import { Card } from 'flowbite-react';
import VendorMap from 'src/components/geo/VendorMap';

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-dark dark:text-white">Explorar Negocios Cercanos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa de Vendedores Real */}
        <div className="h-[500px]">
           <VendorMap />
        </div>

        {/* Placeholder para Filtros y Catálogo */}
        <div className="flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold mb-2 text-dark dark:text-white">Filtros de Búsqueda</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">Comida</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-light rounded-full text-gray-600 dark:text-gray-300">Tecnología</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-light rounded-full text-gray-600 dark:text-gray-300">Ropa</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-light rounded-full text-gray-600 dark:text-gray-300">Servicios</span>
            </div>
          </Card>
          
          <Card className="flex-1">
            <h3 className="font-semibold mb-4 text-dark dark:text-white">Catálogo de Productos</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-dark-light rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                    Img
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">Producto de Ejemplo {i}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoría • Vendedor {i}</p>
                    <p className="text-sm font-bold text-primary">$99.00</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
