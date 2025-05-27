import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 dir-rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">مطعم شواية</h3>
            <p className="text-gray-300 mb-4">
              نقدم ألذ الوجبات العربية الشهية بأفضل المكونات الطازجة والنكهات الأصيلة.
            </p>
            <div className="flex items-center mt-4">
              <Phone size={18} className="ml-2" />
              <span>01099940030</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
            <div className="flex items-center mb-2">
              <Clock size={18} className="ml-2" />
              <span>الأحد - الخميس: 10:00 ص - 11:00 م</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="ml-2" />
              <span>الجمعة - السبت: 10:00 ص - 12:00 ص</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">العنوان</h3>
            <div className="flex items-start">
              <MapPin size={18} className="ml-2 mt-1" />
              <span>ش المحافظة بجوار الفانوس</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} مطعم شواية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;