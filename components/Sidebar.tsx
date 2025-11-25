import React from 'react';
import { LayoutDashboard, Pill, ShoppingCart, Activity, Users, Truck, FileText, Settings, Sparkles, X, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Médicaments', icon: Pill },
    { id: 'pos', label: 'Ventes / Caisse', icon: ShoppingCart },
    { id: 'prescriptions', label: 'Ordonnances', icon: FileText },
    { id: 'clients', label: 'Patients', icon: Users },
    { id: 'suppliers', label: 'Fournisseurs', icon: Truck },
    { id: 'reports', label: 'Rapports IA', icon: Activity },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handleNavigation = (id: string) => {
    onNavigate(id);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:shadow-lg flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-xl font-bold text-slate-800">PharmaPro</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 font-semibold shadow-sm ring-1 ring-emerald-100'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-yellow-200" />
              <span className="font-semibold text-sm">Assistant IA</span>
            </div>
            <p className="text-xs text-emerald-50 mb-3 opacity-90">
              Besoin d'aide pour analyser vos stocks ?
            </p>
            <button 
              onClick={() => handleNavigation('reports')}
              className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg transition-colors font-medium border border-white/10"
            >
              Ouvrir l'Assistant
            </button>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 text-sm">
             <LogOut size={16} />
             <span>Déconnexion</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;