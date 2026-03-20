import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://127.0.0.1:8000/api/products/read/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: ApiProduct[] = await res.json();

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
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="catalog__status">Cargando catálogo...</p>;
  if (error) return <p className="catalog__status catalog__status--error">Error: {error}</p>;

  return (
    <section className="catalog">
      <h2 className="catalog__title">Catálogo</h2>

      <div className="catalog__grid">
        {products.map((p) => (
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
          </article>
        ))}
      </div>
    </section>
  );
}