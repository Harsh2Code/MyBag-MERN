import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  UserRoundPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Offcanvas, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "Queries",
    label: "Queries",
    path: "/admin/queries",
    icon: <UserRoundPlus />
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <Nav className="flex-column mt-0 gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <Nav.Link
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen && setOpen(false);
          }}
          className="d-flex align-items-center gap-2 px-3 py-2 text-dark"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </Nav.Link>
      ))}
    </Nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Sidebar */}
      <Offcanvas show={open} onHide={() => setOpen(false)} placement="end">
        <Offcanvas.Header closeButton className="border-bottom justify-content-between">
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            <ChartNoAxesCombined size={40} />
            <h1 className="text-2xl h1 font-extrabold m-0">Admin</h1>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuItems setOpen={setOpen} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-flex flex-column border-start bg-light p-4 position-fixed start-0 top-0 h-100" style={{ width: '250px' }}>
        <div 
          onClick={() => navigate("/admin/dashboard")}
          className="d-flex align-items-center justify-content-center gap-2 mb-4 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold m-0">Admin</h1>
        </div>
        <MenuItems />
      </div>
    </>
  );
}

export default AdminSideBar;
