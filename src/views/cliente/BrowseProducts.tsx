import React from 'react';
import { ProductCatalog } from '../../components/products/ProductCatalog';

const BrowseProducts = () => {
  return (
    <div className="p-6">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-bold text-dark dark:text-white font-[Outfit]">Explorar Productos</h1>
        <p className="text-gray-500 dark:text-gray-400">Descubre productos increíbles de negocios cercanos.</p>
      </div>
      <ProductCatalog />
    </div>
  );
};

export default BrowseProducts;
