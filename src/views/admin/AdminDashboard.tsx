import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Select } from 'flowbite-react';
import api from '../../utils/axios';
import CategoryComponent from '../../components/categorias/category';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  is_active: boolean;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users (admin view)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/list/');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    try {
      await api.patch(`/users/${userId}/status/`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert("Error al cambiar el estado del usuario");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Sección de Categorías (Gestión Completa) */}
      <Card className="shadow-md border-t-4 border-t-primary">
         <CategoryComponent showAdminManagement={true} />
      </Card>

      {/* Users Section */}
      <Card className="shadow-md">
        <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Gestión de Usuarios</h2>
        <div className="overflow-x-auto">
          <Table hoverable className="text-center">
            <Table.Head className="bg-gray-50 dark:bg-dark-light">
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Usuario</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((u) => (
                <Table.Row key={u.id} className="bg-white dark:bg-dark-light">
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {u.email}
                  </Table.Cell>
                  <Table.Cell>{u.username}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'VENDEDOR' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      u.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {u.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center">
                      <Select
                        value={u.status}
                        onChange={(e) => handleUserStatusChange(u.id, e.target.value)}
                        className="w-40"
                        sizing="sm"
                      >
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="BLOCKED">Bloqueado</option>
                      </Select>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
