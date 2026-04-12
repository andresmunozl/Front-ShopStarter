import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./ProductCatalog.css";
import api from "../../utils/axios";

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
};

export function ProductCatalog() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleReserve = async (productId: number) => {
    if (!window.confirm("¿Deseas reservar este producto para recogerlo en tienda?")) return;
    try {
      await api.post('/orders/', { product_id: productId });
      alert("¡Reserva realizada con éxito! Revisa tu panel para ver los detalles.");
      const res = await api.get("/products/catalog/");
      setProducts(res.data.results || res.data);
    } catch (e: any) {
      alert(e.response?.data?.error || "Error al realizar la reserva.");
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [prodRes, catRes] = await Promise.all([
          api.get("/products/catalog/"),
          api.get("/products/get-categories/")
        ]);
        setProducts(prodRes.data.results || prodRes.data);
        setCategories(catRes.data.results || catRes.data);
      } catch (e: any) {
        setError(e.response?.data?.message || e.message || "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_name === selectedCategory)
    : products;

  if (loading) return (
    <div className="flex justify-center p-20 font-[var(--main-font)]">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-20 text-red-500 font-[var(--main-font)]">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <section className="catalog font-[var(--main-font)]">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Catálogo de Productos</h2>
        <p className="text-gray-500 mt-2 text-lg">Descubre productos únicos de vendedores locales cerca de ti.</p>
        
        {/* Filtros de Categoría */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
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
            No se encontraron productos en esta categoría.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const mainImage = p.images?.find((img) => img.is_main)?.url_image || p.images?.[0]?.url_image;
            
            return (
              <article key={p.id} className="product-card group hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100 bg-white">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {mainImage ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={mainImage}
                      alt={p.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                      Sin imagen
                    </div>
                  )}
                  {p.category_name && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                      {p.category_name}
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
                    <div className="flex gap-2">
                        <button
                          className="bg-white text-primary border border-primary p-2 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-2 text-sm font-bold"
                          onClick={() => navigate(`/products/${p.id}`)}
                        >
                          Detalles
                        </button>
                        <button
                          className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 text-sm font-bold"
                          onClick={() => handleReserve(p.id)}
                        >
                          Reservar
                        </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}