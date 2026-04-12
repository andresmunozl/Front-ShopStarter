import { useState } from "react";
import api from "src/utils/axios";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { Link, useNavigate } from "react-router";
import { useAuth } from "src/context/AuthContext";

const gradientStyle = {
  background:
    "linear-gradient(45deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMsg("Debes ingresar correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      // CORRECCIÓN: Ruta de API correcta
      const response = await api.post("/users/auth/login/", {
        email: cleanEmail,
        password,
      });

      const { access_token, user } = response.data;

      // Sincronizar con el Contexto Global (OBLIGATORIO)
      login(user, access_token);

      // Redirección profesional basada en ROL
      if (user.role === 'VENDEDOR') {
          navigate("/vendedor/dashboard");
      } else if (user.role === 'CLIENTE') {
          navigate("/cliente/home");
      } else {
          navigate("/");
      }

    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        // Capturar mensajes específicos del backend (como el de cuenta bloqueada o pendiente)
        const msg =
          data?.message || 
          data?.detail || 
          (typeof data === 'string' ? data : null) ||
          "Credenciales inválidas. Verifica email y contraseña.";
        setErrorMsg(msg);
      } else if (error.request) {
        setErrorMsg("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
      } else {
        setErrorMsg("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full md:w-96 border-none">
          <div className="flex flex-col gap-2 p-0 w-full">
            <div className="mx-auto">
              <FullLogo />
            </div>

            <p className="text-sm text-center text-dark my-3">Acceso a ShopStarter</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@dominio.com"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-primary transition"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Contraseña</label>
                  <Link to="/auth/forgot-password"  className="text-primary text-xs font-medium">¿Olvidaste tu contraseña?</Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-primary transition"
                  autoComplete="current-password"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                Recordar este dispositivo
              </label>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-pulse">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-md py-2.5 font-bold hover:bg-indigo-700 transition disabled:opacity-60 shadow-md hover:shadow-lg mt-2"
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="flex gap-2 text-sm font-medium mt-6 items-center justify-center">
              <p className="text-gray-500">¿Nuevo en ShopStarter?</p>
              <Link to="/auth/register" className="text-primary font-bold hover:underline">
                Crea una cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;