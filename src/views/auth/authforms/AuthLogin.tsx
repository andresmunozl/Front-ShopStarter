import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import api from "../../../utils/axios";

const AuthLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/users/auth/login/', { email, password });
            const { access_token, user } = response.data;
            
            // Guardar en el contexto global
            login(user, access_token);

            // Redirección profesional basada en ROL REAL del Backend
            if (user.role === 'VENDEDOR') {
                navigate("/vendedor/dashboard");
            } else if (user.role === 'CLIENTE') {
                navigate("/cliente/home");
            } else if (user.role === 'ADMIN') {
                navigate("/admin");
            }
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || err.response?.data?.non_field_errors?.[0] || "Credenciales inválidas o error de servidor.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} >
                {error && (
                    <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-lg font-medium">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="email" value="Correo Electrónico" />
                    </div>
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        sizing="md"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control form-rounded-xl"
                    />
                </div>
                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="password" value="Contraseña" />
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        sizing="md"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control form-rounded-xl"
                    />
                </div>
                <div className="flex justify-between my-5">
                    <div className="flex items-center gap-2">
                        <Checkbox id="accept" className="checkbox" />
                        <Label
                            htmlFor="accept"
                            className="opacity-90 font-normal cursor-pointer"
                        >
                            Recordar sesión
                        </Label>
                    </div>
                    <Link to={"/auth/forgot-password"} className="text-primary text-sm font-medium">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                <Button type="submit" color={"primary"} disabled={loading} className="w-full bg-primary text-white rounded-xl">
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
            </form>
        </>
    );
};

export default AuthLogin;
