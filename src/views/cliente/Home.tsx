import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import api from '../../utils/axios';
import RoleBasedMap from '../shared/RoleBasedMap';
import { useNavigate } from 'react-router';
import AOS from 'aos';

const ClienteHome = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Efecto inicial para cargar las categorías desde la API al montar el componente
  useEffect(() => {
    // Refrescar AOS (animaciones al hacer scroll)
    AOS.refresh();
    
    const fetchCategories = async () => {
      try {
        const res = await api.get('products/get-categories/');
        setCategories(res.data.results || res.data);
      } catch (err) {
        console.error("Error al obtener las categorías", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-20 overflow-x-hidden">
      
      {/*Sección Hero: Bienvenida y llamados a la acción principales */}
      <section className="relative h-[450px] flex items-center justify-center text-center overflow-hidden bg-gray-900 rounded-3xl mx-6 mt-6 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-4 max-w-3xl" data-aos="fade-up">
          <Badge color="primary" className="mb-4 mx-auto w-fit uppercase tracking-widest font-black px-4 py-1.5 rounded-full border-2 border-primary/20 bg-primary/10">
            Bienvenido a ShopStarter
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
            TODO LO QUE BUSCAS, <br/>
            <span className="text-primary italic">MÁS CERCA DE TI.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto opacity-80">
            Descubre negocios locales, explora productos únicos y apoya el comercio de tu comunidad. 
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="xl" className="rounded-2xl font-black px-8 py-2 bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20" onClick={() => navigate('/cliente/productos')}>
              IR AL CATÁLOGO
              <Icon icon="solar:arrow-right-bold-duotone" className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/*Sección de Categorías: Muestra las categorías más populares para navegación rápida */}
      <section className="px-6" data-aos="fade-up" data-aos-delay="200">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">Categorías <span className="text-primary">Populares</span></h2>
                <p className="text-gray-500">¿Qué estás buscando hoy?</p>
            </div>
            <Button color="gray" outline pill className="font-bold border-2" onClick={() => navigate('/cliente/productos')}>
                Ver todas
            </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
             Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl"></div>
             ))
          ) : (
            categories.slice(0, 6).map((cat, index) => (
              <div 
                key={cat.id} 
                onClick={() => navigate('/cliente/productos')}
                className="group relative h-40 bg-white dark:bg-dark-light rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer overflow-hidden border border-gray-50 dark:border-gray-800"
                data-aos="zoom-in"
                data-aos-delay={index * 50}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                <span className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-500 drop-shadow-lg z-10">{cat.emoji || '🛍️'}</span>
                <span className="text-sm font-black text-gray-700 dark:text-gray-200 text-center z-10 group-hover:text-primary transition-colors uppercase tracking-tight">{cat.name}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Sección del Mapa Interactivo: Utiliza el componente compartido RoleBasedMap */}
      <section className="px-6" data-aos="fade-up">
        <div className="bg-white dark:bg-dark-light rounded-[40px] p-8 shadow-2xl border border-gray-50 dark:border-gray-800 flex flex-col lg:flex-row gap-10">
           <div className="lg:w-1/3 flex flex-col justify-center">
                <Badge color="warning" className="w-fit mb-4">MAPA INTERACTIVO</Badge>
                <h3 className="text-4xl font-black text-gray-800 dark:text-white leading-tight mb-4 uppercase">Explora negocios <br/><span className="text-primary">en tiempo real</span></h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Visualiza los puntos de venta más cercanos a tu ubicación. Encuentra tiendas físicas, locales de comida y mucho más en un mapa dinámico.
                </p>
                <ul className="space-y-4 mb-8">
                    {['Búsqueda Georeferenciada', 'Información de Contacto', 'Rutas Directas'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                            <Icon icon="solar:check-circle-bold-duotone" className="text-emerald-500" height={22} />
                            {item}
                        </li>
                    ))}
                </ul>
                <Button color="dark" size="lg" className="rounded-2xl font-black" onClick={() => navigate('/cliente/mapa')}>
                    ABRIR MAPA COMPLETO
                </Button>
           </div>
           <div className="lg:w-2/3 h-[500px] rounded-3xl overflow-hidden shadow-inner border border-gray-100 dark:border-gray-800">
                <RoleBasedMap />
           </div>
        </div>
      </section>

      {/* 🛍️ Llamada a la Acción Final: Incentiva al cliente a explorar el catálogo completo */}
      <section className="px-6 text-center" data-aos="fade-up">
            <div className="bg-primary py-20 rounded-[50px] relative overflow-hidden shadow-2xl shadow-primary/30">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -mr-32 -mb-32"></div>
                
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">¿Listo para comprar?</h2>
                <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto font-medium">
                    Miles de productos esperan por ti. Únete a la red de comercio local más grande de la región.
                </p>
                <Button color="light" size="xl" className="mx-auto rounded-2xl font-black px-12 border-0 shadow-2xl text-primary" onClick={() => navigate('/cliente/productos')}>
                    IR AL CATÁLOGO
                </Button>
            </div>
      </section>

    </div>
  );
};

export default ClienteHome;
