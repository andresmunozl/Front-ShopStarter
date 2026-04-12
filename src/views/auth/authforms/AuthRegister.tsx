import { Button, Label, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import api from "../../../utils/axios";

const AuthRegister = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<'CLIENTE' | 'VENDEDOR'>('CLIENTE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        role: 'CLIENTE',
        full_name: '',
        phone_number: '',
        document_type: 'CC',
        document_number: '',
        birth_date: '',
        expedition_date: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (id === 'role') setRole(value as any);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Filtrar datos para no enviar cadenas vacías en campos que el backend podría validar (como fechas)
            const dataToSend = { ...formData };
            if (role === 'CLIENTE') {
                const clientFields = ['username', 'email', 'password', 'password_confirm', 'role'];
                Object.keys(dataToSend).forEach(key => {
                    if (!clientFields.includes(key)) {
                        delete (dataToSend as any)[key];
                    }
                });
            }

            const response = await api.post('/users/auth/register/', dataToSend);
            if (response.status === 201) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                navigate("/auth/login");
            }
        } catch (err: any) {
            console.error("Error de Registro:", err.response?.data);
            const backendErrors = err.response?.data;
            
            if (backendErrors && typeof backendErrors === 'object') {
                // Convertir objeto de errores { field: [msg] } a string legible
                const messages = Object.entries(backendErrors)
                    .map(([field, msgs]) => {
                        const message = Array.isArray(msgs) ? msgs[0] : msgs;
                        return `${field}: ${message}`;
                    })
                    .join(" | ");
                setError(messages);
            } else {
                setError(err.response?.data?.message || "Ocurrió un error inesperado durante el registro.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username" value="Nombre de Usuario" />
                        </div>
                        <TextInput id="username" type="text" required value={formData.username} onChange={handleChange} className="form-rounded-xl" />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Correo Electrónico" />
                        </div>
                        <TextInput id="email" type="email" required value={formData.email} onChange={handleChange} className="form-rounded-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Contraseña" />
                        </div>
                        <TextInput id="password" type="password" required value={formData.password} onChange={handleChange} className="form-rounded-xl" />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password_confirm" value="Confirmar Contraseña" />
                        </div>
                        <TextInput id="password_confirm" type="password" required value={formData.password_confirm} onChange={handleChange} className="form-rounded-xl" />
                    </div>
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="role" value="Deseo registrarme como" />
                    </div>
                    <Select id="role" required value={formData.role} onChange={handleChange}>
                        <option value="CLIENTE">Cliente (Comprador)</option>
                        <option value="VENDEDOR">Vendedor (Negocio)</option>
                    </Select>
                </div>

                {/* Campos condicionales para Vendedor */}
                {role === 'VENDEDOR' && (
                    <div className="animate-fade-in space-y-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-bold text-primary">Información del Negocio / Legal</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="full_name" value="Nombre Completo / Razón Social" />
                                </div>
                                <TextInput id="full_name" type="text" required value={formData.full_name} onChange={handleChange} className="form-rounded-xl" />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="phone_number" value="Teléfono" />
                                </div>
                                <TextInput id="phone_number" type="text" required value={formData.phone_number} onChange={handleChange} className="form-rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="document_type" value="Tipo de Documento" />
                                </div>
                                <Select id="document_type" required value={formData.document_type} onChange={handleChange}>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                    <option value="NIT">NIT</option>
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="document_number" value="Número de Documento" />
                                </div>
                                <TextInput id="document_number" type="text" required value={formData.document_number} onChange={handleChange} className="form-rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="birth_date" value="Fecha de Nacimiento" />
                                </div>
                                <TextInput id="birth_date" type="date" required value={formData.birth_date} onChange={handleChange} className="form-rounded-xl" />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="expedition_date" value="Fecha de Expedición del Documento" />
                                </div>
                                <TextInput id="expedition_date" type="date" required value={formData.expedition_date} onChange={handleChange} className="form-rounded-xl" />
                            </div>
                        </div>
                    </div>
                )}

                <Button color={'primary'} type="submit" disabled={loading} className="w-full mt-4">
                    {loading ? "Registrando..." : "Completar Registro"}
                </Button>
            </form>
        </div>
    )
}

export default AuthRegister;