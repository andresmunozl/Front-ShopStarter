// src/components/products/ProductTable.tsx
import { Badge, Dropdown, Table } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";

import product1 from "/src/assets/images/products/dash-prd-1.jpg";
import product2 from "/src/assets/images/products/dash-prd-2.jpg";
import product3 from "/src/assets/images/products/dash-prd-3.jpg";
import product4 from "/src/assets/images/products/dash-prd-4.jpg";

// Datos para la tabla
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

const ProductTable = () => {
  return (
    <div className="rounded-xl shadow-md bg-white p-6 mt-6">
      <h5 className="card-title text-xl font-bold mb-4">Table</h5>

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
                    <img src={item.img} alt="" className="h-12 w-12 rounded" />
                    {item.name}
                  </div>
                </Table.Cell>

                <Table.Cell>{item.payment}</Table.Cell>

                <Table.Cell>
                  <Badge color={item.statuscolor}>{item.statustext}</Badge>
                </Table.Cell>

                <Table.Cell>
                  <Dropdown
                    label=""
                    renderTrigger={() => <HiOutlineDotsVertical size={20} />}
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
  );
};

export { ProductTable };