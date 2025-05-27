import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-red-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">مطعم شواية</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {isAdminRoute ? (
              <>
                <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                  لوحة التحكم
                </Link>
                <Link to="/admin/menu-items" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                  الأصناف
                </Link>
                <Link to="/admin/categories" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                  التصنيفات
                </Link>
                <Link to="/admin/orders" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                  الطلبات
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md hover:bg-red-700 transition"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                  الرئيسية
                </Link>
                <Link to="/menu" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                  القائمة
                </Link>
                {user ? (
                  <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                    <User size={20} />
                  </Link>
                ) : (
                  <Link to="/login" className="px-3 py-2 rounded-md hover:bg-red-700 transition">
                    <User size={20} />
                  </Link>
                )}
                <Link to="/cart" className="px-3 py-2 rounded-md hover:bg-red-700 transition relative">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {!isAdminRoute && (
              <Link to="/cart" className="px-3 py-2 rounded-md hover:bg-red-700 transition relative mr-2">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-red-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAdminRoute ? (
            <>
              <Link 
                to="/admin" 
                className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                لوحة التحكم
              </Link>
              <Link 
                to="/admin/menu-items" 
                className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                الأصناف
              </Link>
              <Link 
                to="/admin/categories" 
                className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                التصنيفات
              </Link>
              <Link 
                to="/admin/orders" 
                className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                الطلبات
              </Link>
              <button 
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-right px-3 py-2 rounded-md hover:bg-red-700 transition"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/menu" 
                className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                القائمة
              </Link>
              {user ? (
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  إدارة الموقع
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md hover:bg-red-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;