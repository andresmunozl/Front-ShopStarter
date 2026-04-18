import { Modal } from "flowbite-react";
import { ProductDetailData } from "donde/esta/definido"; // Pon el path real

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  product?: ProductDetailData;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  product,
}) => {
  if (!isOpen || !product) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl" popup>
      <Modal.Header>
        <span className="p-4 font-bold text-gray-900 dark:text-white">{product.name}</span>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-[300px] w-auto object-contain border shadow-lg mx-auto"
          />
          <div className="flex flex-col gap-2">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold uppercase">
              {product.category_name}
            </span>
            <span className="text-lg font-bold">{product.status}</span>
            <span className="text-3xl font-black text-primary">
              ${Number(product.price).toLocaleString()} <span className="text-base text-gray-400">COP</span>
            </span>
            <p className="text-md text-gray-700 mt-2">{product.description}</p>
            <p className="text-md">
              <span className="font-bold">Vendedor:</span> {product.vendor_name}
            </p>
            <p className="text-md">
              <span className="font-bold">Stock:</span> {product.stock}
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImagePreviewModal;