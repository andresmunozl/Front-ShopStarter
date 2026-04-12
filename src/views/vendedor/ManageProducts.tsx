import React from 'react';
import { ProductTable } from '../../components/tables/ProductTable';

const ManageProducts = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Gestión de Productos</h1>
        <p className="text-gray-500 dark:text-gray-400">Administra, edita y añade nuevos productos a tu catálogo.</p>
      </div>
      <ProductTable />
    </div>
  );
};

export default ManageProducts;
