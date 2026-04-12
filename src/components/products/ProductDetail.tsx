import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../utils/axios";
import { Button, Spinner } from "flowbite-react";
import { Icon } from "@iconify/react";

type ProductImage = {
  id: number;
  url_image: string;
  is_main: boolean;
};

type ProductDetailData = {
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
  ACTIVE: "Disponible",
  RESERVED: "Reservado",
  DRAFT: "Borrador",
  INACTIVE: "Inactivo",
  PAUSED: "Pausado",
  OUT_OF_STOCK: "Sin stock",
  REJECTED: "Rechazado",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const loadProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products/${id}/`);
      setProduct(res.data);
      const mainIdx = res.data.images?.findIndex((img: ProductImage) => img.is_main) ?? 0;
      setActiveImg(mainIdx >= 0 ? mainIdx : 0);
    } catch (e: any) {
      setError(e.response?.data?.error || "No se pudo cargar el producto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleReserve = async () => {
    if (!product) return;
    if (!window.confirm(`¿Deseas reservar "${product.name}"? El producto será retirado del catálogo público para que puedas ir a recogerlo.`)) return;
    
    try {
      setReserving(true);
      await api.post('/orders/', { product_id: product.id });
      alert("¡Reserva realizada con éxito! Revisa la sección 'Mis Reservas' para más detalles.");
      navigate('/cliente/reservas');
    } catch (e: any) {
      alert(e.response?.data?.error || "Hubo un error al procesar tu reserva. Inténtalo de nuevo.");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner size="xl" /></div>;
  if (error) return <p className="p-8 text-red-500 text-center">Error: {error}</p>;
  if (!product) return null;

  const images = product.images ?? [];
  const currentImage = images[activeImg]?.url_image;

  return (
    <div className="rounded-2xl shadow-xl bg-white dark:bg-darkgray p-8 max-w-5xl mx-auto font-[var(--main-font)]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-primary hover:text-darkprimary transition-colors font-bold"
      >
        <Icon icon="solar:alt-arrow-left-linear" /> Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ── Imágenes ── */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark flex items-center justify-center min-h-[400px] border border-gray-100 shadow-inner">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain max-h-[400px] p-4"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                 <Icon icon="solar:gallery-wide-linear" height={48} />
                 <span className="text-sm mt-2">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(idx)}
                  className={`rounded-xl overflow-hidden border-2 transition-all w-20 h-20 shadow-sm ${idx === activeImg
                    ? "border-primary scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
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

        {/* ── Información ── */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {product.category_name}
            </span>
            {product.is_featured && (
              <span className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center">
                <Icon icon="solar:star-bold" className="mr-1" /> Destacado
              </span>
            )}
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
              product.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {STATUS_LABELS[product.status] ?? product.status}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-dark dark:text-white leading-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-primary">
              ${Number(product.price).toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm">COP</span>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed border-t pt-4">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-gray-50 dark:bg-dark p-4 rounded-2xl flex items-center gap-3">
              <Icon icon="solar:shop-2-linear" className="text-primary text-2xl" />
              <div>
                <p className="text-gray-400 text-xs">Vendedor</p>
                <p className="font-bold text-dark dark:text-white uppercase tracking-tighter">{product.vendor_name}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark p-4 rounded-2xl flex items-center gap-3">
              <Icon icon="solar:box-linear" className="text-primary text-2xl" />
              <div>
                <p className="text-gray-400 text-xs">Stock</p>
                <p className={`font-bold ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                  {product.stock === 0 ? "Sin stock" : `${product.stock} unidades`}
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Reserva */}
          <div className="mt-4">
            {product.status === 'ACTIVE' && product.stock > 0 ? (
              <Button 
                size="xl" 
                className="w-full font-black text-xl rounded-2xl shadow-lg ring-offset-2 transition-transform active:scale-95"
                gradientDuoTone="purpleToBlue"
                onClick={handleReserve}
                disabled={reserving}
              >
                {reserving ? <Spinner size="sm" className="mr-2" /> : <Icon icon="solar:calendar-mark-bold" className="mr-2 text-2xl" />}
                RESERVAR AHORA
              </Button>
            ) : product.status === 'RESERVED' ? (
              <Button size="xl" color="gray" disabled className="w-full rounded-2xl">
                PRODUCTO RESERVADO
              </Button>
            ) : (
              <Button size="xl" color="gray" disabled className="w-full rounded-2xl">
                NO DISPONIBLE
              </Button>
            )}
            <p className="text-center text-xs text-gray-400 mt-3 italic">
              * La reserva garantiza que el vendedor aparte el producto para ti por un tiempo limitado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}