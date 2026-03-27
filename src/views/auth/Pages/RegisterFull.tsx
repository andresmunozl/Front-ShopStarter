import { useState } from "react";

const backgroundStyle = {
  background: "linear-gradient(135deg, #5f6af5, #8b5cf6)",
  height: "100vh",
};

function RegisterFull() {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nombre: "",
    tipo_doc: "",
    numero_doc: "",
    fecha_nac: "",
    fecha_exp: "",
    correo: "",
    telefono: "",
    password: "",
    confirmar: ""
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {

    if (form.password !== form.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.correo,
          password: form.password,
          first_name: form.nombre,
          last_name: "Usuario"
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(5);
      } else {
        alert("Error: " + JSON.stringify(data));
      }

    } catch (error) {
      alert("Error de conexión con el servidor");
    }

  };

  return (
    <div style={backgroundStyle} className="flex justify-center items-center min-h-screen">

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img src="/img/logo.png" alt="ShopStarter" className="h-16" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-1">
          Crear cuenta
        </h2>

        <p className="text-center text-gray-500 text-sm mb-4">
          Regístrate en ShopStarter
        </p>

        {/* PROGRESS */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            style={{ width: `${(step - 1) * 25}%` }}
          ></div>
        </div>

        {/* ================= PASO 1 ================= */}
        {step === 1 && (
          <>
            <div className="mb-3">
              <label className="text-sm text-gray-500">Nombre completo</label>
              <input
                className="w-full p-3 border rounded-full"
                placeholder="Ej: Juan Pérez"
                value={form.nombre}
                onChange={(e)=>setForm({...form, nombre:e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500">Tipo de documento</label>
              <select
                className="w-full p-3 border rounded-full"
                value={form.tipo_doc}
                onChange={(e)=>setForm({...form, tipo_doc:e.target.value})}
              >
                <option value="">Seleccione</option>
                <option value="cc">Cédula</option>
                <option value="ce">Extranjería</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500">Número de documento</label>
              <input
                className="w-full p-3 border rounded-full"
                placeholder="Ej: 123456789"
                value={form.numero_doc}
                onChange={(e)=>setForm({...form, numero_doc:e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500">Fecha de nacimiento</label>
              <input
                type="date"
                className="w-full p-3 border rounded-full"
                value={form.fecha_nac}
                onChange={(e)=>setForm({...form, fecha_nac:e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500">Fecha de expedición</label>
              <input
                type="date"
                className="w-full p-3 border rounded-full"
                value={form.fecha_exp}
                onChange={(e)=>setForm({...form, fecha_exp:e.target.value})}
              />
            </div>
          </>
        )}

        {/* ================= PASO 2 ================= */}
        {step === 2 && (
          <>
            <div className="mb-3">
              <label className="text-sm text-gray-500">Correo electrónico</label>
              <input
                className="w-full p-3 border rounded-full"
                placeholder="correo@email.com"
                value={form.correo}
                onChange={(e)=>setForm({...form, correo:e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500">Teléfono</label>
              <input
                className="w-full p-3 border rounded-full"
                placeholder="3001234567"
                value={form.telefono}
                onChange={(e)=>setForm({...form, telefono:e.target.value})}
              />
            </div>
          </>
        )}

        {/* ================= PASO 3 ================= */}
        {step === 3 && (
          <>
            <div className="mb-3">
              <label className="text-sm text-gray-500">Contraseña</label>
              <input
                type="password"
                className="w-full p-3 border rounded-full"
                placeholder="********"
                value={form.password}
                onChange={(e)=>setForm({...form, password:e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-500">Confirmar contraseña</label>
              <input
                type="password"
                className="w-full p-3 border rounded-full"
                placeholder="********"
                value={form.confirmar}
                onChange={(e)=>setForm({...form, confirmar:e.target.value})}
              />
            </div>
          </>
        )}

        {/* ================= PASO 4 ================= */}
        {step === 4 && (
          <div className="text-sm space-y-2">
            <p><b>Nombre:</b> {form.nombre}</p>
            <p><b>Documento:</b> {form.tipo_doc} - {form.numero_doc}</p>
            <p><b>Fecha nacimiento:</b> {form.fecha_nac}</p>
            <p><b>Correo:</b> {form.correo}</p>
            <p><b>Teléfono:</b> {form.telefono}</p>
          </div>
        )}

        {/* ================= PASO 5 ================= */}
        {step === 5 && (
          <div className="text-center">
            <h3 className="text-green-600 font-bold mb-3">
              🎉 Registro exitoso
            </h3>
            <p>Tu cuenta fue creada correctamente</p>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex justify-between mt-6">

          {step > 1 && step < 5 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 border rounded-full"
            >
              Atrás
            </button>
          )}

          {step < 4 && (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-2 text-white rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Continuar
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-2 text-white rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Confirmar
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default RegisterFull;