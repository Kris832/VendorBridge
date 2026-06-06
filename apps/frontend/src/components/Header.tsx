import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VB</span>
          </div>
          <span className="font-bold text-lg text-gray-900">VendorBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/vendors" className="text-gray-600 hover:text-gray-900">
            Vendors
          </Link>
          <Link to="/rfq" className="text-gray-600 hover:text-gray-900">
            RFQ
          </Link>
          <Link to="/quotations" className="text-gray-600 hover:text-gray-900">
            Quotations
          </Link>
          <Link to="/purchase-orders" className="text-gray-600 hover:text-gray-900">
            Purchase Orders
          </Link>
          <Link to="/invoices" className="text-gray-600 hover:text-gray-900">
            Invoices
          </Link>
          <Link to="/reports" className="text-gray-600 hover:text-gray-900">
            Reports
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Bell size={20} />
          </button>
          <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900">
            <User size={20} />
          </Link>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut size={20} />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/vendors"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Vendors
            </Link>
            <Link
              to="/rfq"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              RFQ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
