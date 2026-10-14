import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, QrCode, Smartphone, Building } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalAmount: number;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(
    user ? `${user.village}, ${user.district}, ${user.state}` : ''
  );
  const [contactPhone, setContactPhone] = useState(user ? user.mobileNumber : '');
  const [step, setStep] = useState<'DETAILS' | 'PAYMENT_GATEWAY' | 'CONFIRMED'>('DETAILS');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<'PHONEPE_UPI' | 'QR' | 'NETBANKING'>('PHONEPE_UPI');

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress || !contactPhone) {
      alert('Please fill delivery address and phone number.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/orders', {
        items: cartItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        deliveryAddress,
        contactPhone,
        paymentMode: 'PHONEPE_MOCK',
      });

      if (res.data.success) {
        setOrderData(res.data.data.order);
        setStep('PAYMENT_GATEWAY');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error initiating order.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    try {
      setLoading(true);
      const res = await api.post('/payments/verify', {
        merchantTransactionId: `TXN_${orderData.orderNumber}_${Date.now()}`,
        orderId: orderData.id,
        paymentStatus: 'COMPLETED',
      });

      if (res.data.success) {
        setStep('CONFIRMED');
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('checkout')} maxWidth="lg">
      {step === 'DETAILS' && (
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {t('orderSummary')}
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto divide-y divide-slate-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium text-slate-800 line-clamp-1">
                    {item.product?.name} x {item.quantity} {item.product?.unit}
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{(item.subtotal || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-2.5 pt-2 flex items-center justify-between font-black text-sm text-slate-900">
              <span>{language === 'ta' ? 'மொத்த தொகை' : 'Total Payable'}</span>
              <span className="text-emerald-700">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'டெலிவரி முகவரி' : 'Dispatch / Delivery Address'}
            </label>
            <textarea
              required
              rows={2}
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              placeholder="Enter full village, street, district, pincode..."
              className="agri-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'தொடர்பு தொலைபேசி எண்' : 'Primary Mobile Number'}
            </label>
            <input
              required
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              placeholder="10-digit contact mobile number"
              className="agri-input"
            />
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/90 p-3 rounded-lg flex items-start space-x-2 text-xs text-emerald-950 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் பரிவர்த்தனை PhonePe கட்டண இடைமுகம் மூலம் பாதுகாக்கப்படுகிறது. அட்டை எண்கள் சேமிக்கப்படுவதில்லை.'
                : 'Secured via 256-bit encrypted PhonePe Payment Gateway interface.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>{t('loading')}</span>
            ) : (
              <>
                <span>{language === 'ta' ? 'கட்டணம் செலுத்த செல்லவும்' : 'Proceed to Secure PhonePe Gateway'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {step === 'PAYMENT_GATEWAY' && (
        <div className="space-y-4 text-center">
          {/* Development Mode Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('devMode')} — PhonePe PG Sandbox Active</span>
          </div>

          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-purple-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  पे
                </div>
                <div>
                  <h4 className="font-bold text-xs text-purple-950">PhonePe Checkout Engine</h4>
                  <p className="text-[10px] text-purple-700">Order Ref: {orderData?.orderNumber}</p>
                </div>
              </div>
              <span className="font-black text-base text-purple-900">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <label className="text-[11px] font-semibold text-purple-950 block">
                {language === 'ta' ? 'கட்டண முறை தேர்வு' : 'Select Payment Instrument'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('PHONEPE_UPI')}
                  className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all flex flex-col items-center space-y-1 ${
                    selectedMethod === 'PHONEPE_UPI'
                      ? 'border-purple-600 bg-purple-100 text-purple-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-700" />
                  <span>PhonePe UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('QR')}
                  className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all flex flex-col items-center space-y-1 ${
                    selectedMethod === 'QR'
                      ? 'border-purple-600 bg-purple-100 text-purple-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-purple-700" />
                  <span>Dynamic QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('NETBANKING')}
                  className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all flex flex-col items-center space-y-1 ${
                    selectedMethod === 'NETBANKING'
                      ? 'border-purple-600 bg-purple-100 text-purple-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-purple-700" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {language === 'ta'
              ? 'பரிசோதனை முறையில் நேரடி கட்டண ஒப்புதலை உருவகப்படுத்த கீழே உள்ள பொத்தானை அழுத்தவும்.'
              : 'Click below to verify the PhonePe sandbox callback token and finalize order status to CONFIRMED.'}
          </p>

          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs font-bold bg-purple-700 text-white hover:bg-purple-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>{t('loading')}</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {language === 'ta'
                    ? `₹${totalAmount.toLocaleString()} பணம் செலுத்து (PhonePe Mock)`
                    : `Simulate Payment of ₹${totalAmount.toLocaleString()}`}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {step === 'CONFIRMED' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'ta' ? 'ஆர்டர் உறுதி செய்யப்பட்டது!' : 'Order Dispatched & Confirmed!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tracking Reference: <span className="font-mono font-bold text-slate-900">{orderData?.orderNumber}</span>
            </p>
          </div>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-normal">
            {language === 'ta'
              ? 'விவசாயிக்கு ஆர்டர் அறிவிக்கப்பட்டுள்ளது. தயாரிப்பு தயாரானதும் உங்களுக்கு தகவல் தெரிவிக்கப்படும்.'
              : 'The farmer has received your harvest procurement confirmation. Packing and gate dispatch is underway.'}
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/orders');
              }}
              className="agri-btn-primary text-xs"
            >
              {language === 'ta' ? 'என் ஆர்டர்களைப் பார்க்க' : 'Track Order in My Orders'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
