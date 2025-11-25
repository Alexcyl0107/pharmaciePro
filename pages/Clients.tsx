import React, { useState } from 'react';
import { Client, BloodGroup } from '../types';
import { Search, Plus, User, Phone, Activity, FileText, HeartPulse, Save, ArrowLeft } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showListMobile, setShowListMobile] = useState(true); // Control mobile view
  
  // Form state
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '', lastName: '', sex: 'M', phone: '+228 ', 
    height: 0, weight: 0, chronicConditions: [], allergies: [], notes: ''
  });

  const filteredClients = clients.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return 0;
    const hInMeters = height / 100;
    return (weight / (hInMeters * hInMeters)).toFixed(1);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName) {
      if (formData.id) {
        onUpdateClient(formData as Client);
        setSelectedClient(formData as Client);
      } else {
        const newClient = {
            ...formData,
            id: `c${Date.now()}`,
            history: []
        } as Client;
        onAddClient(newClient);
        setSelectedClient(newClient);
      }
      setIsEditing(false);
    }
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(false);
    setShowListMobile(false); // Switch to detail view on mobile
  };

  const openNewClientForm = () => {
    setSelectedClient(null);
    setFormData({ firstName: '', lastName: '', sex: 'M', phone: '+228 ', birthDate: '', height: 0, weight: 0, chronicConditions: [], allergies: [] });
    setIsEditing(true);
    setShowListMobile(false);
  };

  const openEditClientForm = () => {
    if (selectedClient) {
        setFormData(selectedClient);
        setIsEditing(true);
    }
  };

  const backToList = () => {
    setShowListMobile(true);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] lg:h-[calc(100vh-2rem)] gap-6">
      {/* Sidebar List - Hidden on mobile if detail is shown */}
      <div className={`
        w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden
        ${!showListMobile ? 'hidden lg:flex' : 'flex'}
      `}>
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Patients</h2>
            <button 
              onClick={openNewClientForm}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un patient..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {filteredClients.map(client => (
            <button
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                selectedClient?.id === client.id 
                  ? 'bg-emerald-50 border-emerald-100 ring-1 ring-emerald-200' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                client.sex === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
              }`}>
                {client.firstName[0]}{client.lastName[0]}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{client.firstName} {client.lastName}</h4>
                <p className="text-xs text-slate-500">{client.phone}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Detail Area - Hidden on mobile if list is shown */}
      <div className={`
        flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto
        ${showListMobile ? 'hidden lg:block' : 'block'}
      `}>
        {/* Mobile Back Button */}
        <div className="lg:hidden p-4 border-b border-slate-100">
            <button onClick={backToList} className="flex items-center gap-2 text-slate-500 font-medium">
                <ArrowLeft size={18} />
                Retour à la liste
            </button>
        </div>

        {isEditing ? (
          // CREATE/EDIT MODE
          <div className="p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                {formData.id ? 'Modifier le Dossier' : 'Nouveau Dossier Patient'}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input required type="text" className="w-full p-2 border rounded-lg"
                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                  <input required type="text" className="w-full p-2 border rounded-lg"
                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de Naissance</label>
                  <input required type="date" className="w-full p-2 border rounded-lg"
                    value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sexe</label>
                  <select className="w-full p-2 border rounded-lg"
                    value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value as 'M' | 'F'})}>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <input type="text" className="w-full p-2 border rounded-lg"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Groupe Sanguin</label>
                    <select className="w-full p-2 border rounded-lg"
                        value={formData.bloodGroup || ''} onChange={e => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}>
                        <option value="">Inconnu</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-emerald-500"/>
                    Données Médicales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Taille (cm)</label>
                        <input type="number" className="w-full p-2 border rounded-lg" placeholder="ex: 175"
                            value={formData.height || ''} onChange={e => setFormData({...formData, height: parseInt(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Poids (kg)</label>
                        <input type="number" className="w-full p-2 border rounded-lg" placeholder="ex: 70"
                            value={formData.weight || ''} onChange={e => setFormData({...formData, weight: parseInt(e.target.value)})} />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Maladies / Conditions Chroniques</label>
                    <input type="text" className="w-full p-2 border rounded-lg" placeholder="ex: Diabète, Asthme..."
                        value={formData.chronicConditions?.join(', ')}
                        onChange={e => setFormData({...formData, chronicConditions: e.target.value.split(',').map(s => s.trim())})} />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
                    <input type="text" className="w-full p-2 border rounded-lg" placeholder="ex: Pénicilline, Arachides..."
                        value={formData.allergies?.join(', ')}
                        onChange={e => setFormData({...formData, allergies: e.target.value.split(',').map(s => s.trim())})} />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes médicales</label>
                    <textarea className="w-full p-2 border rounded-lg h-24" 
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="w-full md:w-auto px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Annuler</button>
                <button type="submit" className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2">
                    <Save size={18} />
                    Enregistrer le dossier
                </button>
              </div>
            </form>
          </div>
        ) : selectedClient ? (
          // VIEW MODE
          <div className="p-4 md:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-bold text-2xl md:text-3xl shadow-sm ${
                    selectedClient.sex === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                }`}>
                    {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{selectedClient.firstName} {selectedClient.lastName}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-2 text-slate-500">
                        <span className="flex items-center gap-1 text-sm"><User size={16}/> {calculateAge(selectedClient.birthDate)} ans</span>
                        <span className="flex items-center gap-1 text-sm"><Phone size={16}/> {selectedClient.phone}</span>
                    </div>
                </div>
              </div>
              <div className="w-full md:w-auto text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                  <div className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-bold text-slate-600 inline-block mb-1">ID: {selectedClient.id}</div>
                  <button 
                    onClick={openEditClientForm}
                    className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Modifier le dossier
                  </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Physical Stats Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18}/> Constantes</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-emerald-100 text-xs uppercase">IMC</div>
                            <div className="text-2xl font-bold">{calculateBMI(selectedClient.weight, selectedClient.height)}</div>
                        </div>
                        <div>
                            <div className="text-emerald-100 text-xs uppercase">Sang</div>
                            <div className="text-2xl font-bold">{selectedClient.bloodGroup || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-emerald-100 text-xs uppercase">Poids</div>
                            <div className="font-medium">{selectedClient.weight} kg</div>
                        </div>
                        <div>
                            <div className="text-emerald-100 text-xs uppercase">Taille</div>
                            <div className="font-medium">{selectedClient.height} cm</div>
                        </div>
                    </div>
                </div>

                {/* Conditions Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm col-span-1 md:col-span-2">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><HeartPulse size={18} className="text-red-500"/> État de santé</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Maladies Chroniques</span>
                            <div className="flex flex-wrap gap-2">
                                {selectedClient.chronicConditions.length > 0 ? selectedClient.chronicConditions.map(c => (
                                    <span key={c} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                                        {c}
                                    </span>
                                )) : <span className="text-slate-400 text-sm italic">Aucune condition signalée</span>}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Allergies</span>
                            <div className="flex flex-wrap gap-2">
                                {selectedClient.allergies.length > 0 ? selectedClient.allergies.map(a => (
                                    <span key={a} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-sm font-medium border border-amber-100">
                                        {a}
                                    </span>
                                )) : <span className="text-slate-400 text-sm italic">Aucune allergie connue</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><FileText size={18}/> Notes Médicales</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {selectedClient.notes || "Aucune note particulière."}
                </p>
            </div>

          </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 p-8">
                <User size={64} className="mb-4" />
                <p className="text-center">Sélectionnez un patient pour voir son dossier</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Clients;