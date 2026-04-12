import React, { useEffect, useState } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Table, Badge, Button, Spinner } from "flowbite-react";
import api from "../../utils/axios";
import { Icon } from "@iconify/react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
}

interface Order {
  id: string;
  vendor_name: string;
  status: string;
  total: string;
  items: OrderItem[];
  created_at: string;
}

interface UserProfile {
  username: string;
  reputation_score: string;
}

const SamplePage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, userRes] = await Promise.all([
        api.get('/orders/'),
        api.get('/users/auth/me/')
      ]);
      setOrders(ordersRes.data.results || ordersRes.data);
      setUserProfile(userRes.data);
    } catch (error) {
       console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;
    try {
      await api.post(`/orders/${id}/cancel/`);
      alert("Reserva cancelada con éxito.");
      fetchData();
    } catch (error) {
       alert("Error al cancelar la reserva.");
    }
  };

  const handleReport = async (id: string) => {
    if (!window.confirm("¿Confirmas que el vendedor vendió el producto a otra persona? Esto activará una penalización para el vendedor.")) return;
    try {
      await api.post(`/orders/${id}/report_vendor/`);
      alert("Reporte enviado. Lamentamos el inconveniente.");
      fetchData();
    } catch (error) {
       alert("Error al enviar el reporte.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge color="warning">Pendiente</Badge>;
      case 'COMPLETED': return <Badge color="success">Completada</Badge>;
      case 'CANCELLED': return <Badge color="failure">Cancelada</Badge>;
      default: return <Badge color="gray">{status}</Badge>;
    }
  };

  return (
    <CardBox>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 font-[var(--main-font)] gap-4">
        <div>
          <h5 className="card-title text-2xl font-bold text-primary">Mis Reservas</h5>
          {userProfile && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 text-sm">Tu reputación como cliente:</span>
              <div className="flex items-center text-yellow-500 font-bold">
                <Icon icon="solar:star-bold" className="mr-1" />
                {parseFloat(userProfile.reputation_score).toFixed(1)}
              </div>
            </div>
          )}
        </div>
        <Button color="light" onClick={fetchData}>
           <Icon icon="solar:refresh-linear" className="mr-2" /> Actualizar
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Spinner size="xl" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center p-10 text-gray-500 italic bg-gray-50 rounded-xl">No tienes reservas activas en este momento.</div>
      ) : (
        <div className="overflow-x-auto font-[var(--main-font)]">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Fecha</Table.HeadCell>
              <Table.HeadCell>Producto</Table.HeadCell>
              <Table.HeadCell>Vendedor</Table.HeadCell>
              <Table.HeadCell>Monto</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orders.map((order) => (
                <Table.Row key={order.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {order.items.map(item => item.product_name).join(", ")}
                  </Table.Cell>
                  <Table.Cell>{order.vendor_name}</Table.Cell>
                  <Table.Cell className="font-bold text-primary">${parseFloat(order.total).toLocaleString()}</Table.Cell>
                  <Table.Cell>{getStatusBadge(order.status)}</Table.Cell>
                  <Table.Cell>
                    {order.status === 'PENDING' && (
                      <div className="flex gap-4">
                        <button 
                          className="text-red-500 hover:text-red-700 font-bold text-sm"
                          onClick={() => handleCancel(order.id)}
                        >
                          Cancelar
                        </button>
                        <button 
                          className="text-orange-600 hover:text-orange-800 font-bold text-sm border-l pl-4"
                          onClick={() => handleReport(order.id)}
                        >
                          Vendedor lo vendió a otro
                        </button>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </CardBox>
  );
};

export default SamplePage;
