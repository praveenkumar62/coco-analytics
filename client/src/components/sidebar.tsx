import { Link } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Coconut Info",
      href: "/coconut-info",
    },
    {
      label: "Users List",
      href: "/users-info",
    },
  ];

  return (
    <div aria-label="nav">
      <ul className="flex shadow-md">
        {menus.map((item) => (
          <Link
            to={item.href}
            className="px-4 py-2 text-sm text-gray-700 hover:text-blue-500 cursor-pointer"
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </ul>
    </div>
  );
}
