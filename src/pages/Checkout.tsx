import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface CustomerData {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

const Checkout: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const sendToWhatsApp = (orderDetails: string) => {
    const phone = '201099940030'; // Add the country code
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    
    if (!customerData.name || !customerData.phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerData.name,
          customer_phone: customerData.phone,
          customer_address: customerData.address,
          total_amount: totalAmount,
          notes: customerData.notes,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Prepare WhatsApp message
      const orderDetails = `
🍽️ طلب جديد #${order.id} 🍽️

👤 معلومات العميل:
الاسم: ${customerData.name}
الهاتف: ${customerData.phone}
العنوان: ${customerData.address || 'غير محدد'}

🛒 الطلب:
${cart.map(item => `- ${item.name} (${item.quantity}) - ${(item.price * item.quantity).toFixed(2)} ج.م`).join('\n')}

💰 المجموع: ${totalAmount.toFixed(2)} ج.م

📝 ملاحظات: ${customerData.notes || 'لا توجد ملاحظات'}
      `;
      
      // Send to WhatsApp
      sendToWhatsApp(orderDetails);
      
      // Clear cart and redirect
      clearCart();
      toast.success('تم إرسال طلبك بنجاح!');
      navigate('/');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to menu if cart is empty
  if (cart.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">إتمام الطلب</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Customer Form */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">معلومات العميل</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={customerData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="notes" className="block text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={customerData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري إرسال الطلب...
                      </span>
                    ) : 'إرسال الطلب'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-medium text-gray-800 mb-4">ملخص الطلب</h2>
                
                <div className="divide-y divide-gray-200">
                  {cart.map(item => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.name} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-700">{(item.price * item.quantity).toFixed(2)} ج.م</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع:</span>
                    <span>{totalAmount.toFixed(2)} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;