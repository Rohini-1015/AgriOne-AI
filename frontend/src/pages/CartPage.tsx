import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title={t('cartEmpty')}
          description="Browse fresh agricultural produce directly from verified local growers and add them to your procurement cart."
          actionLabel="Explore Marketplace"
          onAction={() => navigate('/marketplace')}
          icon={<ShoppingCart className="w-8 h-8 text-emerald-600" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'ஷாப்பிங் கூடை' : 'Procurement Cart'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {cartItems.length} commodities prepared for direct farm gate dispatch
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
        >
          {language === 'ta' ? 'கூடையைக் காலி செய்' : 'Clear All Items'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="agri-panel p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center space-x-3.5 grow min-w-0">
                <img
                  src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100'}
                  alt={item.product?.name}
                  className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {item.product?.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ₹{item.product?.price.toLocaleString()} / {item.product?.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right min-w-[80px] shrink-0">
                <span className="font-black text-sm sm:text-base text-emerald-700 block">
                  ₹{(item.subtotal || 0).toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-600 text-xs mt-1 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="agri-panel p-5 sm:p-6 space-y-4 sticky top-20">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 pb-2.5 border-b border-slate-100 uppercase tracking-wider">
              {t('orderSummary')}
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Farmer Handling</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>APMC Market Cess</span>
                <span className="text-slate-500 font-medium">Included</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700 text-base">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-3 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted PhonePe Sandbox Payment</span>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
        onSuccess={() => {
          setCheckoutOpen(false);
          navigate('/orders');
        }}
      />
    </div>
  );
};
