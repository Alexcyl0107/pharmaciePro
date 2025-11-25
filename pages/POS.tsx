import React, { useState } from 'react';
import { Medicine, CartItem, Sale } from '../types';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Printer, ShoppingCart } from 'lucide-react';

interface POSProps {
  medicines: Medicine[];
  onCompleteSale: (items: CartItem[], total: number, payment: string) => void;
}

const POS: React.FC<POSProps> = ({ medicines, onCompleteSale }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStep, setPaymentStep] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false); // Toggle for mobile

  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if(existing.quantity >= med.stock) return prev; // Check stock limit
        return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...med, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        // Limit by stock
        if (newQty > item.stock) return item; 
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
  const tax = 0; 
  const total = subtotal + tax;

  const filteredMeds = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCheckout = (method: 'CASH' | 'CARD' | 'MOBILE_MONEY') => {
    onCompleteSale(cart, total, method);
    setCart([]);
    setPaymentStep(false);
    setShowMobileCart(false);
    alert("Vente enregistrée avec succès !");
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 relative">
      
      {/* Mobile Cart Toggle Button */}
      <button 
        className="md:hidden fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2"
        onClick={() => setShowMobileCart(!showMobileCart)}
      >
        <ShoppingCart size={24} />
        <span className="font-bold">{cart.length}</span>
      </button>

      {/* Product Selection Area */}
      <div className={`flex-1 flex flex-col gap-4 ${showMobileCart ? 'hidden md:flex' : 'flex'}`}>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Rechercher (ex: Paracétamol, Coartem)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start pb-20 md:pb-0">
          {filteredMeds.map(med => (
            <button
              key={med.id}
              onClick={() => addToCart(med)}
              disabled={med.stock === 0}
              className={`text-left p-4 rounded-xl border transition-all ${
                med.stock === 0 
                  ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' 
                  : 'bg-white border-slate-100 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  {med.form.substring(0,2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-400">{med.stock} en stock</span>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{med.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{med.dosage}</p>
              <p className="text-emerald-600 font-bold">{med.salePrice} FCFA</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className={`
        w-full md:w-96 bg-white md:rounded-2xl shadow-lg md:border border-slate-100 flex flex-col h-full
        fixed md:static inset-0 z-40 md:z-auto transition-transform duration-300
        ${showMobileCart ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="font-bold text-slate-800">Panier</h2>
            <button onClick={() => setShowMobileCart(false)} className="text-slate-500 p-2">Fermer</button>
        </div>

        <div className="hidden md:block p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Printer size={20} className="text-slate-400" />
            Ticket de caisse
          </h2>
          <p className="text-xs text-slate-400 mt-1">Lomé - PharmaCare Pro</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Printer size={48} className="mb-4 opacity-20" />
              <p>Le panier est vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.salePrice} F x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 text-slate-600"><Minus size={14} /></button>
                    <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 text-slate-600"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} FCFA</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Taxe</span>
                <span>{tax.toLocaleString()} FCFA</span>
              </div>
            )}
            <div className="flex justify-between text-slate-800 font-bold text-lg pt-2 border-t border-slate-200">
              <span>Total à payer</span>
              <span>{total.toLocaleString()} FCFA</span>
            </div>
          </div>

          {!paymentStep ? (
            <button 
              onClick={() => setPaymentStep(true)}
              disabled={cart.length === 0}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Encaisser
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2 animate-in slide-in-from-bottom duration-300">
              <button onClick={() => handleCheckout('CASH')} className="flex flex-col items-center justify-center p-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200">
                <Banknote size={20} className="mb-1" />
                <span className="text-xs font-semibold">Espèces</span>
              </button>
              <button onClick={() => handleCheckout('CARD')} className="flex flex-col items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200">
                <CreditCard size={20} className="mb-1" />
                <span className="text-xs font-semibold">Carte</span>
              </button>
              <button onClick={() => handleCheckout('MOBILE_MONEY')} className="flex flex-col items-center justify-center p-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200">
                <Smartphone size={20} className="mb-1" />
                <span className="text-xs font-semibold text-center leading-3">Flooz<br/>T-Money</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POS;