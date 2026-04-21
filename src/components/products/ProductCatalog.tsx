import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Label, Select } from "flowbite-react";
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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { userLocation, radius, setRadius } = useMap();

  // Modal preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewProduct, setPreviewProduct] = useState<ApiProduct | null>(null);

  const openPreview = (product: ApiProduct, url: string) => {
    setPreviewProduct(product);
    setPreviewUrl(url);
    setIsPreviewOpen(true);
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

  const handleAddToCart = (p: ApiProduct) => {
    const mainImage = p.images?.find((img) => img.is_main)?.url_image || p.images?.[0]?.url_image;
    addToCart({
      id: p.id.toString(),
      name: p.name,
      price: parseFloat(p.price),
      quantity: 1,
      image: mainImage,
      vendorId: '1',
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

  async function loadData(lat?: number, lng?: number) {
    try {
      setLoading(true);
      setError(null);

      let prodUrl = "products/catalog/";
      if (lat && lng) {
        prodUrl = `products/nearby/?lat=${lat}&lng=${lng}&radius=100`;
      }

      const [prodRes, catRes] = await Promise.all([
        api.get(prodUrl),
        api.get("products/get-categories/")
      ]);

      let prods = prodRes.data.results || prodRes.data;
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
      {/* ... encabezados y filtros ... (puedes copiar los que ya tienes) */}

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
                      onClick={() => openPreview(p, mainImage)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                      Sin imagen
                    </div>
                  )}
                  {/* ... etiquetas y otros overlays ... */}
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
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewUrl}
        product={previewProduct ?? undefined}
      />
    </section>
  );
}