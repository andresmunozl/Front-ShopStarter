import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router";

const AuthRegister = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [role, setRole] = useState<"VENDEDOR" | "CLIENTE">("CLIENTE");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [documentType, setDocumentType] = useState<"CC" | "TI" | "CE">("CC");
    const [documentNumber, setDocumentNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [expeditionDate, setExpeditionDate] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (password !== passwordConfirm) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    password_confirm: passwordConfirm,
                    role,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    document_type: documentType,
                    document_number: documentNumber,
                    birth_date: birthDate || null,
                    expedition_date: expeditionDate || null,
                }),
            });

            // ✅ CAMBIO: parse seguro, evita crash cuando Django devuelve HTML en error 500
            const text = await res.text();
            let data: any = null;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("El servidor no devolvió JSON:", text);
                throw new Error(`Error del servidor (${res.status}). Revisa la consola del backend Django.`);
            }

            if (!res.ok) {
                const firstError =
                    data?.username?.[0] ||
                    data?.email?.[0] ||
                    data?.password?.[0] ||
                    data?.role?.[0] ||
                    data?.document_type?.[0] ||
                    data?.document_number?.[0] ||
                    data?.birth_date?.[0] ||
                    data?.expedition_date?.[0] ||
                    data?.non_field_errors?.[0] ||
                    data?.detail ||
                    "Error al registrarse";
                throw new Error(firstError);
            }

            navigate("/auth/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
                <div className="mb-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Username */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="username" value="Nombre de usuario" />
                </div>
                <TextInput
                    id="username"
                    type="text"
                    sizing="md"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario123"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Full Name */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="full_name" value="Nombre completo" />
                </div>
                <TextInput
                    id="full_name"
                    type="text"
                    sizing="md"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Email */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="emadd" value="Correo electrónico" />
                </div>
                <TextInput
                    id="emadd"
                    type="email"
                    sizing="md"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Password */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="userpwd" value="Contraseña" />
                </div>
                <TextInput
                    id="userpwd"
                    type="password"
                    sizing="md"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Confirm Password */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="confirmpwd" value="Confirmar contraseña" />
                </div>
                <TextInput
                    id="confirmpwd"
                    type="password"
                    sizing="md"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Rol */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="role" value="Tipo de cuenta" />
                </div>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "VENDEDOR" | "CLIENTE")}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                    <option value="CLIENTE">Cliente</option>
                    <option value="VENDEDOR">Vendedor</option>
                </select>
            </div>

            {/* Tipo de documento */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="document_type" value="Tipo de documento" />
                </div>
                <select
                    id="document_type"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as "CC" | "TI" | "CE")}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="CE">Cédula Extranjera (CE)</option>
                </select>
            </div>

            {/* Número de documento */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="document_number" value="Número de documento" />
                </div>
                <TextInput
                    id="document_number"
                    type="text"
                    sizing="md"
                    required
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="123456789"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Teléfono */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="phone_number" value="Número de teléfono" />
                </div>
                <TextInput
                    id="phone_number"
                    type="text"
                    sizing="md"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="3001234567"
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Fecha de nacimiento */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="birth_date" value="Fecha de nacimiento" />
                </div>
                <TextInput
                    id="birth_date"
                    type="date"
                    sizing="md"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="form-control form-rounded-xl"
                />
            </div>

            {/* Fecha de expedición */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="expedition_date" value="Fecha de expedición del documento" />
                </div>
                <TextInput
                    id="expedition_date"
                    type="date"
                    sizing="md"
                    value={expeditionDate}
                    onChange={(e) => setExpeditionDate(e.target.value)}
                    className="form-control form-rounded-xl"
                />
            </div>

            <Button
                color="primary"
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-xl mt-2"
            >
                {loading ? "Registrando..." : "Crear cuenta"}
            </Button>

        </form>
    );
};

export default AuthRegister;