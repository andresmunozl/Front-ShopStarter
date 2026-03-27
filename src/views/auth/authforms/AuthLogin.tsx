import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router";
import { useState } from "react";

const AuthLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      console.log("LOGIN:", data);

      if (response.ok) {
        // ✅ guardar token (MUY IMPORTANTE)
        localStorage.setItem("token", data.access);

        // ✅ redirigir al dashboard
        navigate("/");
      } else {
        alert("Credenciales incorrectas");
      }

    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="mb-4">
        <Label value="Correo" />
        <TextInput
          type="email"
          required
          value={form.email}
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />
      </div>

      <div className="mb-4">
        <Label value="Contraseña" />
        <TextInput
          type="password"
          required
          value={form.password}
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-white rounded-xl">
        Iniciar sesión
      </Button>

    </form>
  );
};

export default AuthLogin;