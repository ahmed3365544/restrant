// src/components/CartFooter.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartFooter = () => {
  const { totalAmount, totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-gray-800 text-lg font-semibold">
          إجمالي السلة: <span className="text-red-600">{totalAmount.toFixed(2)} ج.م</span>
        </div>
        <Link
          to="/cart"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition"
        >
          المتابعة إلى السلة
        </Link>
      </div>
    </div>
  );
};

export default CartFooter;
