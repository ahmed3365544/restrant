import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuItemCard from '../components/MenuItemCard';
import { MenuItem } from '../context/CartContext';
import { ChevronLeft } from 'lucide-react';
import CartFooter from '../components/CartFooter';

const Home: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('id', { ascending: false })
          .limit(4);

        if (error) {
          throw error;
        }

        setFeaturedItems(data || []);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center" style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg')`,
          backgroundPosition: 'center 35%'
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              مطعم شواية
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
              تذوق أشهى المأكولات العربية المميزة
            </p>
            <Link 
              to="/menu" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
            >
              اطلب الآن
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Items Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">أشهر الأطباق</h2>
          <Link to="/menu" className="text-red-600 flex items-center hover:text-red-800 transition-colors">
            عرض القائمة كاملة
            <ChevronLeft size={20} className="mr-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">لماذا تختارنا؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">توصيل سريع</h3>
              <p className="text-gray-600">نوصل طلبك في أسرع وقت ممكن للحفاظ على طعم الوجبات</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">مكونات طازجة</h3>
              <p className="text-gray-600">نستخدم أفضل المكونات الطازجة لضمان جودة وطعم مميز</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">طلب سهل</h3>
              <p className="text-gray-600">اطلب بسهولة من خلال موقعنا أو عبر الواتساب مباشرة</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-red-600 rounded-lg overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">جرب ألذ الأطباق الآن</h2>
                <p className="text-white mb-6">اطلب الآن واستمتع بألذ الوجبات مع خدمة توصيل سريعة</p>
                <Link to="/menu" className="inline-block bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
                  اطلب الآن
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg" 
                alt="طعام شهي" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
           <CartFooter />
    </div>
  );
};

export default Home;