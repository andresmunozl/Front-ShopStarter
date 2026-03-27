import { Badge, Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

import product1 from "/src/assets/images/products/dash-prd-1.jpg";
import product2 from "/src/assets/images/products/dash-prd-2.jpg";
import product3 from "/src/assets/images/products/dash-prd-3.jpg";
import product4 from "/src/assets/images/products/dash-prd-4.jpg";

// ✅ UUID = string
export interface VendorLocation {
  id: string;
  latitude: number;
  longitude: number;
  description?: string;
}

const ProductTable = () => {
  const [products, setProducts] = useState<VendorLocation[]>([]);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");

  const BASE_URL = "http://127.0.0.1:8000/api/geo/vendors-locations/";

  // 🔹 Traer todos
  const fetchAll = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setProducts(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Error al cargar datos");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔍 Buscar por ID (UUID)
  const fetchById = async () => {
    const cleanId = searchId.trim();

    if (!cleanId) {
      setMessage("Escribe un ID");
      return;
    }

    try {
     const res = await fetch(`${BASE_URL}${cleanId}/`);

      if (!res.ok) {
        setProducts([]);
        setMessage("ID no encontrado");
        return;
      }

      const data = await res.json();
      setProducts([data]);
      setMessage("");
    } catch (error) {
      console.error(error);
      setProducts([]);
      setMessage("Error en la búsqueda");
    }
  };

  // 🔹 DATA ORIGINAL (NO TOCAR)
  const ProductTableData = [
    {
      img: product1,
      name: "iPhone 13 pro max-Pacific Blue-128GB storage",
      payment: "$180",
      statuscolor: "secondary",
      statustext: "Confirmed",
    },
    {
      img: product2,
      name: "Apple MacBook Pro 13 inch-M1-8/256GB-space",
      payment: "$120",
      statuscolor: "success",
      statustext: "Confirmed",
    },
    {
      img: product3,
      name: "PlayStation 5 Controller",
      payment: "$120",
      statuscolor: "error",
      statustext: "Cancelled",
    },
    {
      img: product4,
      name: "Office Chair",
      payment: "$120",
      statuscolor: "secondary",
      statustext: "Confirmed",
    },
  ];

  const tableActionData = [
    { icon: "solar:add-circle-outline", listtitle: "Add" },
    { icon: "solar:pen-new-square-broken", listtitle: "Edit" },
    { icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete" },
  ];

  return (
    <>
      {/* 🔥 SECCIÓN SIMPLE */}
      <div className="mt-10 p-5 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-3">Ubicaciones</h3>

        {/* 🔍 BUSCADOR SIMPLE */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pega el ID aquí"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchById()}
            className="border p-2 mr-2"
          />

          <button onClick={fetchById} className="border p-2 mr-2">
            Buscar
          </button>

          <button onClick={fetchAll} className="border p-2">
            Mostrar todos
          </button>
        </div>

        {/* ⚠️ MENSAJES */}
        {message && <p style={{ color: "red" }}>{message}</p>}

        {/* 📋 RESULTADOS */}
        <ul>
          {products.length > 0 ? (
            products.map((item) => (
              <li key={item.id}>
                <strong>ID:</strong> {item.id} <br />
                Lat: {item.latitude} | Lng: {item.longitude}
              </li>
            ))
          ) : (
            !message && <li>No hay datos</li>
          )}
        </ul>
      </div>

      {/* 🔹 TABLA ORIGINAL */}
      <div className="rounded-xl shadow-md bg-white p-6 mt-6">
        <h5 className="card-title">Table</h5>

        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Products</Table.HeadCell>
              <Table.HeadCell>Payment</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {ProductTableData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.img}
                        alt=""
                        className="h-12 w-12 rounded"
                      />
                      {item.name}
                    </div>
                  </Table.Cell>

                  <Table.Cell>{item.payment}</Table.Cell>

                  <Table.Cell>
                   <Badge color={item.statuscolor}>
                      {item.statustext}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell>
                    <Dropdown
                      label=""
                      renderTrigger={() => (
                        <HiOutlineDotsVertical size={20} />
                      )}
                    >
                      {tableActionData.map((a, i) => (
                        <Dropdown.Item key={i}>
                          <Icon icon={a.icon} height={16} /> {a.listtitle}
                        </Dropdown.Item>
                      ))}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
};

export { ProductTable }; 