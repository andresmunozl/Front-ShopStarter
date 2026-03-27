import { useLocation } from "react-router-dom";

function ProgressBar() {

  const location = useLocation();

  const pasos = {
    "/": 1,
    "/paso2": 2,
    "/revision": 4
  };

  const pasoActual = pasos[location.pathname] || 1;

  const progreso = (pasoActual / 4) * 100;

  return (
    <>
      <div className="pasos">
        <div className={pasoActual === 1 ? "activo" : ""}>1</div>
        <div className={pasoActual === 2 ? "activo" : ""}>2</div>
        <div className={pasoActual === 3 ? "activo" : ""}>3</div>
        <div className={pasoActual === 4 ? "activo" : ""}>4</div>
      </div>

      <div className="barra-progreso">
        <div
          className="progreso"
          style={{ width: `${progreso}%` }}
        ></div>
      </div>
    </>
  );
}

export default ProgressBar;