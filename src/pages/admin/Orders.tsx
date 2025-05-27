import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import { Search, Eye, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  notes: string | null;
}

interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item: {
    name: string;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [viewingDetails, setViewingDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('حدث خطأ أثناء جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          menu_item:menu_items(name)
        `)
        .eq('order_id', orderId);

      if (error) {
        throw error;
      }

      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast.error('حدث خطأ أثناء جلب تفاصيل الطلب');
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setViewingDetails(true);
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast.success(`تم تحديث حالة الطلب إلى "${status === 'completed' ? 'مكتمل' : 'ملغي'}"`);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const sendToWhatsApp = (order: Order) => {
    const phone = '201099940030'; // Add the country code
    
    const orderDetails = `
🍽️ طلب #${order.id} 🍽️

👤 معلومات العميل:
الاسم: ${order.customer_name}
الهاتف: ${order.customer_phone}
العنوان: ${order.customer_address || 'غير محدد'}

🛒 الطلب:
${orderItems.map(item => `- ${item.menu_item.name} (${item.quantity}) - ${(item.price * item.quantity).toFixed(2)} ج.م`).join('\n')}

💰 المجموع: ${order.total_amount.toFixed(2)} ج.م

📝 ملاحظات: ${order.notes || 'لا توجد ملاحظات'}
    `;
    
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_phone.includes(searchQuery) ||
    String(order.id).includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">إدارة الطلبات</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث عن طلب..."
              className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-md ${
                statusFilter === null 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              قيد الانتظار
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              مكتملة
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'cancelled' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              ملغية
            </button>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الطلب
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم العميل
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 direction-ltr">
                        {order.customer_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.total_amount.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {order.status === 'pending' ? 'قيد الانتظار' : 
                           order.status === 'completed' ? 'مكتمل' : 'ملغي'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900"
                            title="عرض التفاصيل"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="text-green-600 hover:text-green-900"
                                title="إكمال الطلب"
                              >
                                <Check size={18} />
                              </button>
                              
                              <button
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                                title="إلغاء الطلب"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              لا توجد طلبات متاحة
            </div>
          )}
        </div>
        
        {/* Order Details Modal */}
        {viewingDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-800">
                  تفاصيل الطلب #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setViewingDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">معلومات العميل</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><strong>الاسم:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>الهاتف:</strong> {selectedOrder.customer_phone}</p>
                    <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
                    {selectedOrder.notes && (
                      <p><strong>ملاحظات:</strong> {selectedOrder.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">الأصناف المطلوبة</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الصنف</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الكمية</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">السعر</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">المجموع</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orderItems.map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.menu_item?.name || 'صنف محذوف'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.price.toFixed(2)} ج.م
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {(item.price * item.quantity).toFixed(2)} ج.م
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            الإجمالي:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">
                            {selectedOrder.total_amount.toFixed(2)} ج.م
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">حالة الطلب</h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {selectedOrder.status === 'pending' ? 'قيد الانتظار' : 
                       selectedOrder.status === 'completed' ? 'مكتمل' : 'ملغي'}
                    </span>
                    
                    <span className="text-sm text-gray-500">
                      تم الطلب في {formatDate(selectedOrder.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    {selectedOrder.status === 'pending' && (
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          إكمال الطلب
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          إلغاء الطلب
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => sendToWhatsApp(selectedOrder)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    إرسال للواتساب
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;