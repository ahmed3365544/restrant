import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryName, setCategoryName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('حدث خطأ أثناء جلب التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error('يرجى إدخال اسم التصنيف');
      return;
    }

    try {
      if (isEditing && editingId) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({ name: categoryName })
          .eq('id', editingId);

        if (error) {
          throw error;
        }

        toast.success('تم تحديث التصنيف بنجاح');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([{ name: categoryName }]);

        if (error) {
          throw error;
        }

        toast.success('تم إضافة التصنيف بنجاح');
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('حدث خطأ أثناء حفظ التصنيف');
    }
  };

  const handleEdit = (category: Category) => {
    setCategoryName(category.name);
    setIsEditing(true);
    setEditingId(category.id);
  };

  const handleDelete = async (id: number) => {
    // Check if category has menu items
    try {
      const { count, error } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);

      if (error) {
        throw error;
      }

      if (count && count > 0) {
        toast.error('لا يمكن حذف هذا التصنيف لأنه يحتوي على أصناف');
        return;
      }

      if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
        return;
      }

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      toast.success('تم حذف التصنيف بنجاح');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('حدث خطأ أثناء حذف التصنيف');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">إدارة التصنيفات</h1>
        
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </h2>
          
          <form onSubmit={handleSubmit} className="flex items-end">
            <div className="flex-grow">
              <label htmlFor="categoryName" className="block text-gray-700 mb-2">
                اسم التصنيف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            
            <div className="flex mr-4 space-x-2 rtl:space-x-reverse">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                {isEditing ? 'تحديث' : (
                  <>
                    <Plus size={20} className="ml-2" />
                    إضافة
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-800">قائمة التصنيفات</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : categories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {categories.map(category => (
                <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <span className="text-gray-800">{category.name}</span>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-gray-500">
              لا توجد تصنيفات متاحة
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Categories;