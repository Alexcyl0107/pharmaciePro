import React, { useState } from 'react';
import { PharmacySettings } from '../types';
import { Save, Building2, User, Shield, Bell, Printer, RefreshCw } from 'lucide-react';

interface SettingsProps {
  settings: PharmacySettings;
  onUpdateSettings: (settings: PharmacySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'security' | 'system'>('profile');
  const [formData, setFormData] = useState<PharmacySettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof PharmacySettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil Officine', icon: Building2 },
    { id: 'users', label: 'Utilisateurs & Rôles', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système & Périphériques', icon: Printer },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800">Paramètres de la Pharmacie</h1>
            <button 
                onClick={handleSave}
                className={`w-full sm:w-auto px-6 py-2 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all ${
                    isSaved ? 'bg-green-600' : 'bg-slate-800 hover:bg-slate-900'
                }`}
            >
                {isSaved ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaved ? 'Enregistré !' : 'Enregistrer les modifications'}
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto lg:overflow-visible h-fit">
                <div className="flex lg:flex-col min-w-max lg:min-w-0">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 p-4 transition-colors text-sm font-medium border-b-4 lg:border-b-0 lg:border-l-4 ${
                                    activeTab === tab.id 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500' 
                                        : 'text-slate-600 hover:bg-slate-50 border-transparent'
                                }`}
                            >
                                <Icon size={18} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-8 min-h-[500px]">
                {activeTab === 'profile' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="border-b border-slate-100 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Identité de l'Officine</h2>
                            <p className="text-slate-500 text-sm">Ces informations apparaîtront sur les factures et reçus.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la Pharmacie</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro NIF (Fiscal)</label>
                                <input 
                                    type="text" 
                                    value={formData.nif}
                                    onChange={e => handleChange('nif', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                                <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Devise</label>
                                <select 
                                    value={formData.currency}
                                    onChange={e => handleChange('currency', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                >
                                    <option value="FCFA">FCFA (XOF)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Complète</label>
                                <textarea 
                                    value={formData.address}
                                    onChange={e => handleChange('address', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none h-24 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Gestion des Utilisateurs</h2>
                                <p className="text-slate-500 text-sm">Gérez les accès pharmaciens, assistants et caissiers.</p>
                            </div>
                            <button className="text-sm bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 w-full sm:w-auto">Ajouter un utilisateur</button>
                        </div>

                        <div className="space-y-3">
                            {/* Mock Users List */}
                            {[
                                { name: 'Koffi A.', role: 'Administrateur', email: 'admin@pharma.tg', active: true },
                                { name: 'Sarah B.', role: 'Pharmacien', email: 'sarah@pharma.tg', active: true },
                                { name: 'Jean D.', role: 'Caissier', email: 'caisse1@pharma.tg', active: true },
                            ].map((user, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">{user.name}</h4>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                                            user.role === 'Administrateur' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            user.role === 'Pharmacien' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                            {user.role}
                                        </span>
                                        <button className="text-slate-400 hover:text-emerald-600">Modifier</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                     <div className="space-y-6 animate-in fade-in duration-300">
                         <div className="border-b border-slate-100 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Sécurité et Sauvegardes</h2>
                            <p className="text-slate-500 text-sm">Protégez vos données et configurez les accès.</p>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start mb-6">
                            <Shield className="text-amber-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-amber-800">Sauvegarde automatique</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    La dernière sauvegarde locale date du 24/05/2024 à 18:30.
                                    Pensez à exporter vos données régulièrement.
                                </p>
                                <button className="mt-3 text-xs bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-700 font-medium">
                                    Effectuer une sauvegarde maintenant
                                </button>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Expiration de session (minutes)</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>1 heure</option>
                                    <option>Jamais</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Complexité mot de passe</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                    <option>Standard (8 chars)</option>
                                    <option>Forte (12 chars, symboles)</option>
                                </select>
                            </div>
                         </div>
                     </div>
                )}

                {activeTab === 'system' && (
                     <div className="space-y-6 animate-in fade-in duration-300">
                         <div className="border-b border-slate-100 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Système & Périphériques</h2>
                            <p className="text-slate-500 text-sm">Imprimantes, douchettes code-barres et tiroir caisse.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Printer size={24} className="text-slate-400"/>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Imprimante Reçus (Thermique)</h4>
                                        <p className="text-xs text-slate-500">EPSON TM-T20III - Connectée</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span className="text-sm text-emerald-600 font-medium">Prête</span>
                                </div>
                            </div>

                             <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Bell size={24} className="text-slate-400"/>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Notifications Sonores</h4>
                                        <p className="text-xs text-slate-500">Alertes stock critique et erreurs système</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked className="sr-only peer" readOnly />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>
                     </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default Settings;