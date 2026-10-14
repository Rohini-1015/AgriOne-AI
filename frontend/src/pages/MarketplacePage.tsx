import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  ShoppingCart,
  MapPin,
  Calendar,
  Check,
  Plus,
  ArrowRight,
  Filter,
  User,
  Phone,
  Tag,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Fruits', 'Spices', 'CashCrop'];

export const MarketplacePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search) params.append('search', search);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data.products || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct Farm-to-Buyer Marketplace Exchange</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('navMarketplace')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'விவசாயிகளிடமிருந்து நேரடியாக அறுவடை செய்யப்பட்ட தரமான தானியங்கள், காய்கறிகள் மற்றும் பழங்களை வாங்குங்கள்.'
              : 'Direct peer-to-peer produce procurement connecting registered agricultural producers with wholesale and retail buyers.'}
          </p>
        </div>

        {user?.role === 'FARMER' && (
          <a
            href="/my-listings"
            className="agri-btn-primary text-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய விளைபொருள் பதிவேற்று' : 'Create Farm Listing'}</span>
          </a>
        )}
      </div>

      {/* Filter and Category Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="grow relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search produce name, description, village location..."
              className="agri-input pl-10"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Listings Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner message="Querying live agricultural marketplace inventory..." />
        </div>
      ) : products.length === 0 ? (
        <div className="agri-panel p-12 text-center text-xs text-slate-500">
          No produce listings found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <div key={product.id} className="agri-panel overflow-hidden flex flex-col group hover:shadow-panel transition-all">
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                  {product.category}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200/60">
                  {product.availableQuantity} {product.unit} left
                </span>
              </div>

              <div className="p-4 flex flex-col grow space-y-2.5">
                <div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-sm text-slate-900 line-clamp-1 hover:text-emerald-700 cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-lg font-black text-emerald-700">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">/ {product.unit}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed grow font-normal">
                  {product.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{product.location}</span>
                  </span>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="agri-btn-outline text-xs px-3 py-2"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`grow py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs ${
                      addedId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{t('addToCart')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || 'Produce Details'}
        maxWidth="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200">
              <img
                src={selectedProduct.imageUrl || ''}
                alt={selectedProduct.name}
                className="w-full h-52 object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white">
                {selectedProduct.category}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-2xl font-black text-emerald-700">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold"> / {selectedProduct.unit}</span>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {selectedProduct.availableQuantity} {selectedProduct.unit} in stock
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                Product Description
              </span>
              <p className="leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <p>
                <span className="font-bold text-slate-900">Farmer / Producer:</span> {selectedProduct.sellerName || 'Selvam Murugan'}
              </p>
              <p>
                <span className="font-bold text-slate-900">Farm Location:</span> {selectedProduct.location}, {selectedProduct.district}, {selectedProduct.state}
              </p>
              <p>
                <span className="font-bold text-slate-900">Contact Number:</span> +91 {selectedProduct.sellerMobile || '9876543210'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                handleAddToCart(selectedProduct);
                setSelectedProduct(null);
              }}
              className="w-full py-3 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('addToCart')}</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
