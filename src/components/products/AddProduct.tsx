import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/axios";
import "./ProductCatalog.css";

type Category = {
    id: number;
    name: string;
};

type Vendor = {
    id: string;
    username: string;
    role: string;
};

export default function AddProduct() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingVendors, setLoadingVendors] = useState(true);

    const [form, setForm] = useState({
        vendor: "",
        category: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "",
        is_featured: false,
        image1_url: "",
        image1_main: true,
        image2_url: "",
        image2_main: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        api.get("/products/get-categories/")
            .then((res) => {
                const data = res.data;
                setCategories(Array.isArray(data) ? data : data.results ?? []);
            })
            .catch(() => setCategories([]))
            .finally(() => setLoadingCats(false));
    }, []);

    useEffect(() => {
        api.get("/users/list/")
            .then((res) => {
                const data = res.data;
                const all: Vendor[] = Array.isArray(data) ? data : data.results ?? [];
                setVendors(all.filter((u) => u.role === "VENDEDOR"));
            })
            .catch(() => setVendors([]))
            .finally(() => setLoadingVendors(false));
    }, []);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const images: { url_image: string; is_main: boolean }[] = [];
        if (form.image1_url.trim())
            images.push({ url_image: form.image1_url.trim(), is_main: form.image1_main });
        if (form.image2_url.trim())
            images.push({ url_image: form.image2_url.trim(), is_main: form.image2_main });

        const body: Record<string, unknown> = {
            vendor: form.vendor,
            category: Number(form.category),
            name: form.name,
            description: form.description,
            price: form.price,
            stock: form.stock ? Number(form.stock) : 0,
            is_featured: form.is_featured,
            status: "ACTIVE",
        };
        if (images.length) body.images = images;

        try {
            await api.post("/products/create/", body);

            setSuccess(true);
            // ✅ Redirige al catálogo y cierra el formulario
            setTimeout(() => navigate("/products"), 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data 
                ? JSON.stringify(err.response.data, null, 2) 
                : (err.message || "Error desconocido");
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="add-product">

            <div className="add-product__header">
                <button className="add-product__back-btn" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
                <h1 className="add-product__title">Agregar producto</h1>
            </div>

            {success && (
                <div className="add-product__alert add-product__alert--success">
                    Producto creado correctamente. Redirigiendo al catálogo...
                </div>
            )}
            {error && (
                <div className="add-product__alert add-product__alert--error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="add-product__form">

                <div className="add-product__row">
                    <div className="add-product__field">
                        <label className="add-product__label">
                            Vendedor <span className="add-product__required">*</span>
                        </label>
                        {loadingVendors ? (
                            <p className="add-product__loading-text">Cargando vendedores...</p>
                        ) : (
                            <select
                                name="vendor"
                                value={form.vendor}
                                onChange={handleChange}
                                required
                                title="Selecciona un vendedor"
                                className="add-product__input"
                            >
                                <option value="">Selecciona un vendedor</option>
                                {vendors.map((v) => (
                                    <option key={v.id} value={v.id}>{v.username}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="add-product__field">
                        <label className="add-product__label">
                            Categoría <span className="add-product__required">*</span>
                        </label>
                        {loadingCats ? (
                            <p className="add-product__loading-text">Cargando categorías...</p>
                        ) : (
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                title="Selecciona una categoría"
                                className="add-product__input"
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="add-product__field">
                    <label className="add-product__label">
                        Nombre <span className="add-product__required">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Nombre del producto"
                        className="add-product__input"
                    />
                </div>

                <div className="add-product__field">
                    <label className="add-product__label">
                        Descripción <span className="add-product__required">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Descripción del producto"
                        className="add-product__input add-product__textarea"
                    />
                </div>

                <div className="add-product__row">
                    <div className="add-product__field">
                        <label className="add-product__label">
                            Precio <span className="add-product__required">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="add-product__input"
                        />
                    </div>
                    <div className="add-product__field">
                        <label className="add-product__label">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className="add-product__input"
                        />
                    </div>
                </div>

                <label className="add-product__checkbox-label">
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={form.is_featured}
                        onChange={handleChange}
                        className="add-product__checkbox"
                    />
                    Producto destacado
                </label>

                <div className="add-product__image-box">
                    <label className="add-product__label add-product__label--image">📷 Imagen 1</label>
                    <input
                        type="url"
                        name="image1_url"
                        value={form.image1_url}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen1.jpg"
                        className="add-product__input"
                    />
                    {form.image1_url && (
                        <img
                            src={form.image1_url}
                            alt="preview 1"
                            className="add-product__preview"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            onLoad={(e) => (e.currentTarget.style.display = "block")}
                        />
                    )}
                    <label className="add-product__checkbox-label add-product__checkbox-label--small">
                        <input
                            type="checkbox"
                            name="image1_main"
                            checked={form.image1_main}
                            onChange={handleChange}
                            className="add-product__checkbox"
                        />
                        Imagen principal
                    </label>
                </div>

                <div className="add-product__image-box">
                    <label className="add-product__label add-product__label--image">📷 Imagen 2</label>
                    <input
                        type="url"
                        name="image2_url"
                        value={form.image2_url}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen2.jpg"
                        className="add-product__input"
                    />
                    {form.image2_url && (
                        <img
                            src={form.image2_url}
                            alt="preview 2"
                            className="add-product__preview"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            onLoad={(e) => (e.currentTarget.style.display = "block")}
                        />
                    )}
                    <label className="add-product__checkbox-label add-product__checkbox-label--small">
                        <input
                            type="checkbox"
                            name="image2_main"
                            checked={form.image2_main}
                            onChange={handleChange}
                            className="add-product__checkbox"
                        />
                        Imagen principal
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`add-product__submit${loading ? " add-product__submit--loading" : ""}`}
                >
                    {loading ? "Guardando..." : "Crear producto"}
                </button>

            </form>
        </div>
    );
}