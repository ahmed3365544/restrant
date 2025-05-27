import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem, useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`تمت إضافة ${item.name} إلى السلة`);
  };

  // Default placeholder image if none provided
  const imageUrl = item.image_url || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-red-600 font-bold">{item.price.toFixed(2)} ج.م</p>
        </div>
        
        {item.description && (
          <p className="text-gray-600 mt-2 text-sm">
            {item.description.length > 60 
              ? `${item.description.substring(0, 60)}...` 
              : item.description}
          </p>
        )}
        
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
        >
          <Plus size={18} className="ml-2" />
          <span>أضف إلى السلة</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;