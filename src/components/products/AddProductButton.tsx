import { useNavigate } from "react-router";

export function AddProductButton() {
    const navigate = useNavigate();

    return (
        <button
            className="add-product-btn"
            onClick={() => navigate("/products/add")}
            title="Agregar producto"
        >
            +
        </button>
    );
}