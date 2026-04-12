import { Button, Label, Modal, Select, Spinner, Table, TextInput } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";

type Category = {
  id: number;
  name: string;
  description?: string;
  emoji?: string;
  isActive?: boolean;
};

const CATEGORY_EMOJIS = [
  "🛍️", "🍔", "📚", "🎮", "💄", "🏡", "⚽", "🐶", "💻", "🎵", "👕", "👟", "⌚", "🕶️", "Cap", "🧸", "🍼", "🧴", "🧼", "🪑", "🛏️", "🍎", "🥗", "🍕", "☕", "🧃", "🍰", "💊", "🩺", "🧠", "🌿", "🚗", "🏍️", "🚲", "✈️", "🏨", "🎬", "📷", "🎨", "🧩", "🎧", "📱", "🖥️", "🕹️", "🔌", "🔋", "🐱", "🐠", "🌸", "🌱", "🧰", "🔧", "🪴", "🕯️", "🎁", "💼", "📦", "🗂️",
];

const EMOJI_CHOICES = Array.from(new Set([...CATEGORY_EMOJIS]));

interface CategoryProps {
  selectedCategoryId?: number | string;
  onChange?: (categoryId: string) => void;
  showAdminManagement?: boolean;
}

const CategoryComponent: React.FC<CategoryProps> = ({ selectedCategoryId, onChange, showAdminManagement = false }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "🛍️"
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Admin gets full list, others get public list
      const endpoint = isAdmin ? '/products/categories/admin/' : '/products/get-categories/';
      const res = await api.get(endpoint);
      setCategories(res.data.results || res.data);
    } catch (err) {
      setError("Error al cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [isAdmin]);

  const handleOpenModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        description: cat.description || "",
        emoji: cat.emoji || "🛍️"
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        emoji: "🛍️"
      });
    }
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingCategory) {
        await api.put(`/products/categories/admin/${editingCategory.id}/`, formData);
      } else {
        await api.post('/products/categories/admin/', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert("Error al guardar la categoría.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await api.delete(`/products/categories/admin/${id}/`);
      fetchCategories();
    } catch (err) {
      alert("Error al eliminar la categoría.");
    }
  };

  if (loading && categories.length === 0) return <Spinner />;

  // ADMIN VIEW (Management)
  if (isAdmin && showAdminManagement) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Gestión de Categorías</h2>
          <Button color="success" onClick={() => handleOpenModal()}>
            <Icon icon="mdi:plus" className="mr-2 h-4 w-4" /> Agregar Categoría
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable className="text-center">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Categoría</Table.HeadCell>
              <Table.HeadCell>Descripción</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {categories.map((cat) => (
                <Table.Row key={cat.id}>
                  <Table.Cell>{cat.id}</Table.Cell>
                  <Table.Cell>
                    <span className="flex items-center justify-center gap-2">
                       <span>{cat.emoji || '🛍️'}</span>
                       {cat.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{cat.description || '-'}</Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center gap-2 text-sm italic">
                      <Button size="xs" color="gray" outline onClick={() => handleOpenModal(cat)}>
                         <Icon icon="mdi:pencil" className="mr-1" /> Editar
                      </Button>
                      <Button size="xs" color="failure" outline onClick={() => handleDelete(cat.id)}>
                         <Icon icon="mdi:trash-can" className="mr-1" /> Borrar
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Modal for Create/Edit */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header>{editingCategory ? "Actualizar" : "Crear"} Categoría</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
               <div>
                  <Label value="Nombre" />
                  <TextInput 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Tecnología"
                  />
               </div>
               <div>
                  <Label value="Selecciona un Emoji" />
                  <div className="grid grid-cols-8 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                    {EMOJI_CHOICES.map(em => (
                      <button 
                        key={em}
                        type="button"
                        onClick={() => setFormData({...formData, emoji: em})}
                        className={`p-2 text-xl rounded-md transition-all ${formData.emoji === em ? 'bg-primary/20 scale-110 border border-primary' : 'hover:bg-gray-100'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
               </div>
               <div>
                  <Label value="Descripción" />
                  <TextInput 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
               </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
             <Button color="success" onClick={handleCreateOrUpdate}>Guardar</Button>
             <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  // PUBLIC VIEW (Selection)
  return (
    <div className="flex flex-col gap-2">
      <Label value="Categoría" />
      <Select 
        value={selectedCategoryId || ""} 
        onChange={(e) => onChange && onChange(e.target.value)}
        required
      >
        <option value="" disabled>-- Seleccionar Categoría --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.emoji || '🛍️'} {cat.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default CategoryComponent;
