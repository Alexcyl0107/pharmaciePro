import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Package, Calendar, Settings, Edit2, Target } from 'lucide-react';
import { Medicine, Sale, Prescription, PrescriptionStatus, PharmacySettings } from '../types';

interface DashboardProps {
  medicines: Medicine[];
  sales: Sale[];
  prescriptions: Prescription[];
  settings: PharmacySettings;
  onUpdateSettings: (s: PharmacySettings) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ medicines, sales, prescriptions, settings, onUpdateSettings }) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState(settings.dailyRevenueTarget);

  // --- Calculations dynamiques ---
  const lowStockCount = medicines.filter(m => m.stock <= m.minStock).length;
  
  const today = new Date();
  const todaysSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate.getDate() === today.getDate() &&
           saleDate.getMonth() === today.getMonth() &&
           saleDate.getFullYear() === today.getFullYear();
  });
  
  const dailyRevenue = todaysSales.reduce((acc, curr) => acc + curr.total, 0);
  const pendingPrescriptions = prescriptions.filter(p => p.status === PrescriptionStatus.PENDING).length;

  // Calcul progression objectif
  const progressPercentage = Math.min(100, Math.round((dailyRevenue / settings.dailyRevenueTarget) * 100));

  // Génération des données pour le graph (7 derniers jours)
  const getLast7DaysSales = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      const daySales = sales.filter(s => {
        const sDate = new Date(s.date);
        return sDate.getDate() === d.getDate() && sDate.getMonth() === d.getMonth();
      });
      
      const total = daySales.reduce((acc, curr) => acc + curr.total, 0);
      days.push({ name: dayName, sales: total });
    }
    return days;
  };

  const salesData = getLast7DaysSales();

  const handleSaveGoal = () => {
    onUpdateSettings({ ...settings, dailyRevenueTarget: tempGoal });
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
           <p className="text-sm text-slate-500">{settings.name} - Aperçu de l'activité</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                 <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Date</div>
                 <div className="text-sm font-bold text-slate-700">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                 </div>
            </div>
        </div>
      </div>

      {/* Stats Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA du Jour avec Objectif */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => setShowGoalModal(true)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600">
                <Edit2 size={14} />
             </button>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
              <DollarSign size={24} />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${progressPercentage >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {progressPercentage}% Obj.
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">CA du Jour</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">{dailyRevenue.toLocaleString('fr-FR')} {settings.currency}</p>
          
          {/* Progress Bar */}
          <div className="mt-4">
             <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Progression</span>
                <span>Obj: {settings.dailyRevenueTarget.toLocaleString()}</span>
             </div>
             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
             </div>
          </div>
        </div>

        {/* Alertes Stock */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            {lowStockCount > 0 && (
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full animate-pulse">Action requise</span>
            )}
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Stock Faible</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{lowStockCount}</p>
          <p className="text-xs text-slate-400 mt-2">Produits sous le seuil d'alerte</p>
        </div>

        {/* Ordonnances */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">En attente</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Ordonnances</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{pendingPrescriptions}</p>
          <p className="text-xs text-slate-400 mt-2">À traiter maintenant</p>
        </div>

        {/* Ventes Volume */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Package size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Ventes Totales</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{sales.length}</p>
          <p className="text-xs text-slate-400 mt-2">Transactions enregistrées</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Évolution du CA (7 derniers jours)
             </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value: number) => [`${value.toLocaleString()} ${settings.currency}`, "Chiffre d'affaires"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Alertes Stock ({lowStockCount})
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-2 custom-scrollbar">
            {medicines.filter(m => m.stock <= m.minStock).map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm">{m.name}</h4>
                  <p className="text-xs text-red-500 font-medium">{m.dosage}</p>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-red-600 text-sm">{m.stock} en stock</span>
                  <span className="text-[10px] text-slate-500">Seuil: {m.minStock}</span>
                </div>
              </div>
            ))}
            {medicines.filter(m => m.stock <= m.minStock).length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <div className="bg-emerald-50 p-4 rounded-full mb-3">
                    <Package size={32} className="text-emerald-300"/>
                </div>
                <p>Aucune alerte de stock.</p>
                <p className="text-xs mt-1">Votre inventaire est sain !</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Objectif Journalier</h3>
                        <p className="text-xs text-slate-500">Définissez votre cible de ventes</p>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Montant ({settings.currency})</label>
                    <input 
                        type="number" 
                        value={tempGoal} 
                        onChange={(e) => setTempGoal(Number(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-lg"
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowGoalModal(false)}
                        className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSaveGoal}
                        className="flex-1 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-medium"
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;