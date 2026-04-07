import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

type ProductImage = {
  id: number;
  url_image: string;
  is_main: boolean;
};

type ProductDetail = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  status: string;
  vendor_name: string;
  category_name: string;
  is_featured: boolean;
  images: ProductImage[];
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activo",
  DRAFT: "Borrador",
  INACTIVE: "Inactivo",
  PAUSED: "Pausado",
  OUT_OF_STOCK: "Sin stock",
  REJECTED: "Rechazado",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        // Usar /api/catalog/ en lugar de /api/products/ (que no permite GET público sin auth o no fue diseñado para eso)
        const res = await fetch(`http://127.0.0.1:8000/api/catalog/${id}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ProductDetail = await res.json();
        if (!cancelled) {
          setProduct(data);
          const mainIdx = data.images?.findIndex((img) => img.is_main) ?? 0;
          setActiveImg(mainIdx >= 0 ? mainIdx : 0);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className="p-8 text-center">Cargando producto...</p>;
  if (error) return <p className="p-8 text-red-500 text-center">Error: {error}</p>;
  if (!product) return null;

  const images = product.images ?? [];
  const currentImage = images[activeImg]?.url_image;

  return (
    <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline"
      >
        ← Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── Imágenes ── */}
        <div>
          <div
            className="rounded-xl overflow-hidden bg-lightgray dark:bg-dark flex items-center justify-center min-h-64"
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full object-contain max-h-72"
              />
            ) : (
              <span className="text-gray-400 text-sm">Sin imagen</span>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(idx)}
                  className={`rounded-lg overflow-hidden border-2 transition-all w-16 h-16 ${idx === activeImg
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img.url_image}
                    alt={`imagen-${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-lightprimary text-primary px-2 py-1 rounded-full font-medium">
              {product.category_name}
            </span>
            {product.is_featured && (
              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
                ⭐ Destacado
              </span>
            )}
            <span className="text-xs bg-lightgray dark:bg-dark text-gray-500 px-2 py-1 rounded-full">
              {STATUS_LABELS[product.status] ?? product.status}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-dark dark:text-white leading-tight">
          </h2>
          <p className="text-3xl font-semibold text-primary">
            ${Number(product.price).toFixed(2)}
          </p>

          {/* Descripción */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-lightgray dark:bg-dark rounded-lg p-3">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Vendedor</p>
              <p className="font-medium text-dark dark:text-white">{product.vendor_name}</p>
            </div>
            <div className="bg-lightgray dark:bg-dark rounded-lg p-3">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Stock</p>
              <p className={`font-medium ${product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
                {product.stock === 0 ? "Sin stock" : `${product.stock} unidades`}
              </p>
            </div>
            <div className="bg-lightgray dark:bg-dark rounded-lg p-3 col-span-2">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Publicado</p>
              <p className="font-medium text-dark dark:text-white">
                {new Date(product.created_at).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}