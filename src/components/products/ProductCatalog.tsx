import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AddProductButton } from "./AddProductButton";
import { aiService, SmartSearchFilters } from "../../services/aiService";
import "./ProductCatalog.css";

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

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  vendor: string;
};

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  // 🧠 Smart Search AI state
  const [searchQuery, setSearchQuery] = useState("");
  const [aiFilters, setAiFilters] = useState<SmartSearchFilters | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // /api/catalog/ es público (AllowAny) — no requiere token
        const res = await fetch("http://127.0.0.1:8000/api/catalog/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // La vista usa PageNumberPagination → devuelve { count, results: [...] }
        const json = await res.json();
        const data: ApiProduct[] = json.results ?? json;

        const mapped: Product[] = data.map((p) => {
          const mainImage = p.images?.find((img) => img.is_main)?.url_image;
          const fallbackImage = p.images?.[0]?.url_image;

          return {
            id: p.id,
            title: p.name,
            price: Number(p.price),
            category: p.category_name,
            image: mainImage ?? fallbackImage ?? "",
            vendor: p.vendor_name,
          };
        });

        if (!cancelled) setProducts(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id: number) {
    const token = localStorage.getItem("access_token");
    const authHeaders: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar el producto");
    } finally {
      setDeleteId(null);
    }
  }

  // 🧠 Filtro aplicado sobre los productos
  const filteredProducts = products.filter((p) => {
    if (!aiFilters) return true;
    const matchCat = aiFilters.categoria
      ? p.category.toLowerCase().includes(aiFilters.categoria.toLowerCase())
      : true;
    const matchPrice = aiFilters.precio_max !== null
      ? p.price <= aiFilters.precio_max
      : true;
    return matchCat && matchPrice;
  });

  async function handleSmartSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) { setAiFilters(null); return; }
    setSearchLoading(true);
    try {
      const res = await aiService.smartSearch(searchQuery);
      if (res.success) setAiFilters(res.data.filters);
    } catch {
      // Silently fail, show all products
    } finally {
      setSearchLoading(false);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setAiFilters(null);
  }

  if (loading) return <p className="catalog__status">Cargando catálogo...</p>;
  if (error) return <p className="catalog__status catalog__status--error">Error: {error}</p>;

  return (
    <section className="catalog">

      {/* ── Header: título + botón agregar ── */}
      <div className="catalog__header">
        <h2 className="catalog__title">Catálogo</h2>
        <AddProductButton />
      </div>

      {/* 🧠 Barra de búsqueda inteligente */}
      <form className="catalog__search-form" onSubmit={handleSmartSearch}>
        <div className="catalog__search-wrap">
          <input
            id="smart-search-input"
            type="text"
            className="catalog__search-input"
            placeholder='Busca en lenguaje natural... ej: "ropa barata" o "comida cerca"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            id="smart-search-btn"
            type="submit"
            className={`catalog__search-btn${searchLoading ? " catalog__search-btn--loading" : ""}`}
            disabled={searchLoading}
          >
            {searchLoading ? "Buscando..." : "🧠 Buscar"}
          </button>
          {aiFilters && (
            <button type="button" className="catalog__search-clear" onClick={clearSearch} title="Limpiar filtros">
              ×
            </button>
          )}
        </div>
        {aiFilters && (
          <div className="catalog__ai-badges">
            {aiFilters.categoria && <span className="catalog__ai-badge">🏷️ {aiFilters.categoria}</span>}
            {aiFilters.precio_max !== null && <span className="catalog__ai-badge">💰 máx. ${aiFilters.precio_max}</span>}
            {aiFilters.cerca && <span className="catalog__ai-badge">📍 Cerca de ti</span>}
            <span className="catalog__ai-badge catalog__ai-badge--count">{filteredProducts.length} resultado(s)</span>
          </div>
        )}
      </form>

      <div className="catalog__grid">
        {filteredProducts.map((p) => (
          <article key={p.id} className="product-card">

            <div className="product-card__vendor">{p.vendor}</div>

            <div className="product-card__imageWrap">
              {p.image ? (
                <img
                  className="product-card__image"
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                />
              ) : (
                <div className="product-card__image product-card__image--empty">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="product-card__category">{p.category}</div>
            <div className="product-card__price">${p.price.toFixed(2)}</div>
            <div className="product-card__title">{p.title}</div>

            <div className="product-card__footer">
              <button
                className="product-card__delete-btn"
                onClick={() => setDeleteId(p.id)}
                title="Eliminar producto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Eliminar
              </button>

              <button
                className="product-card__view-btn"
                onClick={() => navigate(`/products/${p.id}`)}
                title="Ver detalle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Ver
              </button>
            </div>

          </article>
        ))}
      </div>

      {/* ── Modal de confirmación ── */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal__question">¿Quieres eliminar este producto?</p>
            <div className="modal__actions">
              <button
                className="modal__btn modal__btn--yes"
                onClick={() => handleDelete(deleteId)}
              >
                Sí
              </button>
              <button
                className="modal__btn modal__btn--no"
                onClick={() => setDeleteId(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}