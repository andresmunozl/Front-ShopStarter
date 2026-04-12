import { Card, Badge, Table, Button } from "flowbite-react";
import { HiOutlineCube, HiOutlineShoppingBag, HiOutlineTrendingUp, HiOutlineExternalLink } from 'react-icons/hi';
import VendorMap from "../../components/geo/VendorMap";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Panel de Gestión - Vendedor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenido de nuevo, revisa tus métricas de hoy.</p>
        </div>
        <div className="flex gap-2">
            <Badge color="success" size="lg" className="px-4 py-2">Estado: Activo</Badge>
            <Button size="sm" color="light" outline>
              <HiOutlineExternalLink className="mr-2 h-4 w-4" />
              Ver Perfil Público
            </Button>
        </div>
      </div>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary/5 dark:bg-primary/10 border-none shadow-none">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary text-white rounded-xl shadow-md">
              <HiOutlineCube size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Productos Activos</p>
              <p className="text-3xl font-bold text-dark dark:text-white">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/10 border-none shadow-none">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-green-500 text-white rounded-xl shadow-md">
              <HiOutlineShoppingBag size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos Hoy</p>
              <p className="text-3xl font-bold text-dark dark:text-white">5</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-none shadow-none">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-500 text-white rounded-xl shadow-md">
              <HiOutlineTrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas (7 días)</p>
              <p className="text-3xl font-bold text-dark dark:text-white">$1,250.00</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
                <h2 className="text-xl font-bold text-dark dark:text-white">Pedidos Recientes</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de tus últimas ventas.</p>
            </div>
            <Button size="xs" color="gray" outline>Exportar CSV</Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head className="bg-gray-50 dark:bg-dark-light">
                <Table.HeadCell>Orden ID</Table.HeadCell>
                <Table.HeadCell>Cliente</Table.HeadCell>
                <Table.HeadCell>Monto</Table.HeadCell>
                <Table.HeadCell>Estado de Pago</Table.HeadCell>
                <Table.HeadCell>Acción</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:bg-dark-light">
                  <Table.Cell className="font-bold text-dark dark:text-white">#ORD-1045</Table.Cell>
                  <Table.Cell>Juan Pérez</Table.Cell>
                  <Table.Cell className="font-medium">$45.00</Table.Cell>
                  <Table.Cell><Badge color="warning">Pendiente</Badge></Table.Cell>
                  <Table.Cell><button className="text-primary hover:underline text-sm font-medium">Ver detalles</button></Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:bg-dark-light">
                  <Table.Cell className="font-bold text-dark dark:text-white">#ORD-1044</Table.Cell>
                  <Table.Cell>Maria García</Table.Cell>
                  <Table.Cell className="font-medium">$89.50</Table.Cell>
                  <Table.Cell><Badge color="success">Pagado</Badge></Table.Cell>
                  <Table.Cell><button className="text-primary hover:underline text-sm font-medium">Ver detalles</button></Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:bg-dark-light">
                  <Table.Cell className="font-bold text-dark dark:text-white">#ORD-1043</Table.Cell>
                  <Table.Cell>Roberto Gómez</Table.Cell>
                  <Table.Cell className="font-medium">$12.99</Table.Cell>
                  <Table.Cell><Badge color="failure">Cancelado</Badge></Table.Cell>
                  <Table.Cell><button className="text-primary hover:underline text-sm font-medium">Ver detalles</button></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
