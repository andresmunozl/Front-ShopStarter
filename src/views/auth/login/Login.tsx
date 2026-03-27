import AuthLogin from "../authforms/AuthLogin";
import { Link } from "react-router";

const gradientStyle = {
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  height: "100vh",
};

const Login = () => {
  return (
    <div style={gradientStyle} className="flex items-center justify-center h-screen">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* 🔥 LOGO PERSONALIZADO */}
        <div className="flex justify-center mb-4">
          <img
            src="/img/logo.png"
            alt="ShopStarter"
            className="w-32"
          />
        </div>

        {/* TITULO */}
        <h2 className="text-center text-xl font-semibold mb-2">
          Iniciar sesión
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Bienvenido a ShopStarter
        </p>

        {/* FORMULARIO */}
        <AuthLogin />

        {/* LINK REGISTER */}
        <div className="text-center mt-6 text-sm">
          <span className="text-gray-500">¿No tienes cuenta?</span>{" "}
          <Link to="/auth/register" className="text-primary font-semibold">
            Crear cuenta
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;