import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import { Utensils, ShoppingBag, Tag, Clock, Printer } from 'lucide-react';

interface OrderItem {
  id: number;
  order_id: number;
  item_name: string;
  quantity: number;
  price: number;
}

interface OrderType {
  id: number;
  customer_name: string;
  total_amount: number;
  created_at: string;
  status: string;
  items: OrderItem[];
}

interface StatsType {
  totalMenuItems: number;
  totalOrders: number;
  totalCategories: number;
  pendingOrders: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsType>({
    totalMenuItems: 0,
    totalOrders: 0,
    totalCategories: 0,
    pendingOrders: 0
  });

  const [recentOrders, setRecentOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          { count: menuItemsCount },
          { count: ordersCount },
          { count: categoriesCount },
          { count: pendingOrdersCount },
          { data: ordersData }
        ] = await Promise.all([
          supabase.from('menu_items').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalMenuItems: menuItemsCount || 0,
          totalOrders: ordersCount || 0,
          totalCategories: categoriesCount || 0,
          pendingOrders: pendingOrdersCount || 0
        });

        if (!ordersData) {
          setRecentOrders([]);
          setLoading(false);
          return;
        }

        const orderIds = ordersData.map(order => order.id);
        const { data: itemsData, error } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (error) {
          console.error('Error fetching order items:', error);
          setRecentOrders([]);
          setLoading(false);
          return;
        }

        const ordersWithItems = ordersData.map(order => ({
          ...order,
          items: itemsData?.filter(item => item.order_id === order.id) || []
        }));

        setRecentOrders(ordersWithItems);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const handlePrint = (order: OrderType) => {
    const itemsHtml = order.items.length > 0
      ? order.items.map(item => `
          <tr>
            <td style="padding: 6px; border: 1px solid #ccc;">${item.item_name}</td>
            <td style="padding: 6px; border: 1px solid #ccc; text-align: center;">${item.quantity}</td>
            <td style="padding: 6px; border: 1px solid #ccc; text-align: right;">${item.price.toFixed(2)} ج.م</td>
          </tr>
        `).join('')
      : `<tr><td colspan="3" style="padding: 6px; border: 1px solid #ccc; text-align: center;">لا توجد أصناف</td></tr>`;

    const htmlContent = `
      <html lang="ar" dir="rtl">
        <head>
          <title>طباعة الطلب #${order.id}</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>تفاصيل الطلب رقم #${order.id}</h1>
          <p><strong>اسم العميل:</strong> ${order.customer_name}</p>
          <p><strong>المبلغ الإجمالي:</strong> ${order.total_amount.toFixed(2)} ج.م</p>
          <p><strong>التاريخ:</strong> ${formatDate(order.created_at)}</p>
          <p><strong>الحالة:</strong> ${order.status === 'pending' ? 'قيد الانتظار' : order.status === 'completed' ? 'مكتمل' : 'ملغي'}</p>
          <hr />
          <h2>الأصناف</h2>
          <table>
            <thead>
              <tr>
                <th>اسم الصنف</th>
                <th>الكمية</th>
                <th>السعر</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=700,height=600');
    if (!printWindow) return;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">لوحة التحكم</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* إحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 rtl:space-x-reverse">
                <Utensils className="text-red-500" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-500">عدد الأصناف</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalMenuItems}</p>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 rtl:space-x-reverse">
                <ShoppingBag className="text-blue-500" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-500">عدد الطلبات</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 rtl:space-x-reverse">
                <Tag className="text-green-500" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-500">عدد الفئات</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 rtl:space-x-reverse">
                <Clock className="text-yellow-500" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-500">الطلبات المعلقة</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>

            {/* أحدث الطلبات */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-800">أحدث الطلبات</h2>
              </div>

              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم العميل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">طباعة</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{order.customer_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{order.total_amount.toFixed(2)} ج.م</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{formatDate(order.created_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            {order.status === 'pending' ? (
                              <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">قيد الانتظار</span>
                            ) : order.status === 'completed' ? (
                              <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">مكتمل</span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">ملغي</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button
                              onClick={() => handlePrint(order)}
                              title="طباعة الطلب"
                              className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                            >
                              <Printer size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-4 text-center text-gray-500">لا توجد طلبات لعرضها.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
