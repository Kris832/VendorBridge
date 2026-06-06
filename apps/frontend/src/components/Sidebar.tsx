import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Vendors', path: '/vendors', icon: '🏢' },
    { label: 'RFQ', path: '/rfq', icon: '📄' },
    { label: 'Quotations', path: '/quotations', icon: '💰' },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: '📋' },
    { label: 'Invoices', path: '/invoices', icon: '🧾' },
    { label: 'Reports', path: '/reports', icon: '📈' },
  ];

  return (
    <aside className="hidden md:block w-64 bg-gray-900 text-white">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
