import { Badge, Dropdown, Progress, Table, Spinner, Button, Modal, Label, TextInput, Select, Textarea, FileInput } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../utils/axios";
import ImagePreviewModal from "../shared/ImagePreviewModal";

interface Product {
  id: string | number;
  name: string;
  price: number;
  status: string;
  stock: number;
  category_name: string;
  images: Array<{ url_image: string; is_main: boolean }>;
}

interface Category {
  id: string | number;
  name: string;
}

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const navigate = useNavigate();

  // Estados para el visor de imágenes
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_file: null as File | null
  });

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('products/create/');
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('products/get-categories/');
      console.log("Categorías cargadas:", response.data);

      let cats: Category[] = [];
      const data = response.data;

      if (Array.isArray(data)) {
        cats = data;
      } else if (data && data.results && Array.isArray(data.results)) {
        cats = data.results;
      }

      setCategories(cats);
      if (cats.length === 0) {
        console.warn("La lista de categorías está vacía en el servidor.");
      }
    } catch (error: any) {
      console.error("Error crítico al cargar categorías:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    try {
      await api.delete(`products/create/${id}/`);
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Hubo un error al eliminar el producto.");
    }
  };

  const handleEdit = (product: Product) => {
    // Buscamos el ID coherente con el nombre de la categoría que viene del backend
    const categoryMatch = categories.find(c => c.name === product.category_name);

    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      description: '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: categoryMatch ? categoryMatch.id.toString() : '',
      image_file: null // Reseteamos al editar
    });
    setShowModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data: any = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: parseInt(newProduct.category),
        // No forzamos status — el backend lo asigna como PENDING por defecto
      };

      if (newProduct.image_file) {
        const base64 = await toBase64(newProduct.image_file);
        data.images = [{ url_image: base64, is_main: true }];
      } else if (!editingId) {
        alert("La imagen es obligatoria.");
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await api.put(`products/create/${editingId}/`, data);
      } else {
        await api.post('products/create/', data);
      }

      setShowModal(false);
      setEditingId(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_file: null
      });
      fetchProducts();
    } catch (error) {
      console.error("Error al procesar producto:", error);
      alert("Error al procesar el producto. Revisa los datos.");
    } finally {
      setSubmitting(false);
    }
  };

  /*Table Action*/
  const tableActionData = [
    {
      icon: "solar:eye-outline",
      listtitle: "Ver Detalle",
    },
    {
      icon: "solar:pen-new-square-broken",
      listtitle: "Editar",
    },
    {
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Borrar",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center p-10 font-[var(--main-font)]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <div className="flex justify-between items-center mb-4 font-[var(--main-font)]">
          
          <div className="flex gap-2">
            <Button color="primary" onClick={() => {
              setEditingId(null);
              setNewProduct({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: '',
                image_file: null
              });
              setShowModal(true);
            }}>
              <div className="flex items-center gap-2">
                <Icon icon="solar:add-circle-outline" height={20} />
                <span>Añadir Producto</span>
              </div>
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <div className="overflow-x-auto font-[var(--main-font)]">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Producto</Table.HeadCell>
                <Table.HeadCell>Categoría</Table.HeadCell>
                <Table.HeadCell>Precio / Stock</Table.HeadCell>
                <Table.HeadCell>Estado</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {products.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-10 opacity-50">
                      No hay productos registrados aún.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  products.map((product, index) => (
                    <Table.Row key={product.id || index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <img
                            src={product.images?.[0]?.url_image || "https://placehold.co/60x60?text=PS"}
                            alt="product"
                            className="h-[60px] w-[60px] rounded-md object-cover shadow-sm bg-gray-50 cursor-zoom-in"
                            onClick={() => openPreview(product.images?.[0]?.url_image || "https://placehold.co/60x60?text=PS", product.name)}
                          />
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm font-semibold">{product.name}</h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="info" className="capitalize">
                          {product.category_name || 'Sin categoría'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <h5 className="text-base font-bold text-wrap">
                          ${parseFloat(product.price.toString()).toLocaleString()}
                        </h5>
                        <div className="text-xs font-medium text-dark opacity-70 mb-2">
                          Stock: {product.stock} unidades
                        </div>
                        <div className="me-5">
                          <Progress
                            progress={product.stock > 0 ? 100 : 0}
                            color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'red'}
                            size={"sm"}
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={product.status === 'ACTIVE' ? 'success' : 'lightsecondary'}
                          className="uppercase"
                        >
                          {product.status || 'SIN ESTADO'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Dropdown
                          label=""
                          dismissOnClick={true}
                          renderTrigger={() => (
                            <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                              <HiOutlineDotsVertical size={22} />
                            </span>
                          )}
                        >
                          {tableActionData.map((items, index) => (
                            <Dropdown.Item
                              key={index}
                              className="flex gap-3"
                              onClick={() => {
                                if (items.listtitle === "Borrar") {
                                  handleDelete(product.id);
                                } else if (items.listtitle === "Editar") {
                                  handleEdit(product);
                                } else if (items.listtitle === "Ver Detalle") {
                                  navigate(`/app/products/${product.id}`);
                                }
                              }}
                            >
                              <Icon icon={`${items.icon}`} height={18} />
                              <span>{items.listtitle}</span>
                            </Dropdown.Item>
                          ))}
                        </Dropdown>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal para añadir producto */}
      <Modal show={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} size="md">
        <Modal.Header>{editingId ? 'Editar Producto' : 'Añadir Nuevo Producto'}</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4" onSubmit={handleCreate}>
            <div>
              <Label htmlFor="name" value="Nombre del Producto" />
              <TextInput
                id="name"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description" value="Descripción" />
              <Textarea
                id="description"
                required
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" value="Precio" />
                <TextInput
                  id="price"
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="stock" value="Stock" />
                <TextInput
                  id="stock"
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category" value="Categoría" />
              <Select
                id="category"
                required
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="image" value="Imagen del Producto" />
              <FileInput
                id="image"
                accept="image/*"
                required={!editingId}
                helperText="Selecciona una foto real de tu producto."
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setNewProduct({ ...newProduct, image_file: e.target.files[0] });
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button color="gray" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button color="primary" type="submit" disabled={submitting}>
                {submitting ? <Spinner size="sm" /> : 'Guardar Producto'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewUrl}
        title={previewTitle}
      />
    </>
  );
};

export { ProductTable };