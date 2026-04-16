import React, { useEffect, useState } from 'react';
import { Modal, Spinner, Card, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext'; // ADD THIS
import StarRating from '../StarRating/StarRating'; // ADD THIS
import api from '../../utils/axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  featured_image: string | null;
  category_name?: string;
}

interface VendorCatalogModalProps {
  vendorId: string | null;
  isOpen: boolean;
  onClose: () => void;
  vendorName?: string;
}

const VendorCatalogModal: React.FC<VendorCatalogModalProps> = ({ vendorId, isOpen, onClose, vendorName }) => {
  const { user, token } = useAuth(); // ADD THIS
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorProducts();
    }
  }, [isOpen, vendorId]);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      // Asume que la API pública paginada tiene resultados dentro de "results"
      const res = await api.get(`products/catalog/?vendor=${vendorId}`);
      if (res.data && res.data.results) {
        setProducts(res.data.results);
      } else {
        setProducts(res.data); // Por si no está paginado
      }
    } catch (error) {
      console.error("Error cargando el catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl" dismissible>
      <Modal.Header>
        Catálogo de <span className="text-primary">{vendorName || 'Vendedor'}</span>
      </Modal.Header>
      <Modal.Body className="bg-gray-50/50 dark:bg-dark-light">
        {vendorId && (
          <div className="mb-6">
            <StarRating
              vendorId={vendorId}
              interactive={!!user && user.role === 'CLIENTE'}
              token={token || undefined}
            />
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <Spinner size="xl" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
             <Icon icon="solar:box-minimalistic-broken" className="mx-auto text-gray-300 dark:text-gray-600 mb-4" height={60}/>
             <p className="text-gray-500">Este vendedor aún no ha publicado productos activos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 dark:bg-gray-800 -m-4 mb-4 rounded-t-lg overflow-hidden flex items-center justify-center">
                    {product.featured_image ? (
                        <img src={product.featured_image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <Icon icon="solar:camera-broken" className="text-gray-300" height={40}/>
                    )}
                </div>
                <Badge color="light" size="xs" className="w-fit mb-2">
                    {product.category_name || 'General'}
                </Badge>
                <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                  {product.name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 text-xs line-clamp-2 mt-1">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-black text-primary">${parseFloat(product.price.toString()).toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default VendorCatalogModal;
