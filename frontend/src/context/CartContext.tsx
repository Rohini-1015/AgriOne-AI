import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  totalAmount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setTotalAmount(0);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.data) {
        setCartItems(res.data.data.items || []);
        setTotalAmount(res.data.data.totalAmount || 0);
      }
    } catch (err) {
      console.warn('Could not fetch cart items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      await api.post('/cart', { productId, quantity });
      await refreshCart();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding item to cart.');
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await api.put(`/cart/item/${cartItemId}`, { quantity });
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await api.delete(`/cart/item/${cartItemId}`);
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
      setTotalAmount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        totalAmount,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
