import { createContext, useState } from "react";

export const RegistroContext = createContext<any>(null);

export const RegistroProvider = ({ children }: any) => {

  const [registro, setRegistro] = useState({
  nombre: "",
  tipo_doc: "",
  numero_doc: "",
  fecha_nac: "",
  fecha_exp: "",
  correo: "",
  telefono: "",
  password: ""
});

  return (
    <RegistroContext.Provider value={{ registro, setRegistro }}>
      {children}
    </RegistroContext.Provider>
  );
};