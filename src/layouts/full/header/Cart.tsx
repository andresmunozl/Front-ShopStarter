import React, { useState } from 'react';
import { Drawer, Button, Badge } from 'flowbite-react';
import { useCart } from '../../../context/CartContext';
import { Icon as Iconify } from '@iconify/react';
import api from '../../../utils/axios';
import { useTranslation } from 'react-i18next'; // <-- Import

interface CartProps {
  variant?: "light" | "dark";
}

const Cart = ({ variant = "dark" }: CartProps) => {
  const isDark = variant === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const { t } = useTranslation('headerTrad'); // <-- Namespace para i18n

  const handleClose = () => setIsOpen(false);

  const handleCheckout = async () => {
      setLoading(true);
      try {
          const promises = cart.map((item: any) => api.post('orders/', { product_id: item.id }));
          await Promise.all(promises);
          clearCart();
          alert(t('orderSuccess'));  // Traducción
          setIsOpen(false);
      } catch (error) {
          console.error("Error al procesar la orden", error);
          alert(t('orderError'));    // Traducción
      } finally {
          setLoading(false);
      }
  };

  return (
    <>
      <div className="relative group/menu">
        <span
          onClick={() => setIsOpen(true)}
          className="h-10 w-10 rounded-full flex justify-center items-center cursor-pointer relative transition hover:text-primary hover:bg-lightprimary text-gray-600 dark:text-gray-300"
          aria-label="Shopping Cart"
        >
          <Iconify icon="solar:cart-large-2-linear" height={22} />
          {totalItems > 0 && (
            <Badge className="h-4 w-4 rounded-full absolute -end-1 -top-1 bg-primary text-white text-[10px] flex items-center justify-center p-0 border-2 border-white dark:border-dark">
              {totalItems}
            </Badge>
          )}
        </span>
      </div>

      <Drawer open={isOpen} onClose={handleClose} position="right" className="w-[400px] p-0 flex flex-col h-screen">
        {/* Encabezado del Carrito */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-darkgray">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('cartTitle')}</h3>
            <p className="text-xs text-gray-500">{t('cartProductsSelected', { count: totalItems })}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition">
            <Iconify icon="solar:close-circle-linear" height={24} className="text-gray-400" />
          </button>
        </div>

        {/* Contenido: Lista de productos o mensaje de carrito vacío */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-full mb-4">
                <Iconify icon="solar:cart-cross-outline" height={64} className="text-gray-300" />
              </div>
              <h4 className="text-base font-bold text-gray-700 dark:text-gray-200">{t('cartEmptyTitle')}</h4>
              <p className="text-sm text-gray-400 max-w-[200px] mt-2">
                {t('cartEmptyMessage')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="h-20 w-20 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <Iconify icon="solar:gallery-wide-outline" className="text-gray-300" height={32} />
                        </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title={t('cartRemove')}
                      >
                        <Iconify icon="solar:trash-bin-trash-outline" height={18} />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                      {t('sellerLabel', { vendor: item.vendorName })}
                    </span>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm font-bold text-primary">${item.price.toLocaleString()}</span>
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-lg p-1">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-md transition text-gray-500"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-md transition text-gray-500"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie de página: Resumen de precios y botones de acción */}
        {cart.length > 0 && (
          <div className="p-5 bg-white dark:bg-dark border-t border-gray-100 dark:border-gray-700 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm">{t('estimatedTotal')}</span>
              <span className="text-xl font-black text-dark dark:text-white">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
                <Button color="primary" className="w-full rounded-xl py-1 font-bold" onClick={handleCheckout} disabled={loading} isProcessing={loading}>
                    {loading ? t('processingOrder') : t('processPurchase')}
                </Button>
                <button 
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition underline underline-offset-4"
                >
                    {t('emptyCart')}
                </button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Cart;