import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import { Truck, Phone, Mail, MapPin, Navigation, Clock, Plus } from 'lucide-react';

interface SuppliersProps {
  suppliers: Supplier[];
  onAddSupplier: (s: Supplier) => void;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAddSupplier }) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0]);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '', contact: '', type: 'Grossiste', email: '', address: ''
  });

  // Simulation of truck movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSupplier({
      ...newSupplier as Supplier,
      id: `sup${Date.now()}`,
      location: { lat: 50 + (Math.random() * 40 - 20), lng: 50 + (Math.random() * 40 - 20) } // Random loc for demo
    });
    setShowAddModal(false);
    setNewSupplier({ name: '', contact: '', type: 'Grossiste', email: '', address: '' });
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-2rem)] gap-6">
      {/* List of Suppliers */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">Fournisseurs</h1>
            <button onClick={() => setShowAddModal(true)} className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
                <Plus size={20} />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[400px] lg:max-h-full">
            {suppliers.map(sup => (
                <div 
                    key={sup.id} 
                    onClick={() => setSelectedSupplier(sup)}
                    className={`bg-white p-5 rounded-2xl shadow-sm border cursor-pointer transition-all ${
                        selectedSupplier?.id === sup.id 
                            ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-md' 
                            : 'border-slate-100 hover:border-emerald-200'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800">{sup.name}</h3>
                        <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                            {sup.type}
                        </span>
                    </div>
                    <div className="space-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-emerald-500" />
                            {sup.contact}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-emerald-500" />
                            {sup.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-emerald-500" />
                            {sup.address}
                        </div>
                    </div>
                    {sup.nextDelivery && (
                         <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs text-slate-400">Prochaine livraison</span>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <Clock size={10} /> 
                                {new Date(sup.nextDelivery).toLocaleDateString()}
                            </span>
                         </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Map & Tracking Section */}
      <div className="flex-1 flex flex-col gap-4 order-1 lg:order-2 h-[400px] lg:h-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 overflow-hidden relative flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                    <Navigation size={20} className="text-blue-500"/>
                    Suivi GPS - Lomé
                </h2>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium animate-pulse">
                    ● En cours
                </span>
            </div>

            {/* Simulated Map Container */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden group">
                {/* Map Grid Pattern (Simulating Streets) */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
                
                {/* Map Features (Simulating Areas in Lomé) */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-emerald-200/20 rounded-full blur-xl"></div>

                {/* Pharmacy Location (Fixed Center) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                    <div className="w-12 h-12 bg-white rounded-full shadow-lg p-2 border-4 border-emerald-500 flex items-center justify-center">
                        <span className="font-bold text-emerald-700">MOI</span>
                    </div>
                    <span className="bg-white/90 px-2 py-0.5 rounded text-xs font-bold mt-1 shadow-sm">Ma Pharmacie</span>
                </div>

                {/* Suppliers Locations (Dynamic based on dummy coordinates) */}
                {suppliers.map(sup => (
                    <div 
                        key={sup.id}
                        className="absolute transition-all duration-500"
                        style={{
                            top: `${sup.location.lat}%`,
                            left: `${sup.location.lng}%`
                        }}
                    >
                        <div className={`flex flex-col items-center ${selectedSupplier?.id === sup.id ? 'scale-110 z-30' : 'opacity-70 z-10'}`}>
                            <div className="w-8 h-8 bg-slate-800 rounded-lg shadow-lg flex items-center justify-center text-white">
                                <Truck size={16} />
                            </div>
                            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-bold mt-1 shadow-sm whitespace-nowrap">
                                {sup.name}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Animated Delivery Truck Route (SVG) */}
                {selectedSupplier && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                         {/* Dashed Line Route */}
                         <line 
                            x1={`${selectedSupplier.location.lng}%`} 
                            y1={`${selectedSupplier.location.lat}%`} 
                            x2="50%" 
                            y2="50%" 
                            stroke="#3b82f6" 
                            strokeWidth="3" 
                            strokeDasharray="6"
                            opacity="0.5"
                         />
                    </svg>
                )}

                {/* Moving Truck */}
                {selectedSupplier && (
                    <div 
                        className="absolute z-40 transition-all duration-100 ease-linear shadow-xl bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white"
                        style={{
                            // Linear interpolation between supplier and pharmacy (50,50)
                            left: `calc(${selectedSupplier.location.lng}% + (${50 - selectedSupplier.location.lng}%) * ${deliveryProgress/100})`,
                            top: `calc(${selectedSupplier.location.lat}% + (${50 - selectedSupplier.location.lat}%) * ${deliveryProgress/100})`,
                        }}
                    >
                        <Truck size={14} />
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-3 gap-2 md:gap-4">
                 <div className="text-center">
                    <span className="block text-xs text-slate-400 uppercase">Distance</span>
                    <span className="font-bold text-slate-800 text-sm md:text-base">4.2 km</span>
                 </div>
                 <div className="text-center border-x border-slate-100">
                    <span className="block text-xs text-slate-400 uppercase">Temps</span>
                    <span className="font-bold text-slate-800 text-sm md:text-base">12 min</span>
                 </div>
                 <div className="text-center">
                    <span className="block text-xs text-slate-400 uppercase">Livreur</span>
                    <span className="font-bold text-slate-800 text-sm md:text-base">Kouamé</span>
                 </div>
            </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Ajouter Fournisseur</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom Société</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select className="w-full p-2 border rounded-lg"
                     value={newSupplier.type} onChange={e => setNewSupplier({...newSupplier, type: e.target.value as any})}>
                     <option value="Grossiste">Grossiste</option>
                     <option value="Laboratoire">Laboratoire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact (Tél)</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full p-2 border rounded-lg" 
                    value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={newSupplier.address} onChange={e => setNewSupplier({...newSupplier, address: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;