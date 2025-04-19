import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  QrCode,
  PlusCircle,
  Layers,
  LayoutGrid,
  UserPlus,
  LogIn,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Products", icon: Home },
  { to: "/scan", label: "Scan QR", icon: QrCode },
  { to: "/categories", label: "Categories", icon: Layers },
  { to: "/subcategories", label: "Sub-Categories", icon: LayoutGrid },
  { to: "/create", label: "Add Product", icon: PlusCircle },
  { to: "/registration", label: "Registration", icon: UserPlus },
  { to: "/login", label: "Login", icon: LogIn },
];

const Sidbar = () => {
  return (
    <aside className="hidden md:block w-64 fixed top-16 left-0 h-[calc(100%-4rem)] bg-white shadow-lg border-r z-50">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidbar;
