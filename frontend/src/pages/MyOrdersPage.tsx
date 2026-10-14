import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Phone
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Order } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.data.orders || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      await fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'PACKED':
      case 'CONFIRMED':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('navMyOrders')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'ta'
            ? 'உங்கள் விளைபொருள் கொள்முதல் மற்றும் விற்பனை ஆர்டர்களின் நேரடி கண்காணிப்பு.'
            : 'Live shipment status lifecycle, PhonePe payment reconciliations, and procurement records.'}
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner message="Retrieving orders and shipment statuses..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="agri-panel p-12 text-center space-y-3 border-dashed">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No agricultural orders recorded</h3>
          <p className="text-xs text-slate-500">Visit our marketplace to browse produce direct from local farmers.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map(order => {
            const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
            const isFarmerOrAdmin = user?.role === 'FARMER' || user?.role === 'ADMIN';

            return (
              <div key={order.id} className="agri-panel p-5 sm:p-6 space-y-4">
                {/* Order Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-900 block">
                      ORDER #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} by <strong className="text-slate-800">{order.buyerName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      PhonePe: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Status Stepper Progression */}
                <div className="hidden sm:grid grid-cols-5 gap-2 py-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    return (
                      <div key={step} className="text-center space-y-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                          }`}
                        />
                        <span className={`text-[10px] font-bold ${isCompleted ? 'text-emerald-800' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items in order */}
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.productName}</span>
                        <span className="text-[11px] text-slate-500">
                          {item.quantity} {item.unit} @ ₹{item.unitPrice}
                        </span>
                      </div>
                      <span className="font-extrabold text-sm text-slate-900">
                        ₹{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 space-y-0.5">
                    <p className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{order.deliveryAddress}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>+91 {order.contactPhone}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Grand Total</span>
                      <span className="text-lg font-black text-emerald-700">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* Status update buttons for seller / admin */}
                    {isFarmerOrAdmin && order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
                      <div className="flex items-center space-x-1 pl-3 border-l border-slate-200">
                        {order.orderStatus === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                            className="agri-btn-primary text-xs px-2.5 py-1.5"
                          >
                            Confirm Order
                          </button>
                        )}
                        {order.orderStatus === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'PACKED')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-700 text-white hover:bg-purple-800"
                          >
                            Pack Produce
                          </button>
                        )}
                        {order.orderStatus === 'PACKED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800"
                          >
                            Ship to Buyer
                          </button>
                        )}
                        {order.orderStatus === 'SHIPPED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
