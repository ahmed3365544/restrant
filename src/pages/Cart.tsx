import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">سلة التسوق</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-4">سلة التسوق فارغة</h2>
              <p className="text-gray-500 mb-6">يبدو أنك لم تضف أي أصناف إلى سلة التسوق بعد</p>
              <Link 
                to="/menu" 
                className="inline-block bg-red-600 text-white font-medium py-2 px-6 rounded-md hover:bg-red-700 transition-colors"
              >
                تصفح القائمة
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-800">
                  الأصناف ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 px-6">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-gray-700">المجموع:</span>
                  <span className="font-bold text-xl text-gray-900">{totalAmount.toFixed(2)} ج.م</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={clearCart}
                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors sm:w-1/3"
                  >
                    إفراغ السلة
                  </button>
                  
                  <Link
                    to="/checkout"
                    className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors text-center sm:w-2/3"
                  >
                    إتمام الطلب
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;