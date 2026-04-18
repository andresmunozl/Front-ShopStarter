import React from 'react';
import { Modal } from 'flowbite-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  description?: string; // Agregado aquí
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title = "Vista previa de imagen",
  description = "DESCRIPCION DE LA IMAGEN" // Valor por defecto para la descripción,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="3xl" popup>
      <Modal.Header>
        <span className="p-4 font-bold text-gray-900 dark:text-white">{title}</span>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="flex flex-col items-center bg-gray-50 dark:bg-dark rounded-lg overflow-hidden pb-4">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[70vh] w-auto object-contain shadow-lg"
          />
          {/* Aquí se imprime la descripción en pantalla si existe */}
          {description && (
            <p className="mt-4 px-6 text-gray-700 dark:text-gray-300 text-center font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImagePreviewModal;