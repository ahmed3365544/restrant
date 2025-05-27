import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  // Default placeholder image if none provided
  const imageUrl = item.image_url || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg';

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mr-4 flex-1">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {item.price.toFixed(2)} ج.م × {item.quantity} = {(item.price * item.quantity).toFixed(2)} ج.م
        </p>
      </div>

      <div className="flex items-center">
        <button
          onClick={decreaseQuantity}
          className="text-gray-500 hover:text-red-600 p-1"
        >
          <Minus size={18} />
        </button>
        <span className="mx-2 text-gray-700 w-6 text-center">{item.quantity}</span>
        <button
          onClick={increaseQuantity}
          className="text-gray-500 hover:text-green-600 p-1"
        >
          <Plus size={18} />
        </button>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        className="mr-4 text-red-500 hover:text-red-700"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;