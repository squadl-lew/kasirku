import { NavLink } from "react-router";

const menus = [
  { to: "/", label: "Dashboard", icon: "fa-gauge-high", end: true },
  { to: "/kasir", label: "Kasir", icon: "fa-cash-register", end: false },
  { to: "/produk", label: "Produk", icon: "fa-boxes-stacked", end: false },
  { to: "/restok", label: "Restok", icon: "fa-truck-ramp-box", end: false },
  { to: "/pengeluaran", label: "Pengeluaran", icon: "fa-money-bill-wave", end: false },
  { to: "/laporan", label: "Laporan", icon: "fa-chart-line", end: false },
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-4 dark:border-neutral-800">
        <i className="fas fa-store text-xl text-green-600"></i>
        {!collapsed && (
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            KasirKu
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            end={menu.end}
            title={menu.label}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
              }`
            }
          >
            <i className={`fas ${menu.icon} w-5 text-center`}></i>
            {!collapsed && <span>{menu.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
