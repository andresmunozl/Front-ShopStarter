import { Card, Badge, Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineCube, HiOutlineLocationMarker } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import LocationPicker from "../../components/geo/LocationPicker";
import { CartesianGrid } from "recharts";

import {
  LineChart, Line, RadialBarChart, RadialBar, Legend,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {

  // 🔹 LOCATION STATE
  const [vendorLocation, setVendorLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 🔹 DASHBOARD SIMULATED DATA
  const [data, setData] = useState([
    { time: "Mañana", ventas: 20, pedidos: 5, usuarios: 10, ingresos: 100 },
    { time: "Tarde", ventas: 35, pedidos: 8, usuarios: 15, ingresos: 180 },
    { time: "Noche", ventas: 50, pedidos: 12, usuarios: 22, ingresos: 250 },
  ]);

  const [dataPedidos, setDataPedidos] = useState([
  { dia: "Lun", pedidos: 10 },
  { dia: "Mar", pedidos: 20 },
  { dia: "Mié", pedidos: 15 },
  { dia: "Jue", pedidos: 25 },
  { dia: "Vie", pedidos: 30 },
]);

const [dataUsuarios, setDataUsuarios] = useState([
  { mes: "Ene", usuarios: 50 },
  { mes: "Feb", usuarios: 70 },
  { mes: "Mar", usuarios: 65 },
  { mes: "Abr", usuarios: 90 },
  { mes: "May", usuarios: 120 },
  { mes: "Jun", usuarios: 140 },
  { mes: "Jul", usuarios: 130 },
  { mes: "Ago", usuarios: 150 },
  { mes: "Sep", usuarios: 160 },
  { mes: "Oct", usuarios: 170 },
  { mes: "Nov", usuarios: 180 },
  { mes: "Dic", usuarios: 200 },
]);

 const [dataEstado, setDataEstado] = useState([
  { estado: "Pendiente", pedidos: 10,  fill: "#f59e0b" },
  { estado: "Enviado", pedidos: 7, fill: "#0ba7f5" },
  { estado: "Entregado", pedidos: 20, fill: "#0bf53e" },
]);

{/* DATA VENTAS */}
  const ventasPie = [
  { name: "Mañana", value: data[0]?.ventas || 0 },
  { name: "Tarde", value: data[1]?.ventas || 0 },
  { name: "Noche", value: data[2]?.ventas || 0 },
];

  // 🔥 REALTIME SIMULATION EFFECT
useEffect(() => {
  const interval = setInterval(() => {
    setData([
      {
        time: "Mañana",
        ventas: Math.floor(Math.random() * 100),
        pedidos: Math.floor(Math.random() * 50),
        usuarios: Math.floor(Math.random() * 80),
        ingresos: Math.floor(Math.random() * 500),
      },
      {
        time: "Tarde",
        ventas: Math.floor(Math.random() * 100),
        pedidos: Math.floor(Math.random() * 50),
        usuarios: Math.floor(Math.random() * 80),
        ingresos: Math.floor(Math.random() * 500),
      },
      {
        time: "Noche",
        ventas: Math.floor(Math.random() * 100),
        pedidos: Math.floor(Math.random() * 50),
        usuarios: Math.floor(Math.random() * 80),
        ingresos: Math.floor(Math.random() * 500),
      },
    ]);
     // 🔄 Pedidos (SEMANA)
    setDataPedidos(prev =>
      prev.map(item => ({
        ...item,
        pedidos: Math.floor(Math.random() * 50),
      }))
    );

    // 🔄 Usuarios (MESES)
    setDataUsuarios(prev =>
      prev.map(item => ({
        ...item,
        usuarios: Math.floor(Math.random() * 200),
      }))
    );
     // 🔄 ESTADOS DE PEDIDOS
    setDataEstado(prev =>
      prev.map(item => ({
        ...item,
        pedidos: Math.floor(Math.random() * 30),
      }))
    );
  }, 3000);

  return () => clearInterval(interval);
}, []);


  // 🔹 LOCATION HANDLER (SIMULADO)
  const handleUpdateLocation = async (lat: number, lng: number) => {
    try {
      setSavingLocation(true);

      setVendorLocation({ lat, lng });
      setShowLocationModal(false);

      alert("Ubicación guardada");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLocation(false);
    }
  };

  return (
      
    <div className="p-2">

      {/* HEADER */}
      <Card className="p-7 mt-4 ">
        <Card className="bg-gray-600 text-black shadow-lg border border-gray-700">
      <div className="flex justify-between mb-8">
    
        <h1 className="mt-4 font-black text-3xl tracking-tight text-blue-400 flex items-center gap-3">
          <Icon icon="solar:chart-square-bold-duotone" width="32" className="text-blue-100" />
          ULTIMOS REGISTROS
        </h1>

        <Button className="bg-green-400 hover:bg-green-600 text-white" onClick={() => setShowLocationModal(true)}>
          <HiOutlineLocationMarker className="mr-2" />
          Ubicación
        </Button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-5">
       
        { /*ventas */}
        <Card className="bg-gray-100 p-9 shadow-md rounded-xl">
          <div className="flex gap-3 items-center">
             <Card className="w-[40px] h-[40px] p-0 bg-black border-none flex items-center justify-center overflow-hidden">
             <Icon icon="solar:box-bold" width="30" color="#3b10a8" />
            </Card>
            <div>
              <p className="font-black text-black text-2xl ">Ventas</p>
              <p className="font-black text-2xl tracking-tight">{data[data.length - 1].ventas}
              </p>
            </div>
          </div>
        </Card>
      
       { /* pedidos */}
        <Card  className="bg-gray-100 p-9 shadow-md rounded-xl">
          <div className="flex gap-3 items-center">
             <Card className="w-[40px] h-[40px] p-0 bg-black border-none flex items-center justify-center overflow-hidden">
            <Icon icon="solar:cart-bold" width="30" color="#da701f" />
             </Card>
             <div>
              <p className="font-black text-black  text-2xl ">Pedidos</p>
              <p className="font-black text-2xl tracking-tight">{data[data.length - 1].pedidos}</p>
            </div>
          </div>
        </Card>

       { /* usuarios */}
        <Card  className="bg-gray-100 p-9 shadow-md rounded-xl">
          <div className="flex gap-3 items-center">
            <Card className="w-[40px] h-[40px] p-0 bg-black border-none flex items-center justify-center overflow-hidden">
            <Icon icon="solar:users-group-rounded-bold" width="30" color="#b3177f" />
            </Card>
             <div>
              <p className="font-black text-black  text-2xl ">Usuarios</p>
              <p className="font-black text-2xl tracking-tight">{data[data.length - 1].usuarios}</p>
            </div>
          </div>
        </Card>

       { /* estados de pedidos */}
        <Card  className="bg-gray-100 p-9 shadow-md rounded-xl">
          <div className="flex gap-3 items-center">
             <Card className="w-[40px] h-[40px] p-0 bg-black border-none flex items-center justify-center overflow-hidden">
            <Icon icon="solar:chart-bold" width="30" color="#ce1a1a"/> </Card>
             <div>
              <p className="font-black text-black  text-2xl ">Estados cancelados</p>
              <p className="font-black text-2xl tracking-tight">{data[data.length - 1].ingresos}</p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  </Card>

   <div className="p-6 border-b"></div>

      {/* 🔥 4 GRÁFICAS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* VENTAS */}
        <Card>
            
          <Card className="bg-gray-600 text-black shadow-lg border border-gray-700">
          <h1 className="mb-2 font-black text-white text-2xl">Ventas</h1>
          <div className="my-1 h-[4px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <ResponsiveContainer width="100%" height={250}>
            
            <PieChart>
              <Pie
                data={ventasPie}   // 👈 DATA DIFERENTE
                dataKey="value"
                nameKey="name"
                innerRadius={60} 
                outerRadius={90}
                paddingAngle={5} // 🔥 separa las partes
                label={({ name, percent }: any) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              >
                <Cell fill="#7ca8ef" />
                <Cell fill="#f59e0b" />
                <Cell fill="#21c03e" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </Card>
        </Card>

        {/* PEDIDOS */}
        <Card>
          <h2 className="mb-2 font-black text-black text-2xl">
            Pedidos
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataPedidos}>

              {/* 🎨 GRADIENTE */}
              <defs>
                <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea882d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* 📊 EJE X */}
              <XAxis
                dataKey="dia"
                axisLine={{ stroke: "#111", strokeWidth: 2 }}
                tick={{ fill: "#111", fontWeight: "bold" }}
              />

              {/* 📊 EJE Y */}
              <YAxis
                axisLine={{ stroke: "#111", strokeWidth: 2 }}
                tick={{
                  fill: "#111",
                  fontWeight: "bold",
                  fontSize: 15
                }}
              />

              <Tooltip />

              {/* 📦 BARRA */}
              <Bar
                dataKey="pedidos"
                fill="url(#colorPedidos)"
                stroke="#ee7818"
                strokeWidth={2}
                barSize={90}
              />


            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* USUARIOS */}
        <Card>
          <h2 className="mb-2 font-black text-black text-2xl ">Usuarios</h2>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dataUsuarios}>

              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a21caf" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a21caf" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <XAxis 
                dataKey="mes"
                axisLine={{ stroke: "#7d4374", strokeWidth: 2 }}
                tick={{ fill: "#111", fontWeight: "bold" }}
              />

              <YAxis 
                axisLine={{ stroke: "#111", strokeWidth: 2}}
                 tick={{
                  fill: "#111",
                  fontWeight: "bold",
                  fontSize: 14
                }}
              />

              <Tooltip 
                contentStyle={{ borderRadius: "10px", border: "none" }}
              />

              <Area 
                type="monotone"
                dataKey="usuarios" 
                stroke="#a21caf"
                fill="url(#colorUsuarios)"
                strokeWidth={3}
              />

            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* ESTADOS DE PEDIDOS */}
     <Card>
      
 <Card className="bg-gray-600 text-black shadow-lg border border-gray-700">
  <h2 className="mb-2 font-black text-white text-2xl">
    Estado de Pedidos
  </h2>
  <div className="my-3 h-[3px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    <div className="flex justify-between w-full">
      <h2 className="mb-1 font-black text-green-400 text-left">Pendientes</h2>
      <h2 className="mb-1 font-black text-blue-400 text-center">Enviados</h2>
      <h2 className="mb-1 font-black text-yellow-400 text-right">Entregados</h2>
    </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={15}
          data={dataEstado}
        >

          <RadialBar
            dataKey="pedidos"// 🔥 ESTO FALTABA
            label={{ fill: "#ffffff", position: "insideStart" }}
          />

          <Legend />

          <Tooltip />
    

        </RadialBarChart>
      </ResponsiveContainer>
      </Card>
    </Card>
    </div>

      {/* MODAL UBICACIÓN */}
      <Modal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      >
        <Modal.Header>Ubicación</Modal.Header>

        <Modal.Body >
          <LocationPicker 
            onLocationSelected={(lat, lng) =>
              setVendorLocation({ lat, lng })
            }
          />
        </Modal.Body>

        <Modal.Footer >
          <Button className="bg-green-500 hover:bg-green-700 text-white"
            onClick={() =>
              handleUpdateLocation(
                vendorLocation?.lat || 0,
                vendorLocation?.lng || 0
              )
            }
            disabled={savingLocation}
          >
            {savingLocation ? <Spinner size="sm" /> : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Dashboard;