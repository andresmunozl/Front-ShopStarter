import { uniqueId } from "lodash";
export interface ChildItem { /* igual que antes */ }
export interface MenuItem { /* igual que antes */ }

const SidebarContent: MenuItem[] = [
  {
    heading: "heading.seller",
    children: [
      {
        name: "seller.dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/vendedor/dashboard",
      },
      {
        name: "seller.products",
        icon: "solar:cart-large-minimalistic-outline",
        id: uniqueId(),
        url: "/vendedor/productos",
      },
      {
        name: "seller.map",
        icon: "solar:map-point-line-duotone",
        id: uniqueId(),
        url: "/vendedor/mapa",
      },
      {
        name: "seller.orders",
        icon: "solar:calendar-mark-line-duotone",
        id: uniqueId(),
        url: "/vendedor/pedidos",
      },
      {
        name: "seller.reviews",
        icon: "solar:star-fall-2-outline",
        id: uniqueId(),
        url: "/vendedor/reseñas",
      },
    ],
  },
  {
    heading: "heading.client",
    children: [
      {
        name: "client.home",
        icon: "solar:home-2-outline",
        id: uniqueId(),
        url: "/cliente/home",
      },
      {
        name: "client.catalog",
        icon: "solar:shop-2-outline",
        id: uniqueId(),
        url: "/cliente/productos",
      },
      {
        name: "client.map",
        icon: "solar:map-point-line-duotone",
        id: uniqueId(),
        url: "/cliente/mapa",
      },
      {
        name: "client.reviews",
        icon: "solar:star-fall-2-outline",
        id: uniqueId(),
        url: "/cliente/reseñas",
      },
    ],
  },
  {
    heading: "heading.admin",
    children: [
      {
        name: "admin.dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/admin",
      },
      {
        name: "admin.productsApproval",
        icon: "solar:clipboard-check-outline",
        id: uniqueId(),
        url: "/admin/productos/aprobar",
      },
      {
        name: "admin.users",
        icon: "solar:users-group-two-rounded-outline",
        id: uniqueId(),
        url: "/admin/usuarios",
      },
      {
        name: "admin.categories",
        icon: "solar:layers-minimalistic-outline",
        id: uniqueId(),
        url: "/admin/categorias",
      },
    ],
  },
  {
    heading: "heading.system",
    children: [
      {
        name: "system.typography",
        icon: "solar:text-circle-outline",
        id: uniqueId(),
        url: "/ui/typography",
      },
      {
        name: "system.table",
        icon: "solar:bedside-table-3-linear",
        id: uniqueId(),
        url: "/ui/table",
      },
      {
        name: "system.form",
        icon: "solar:password-minimalistic-outline",
        id: uniqueId(),
        url: "/ui/form",
      },
      {
        name: "system.alert",
        icon: "solar:airbuds-case-charge-outline",
        id: uniqueId(),
        url: "/ui/alert",
      },
    ],
  },
];
export default SidebarContent;