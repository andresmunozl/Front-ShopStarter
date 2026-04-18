import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Badge, Button, Label, Select, Spinner } from "flowbite-react";
import { Icon } from "@iconify/react";
import "./ProductCatalog.css";
import api from "../../utils/axios";
import ImagePreviewModal from "../shared/ImagePreviewModal";
import { useCart } from "../../context/CartContext";
import { useMap } from "../../context/MapContext";
import { toast } from "react-hot-toast";

type ApiProductImage = {
  id: number;
  url_image: string;
  is_main: boolean;
};

type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  status: string;
  vendor_name: string;
  category_name: string;
  is_featured: boolean;
  images: ApiProductImage[];
  created_at: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
};

export function ProductCatalog() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { userLocation, radius, setRadius } = useMap();

  // Estados Visor
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewDescription, setPreviewDescription] = useState('');

  // Función para abrir la previsualización de una imagen en grande
  const openPreview = (url: string, title: string , description: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
    setPreviewDescription(description);
  };

  const handleReserve = async (productId: number) => {
    if (!window.confirm("¿Deseas reservar este producto para recogerlo en tienda?")) return;
    try {
      await api.post('orders/', { product_id: productId });
      toast.success("¡Reserva realizada con éxito! Revisa tu panel para ver los detalles.");
      loadData(userLocation?.lat, userLocation?.lng);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Error al realizar la reserva.");
    }
  };

  /**
   * Gestiona la adición de un producto al carrito local.
   */
  const handleAddToCart = (p: ApiProduct) => {
    const mainImage = p.images?.find((img) => img.is_main)?.url_image || p.images?.[0]?.url_image;
    addToCart({
      id: p.id.toString(),
      name: p.name,
      price: parseFloat(p.price),
      quantity: 1,
      image: mainImage,
      vendorId: '1', // Placeholder: El backend debería proveer el ID del vendedor en el futuro
      vendorName: p.vendor_name
    });
    toast.success(`${p.name} añadido al carrito`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  /**
   * Carga los datos de productos y categorías desde la API.
   * Si se proporcionan coordenadas, prioriza la búsqueda por cercanía geográfica.
   */
  async function loadData(lat?: number, lng?: number) {
    try {
      setLoading(true);
      setError(null);
      
      let prodUrl = "products/catalog/";
      if (lat && lng) {
         prodUrl = `products/nearby/?lat=${lat}&lng=${lng}&radius=100`; // Cargamos todo para calcular
      }

      const [prodRes, catRes] = await Promise.all([
        api.get(prodUrl),
        api.get("products/get-categories/")
      ]);

      // Si viene de geo, el formato es distinto (lista de vendedores con distancia)
      // Ajustamos para que funcione con el catálogo
      let prods = prodRes.data.results || prodRes.data;
      
      if (lat && lng && Array.isArray(prods)) {
         // Transformamos el formato de nearby_vendors al formato de catálogo si es necesario
      }

      setProducts(prods);
      setCategories(catRes.data.results || catRes.data);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(userLocation?.lat, userLocation?.lng);
  }, [userLocation]);

  // Filtrado reactivo basado en categoría seleccionada y radio de distancia
  const filteredProducts = products.filter(p => {
    const categoryMatch = !selectedCategory || p.category_name === selectedCategory;
    const distanceMatch = radius === 0 || (p.distance !== undefined && p.distance <= radius);
    return categoryMatch && distanceMatch;
  });

  if (loading) return (
    <div className="flex justify-center p-20 font-[var(--main-font)]">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-20 text-red-500 font-[var(--main-font)]">
      <p>Error: {error}</p>
      <Button color="gray" className="mt-4 mx-auto" onClick={() => loadData()}>Reintentar</Button>
    </div>
  );

  return (
    <section className="catalog font-[var(--main-font)]">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Catálogo de Productos</h2>
            <p className="text-gray-500 mt-2 text-lg">Descubre productos únicos cerca de ti.</p>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
             {userLocation && (
               <div className="flex items-center gap-2 mt-2">
                  <Label htmlFor="radius" value="Filtrar por distancia:" className="text-xs whitespace-nowrap"/>
                  <Select id="radius" sizing="sm" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))}>
                     <option value={0}>Cualquier distancia</option>
                     <option value={5}>Menos de 5 km</option>
                     <option value={10}>Menos de 10 km</option>
                     <option value={20}>Menos de 20 km</option>
                  </Select>
               </div>
             )}
          </div>
        </div>
        
        {/* Filtros de Categoría */}
        <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              selectedCategory === null 
              ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.name 
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog__grid">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 italic bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            No se encontraron productos con estos filtros.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const mainImage = p.images?.find((img) => img.is_main)?.url_image || p.images?.[0]?.url_image;
            const isOutOfStock = p.stock <= 0;
            const isNotAvailable = p.status !== 'ACTIVE';
            const canPurchase = !isOutOfStock && !isNotAvailable;
            
            return (
              <article key={p.id} className={`product-card group hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100 bg-white ${!canPurchase ? 'opacity-75 grayscale-[0.3]' : ''}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {mainImage ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                      src={mainImage}
                      alt={p.name}
                      onClick={() => openPreview(mainImage, p.name)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                      Sin imagen
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                    {p.category_name && (
                      <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                        {p.category_name}
                      </div>
                    )}
                    {isOutOfStock ? (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-red-500/30">
                        Agotado
                      </div>
                    ) : isNotAvailable ? (
                      <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-amber-500/30">
                        Reservado
                      </div>
                    ) : null}
                  </div>
                  
                  {p.distance !== undefined && (
                    <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1 z-20">
                      <Icon icon="solar:map-point-linear" />
                      {p.distance} km
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 flex-1">{p.name}</h3>
                  </div>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                    {p.description}
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                    <div className="text-xl font-black text-primary">
                      ${parseFloat(p.price).toLocaleString()}
                    </div>
                    <div className="flex gap-2 w-full max-w-[140px]">
                        <button
                          className="bg-gray-50 text-gray-400 p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-gray-100 shadow-sm"
                          title="Ver detalle completo"
                          onClick={() => navigate(`/app/products/${p.id}`)}
                        >
                          <Icon icon="solar:eye-linear" height={22}/>
                        </button>
                        
                        <button
                          disabled={!canPurchase}
                          className={`p-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs font-black flex-1 uppercase tracking-tight ${
                            canPurchase 
                            ? 'bg-primary text-white hover:bg-indigo-700 shadow-primary/20 cursor-pointer active:scale-95' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed grayscale'
                          }`}
                          onClick={() => handleAddToCart(p)}
                          title={!canPurchase ? "No disponible para compra" : "Añadir al carrito"}
                        >
                          <Icon icon={canPurchase ? "solar:cart-plus-bold-duotone" : "solar:cart-cross-linear"} height={22}/>
                          <span>{canPurchase ? "Añadir" : "No disponible"}</span>
                        </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Visor de Imágenes */}
      <ImagePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        imageUrl={previewUrl} 
        title={previewTitle} 
        description={previewDescription}
      />
    </section>
  );
}