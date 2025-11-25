import React, { useState } from 'react';
import { Medicine, MedicineForm } from '../types';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';

interface InventoryProps {
  medicines: Medicine[];
  onAddMedicine: (med: Medicine) => void;
  onUpdateMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ medicines, onAddMedicine, onUpdateMedicine, onDeleteMedicine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New Medicine Form State
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '', category: '', stock: 0, salePrice: 0, minStock: 10, form: MedicineForm.TABLET, dosage: '', purchasePrice: 0, expiryDate: ''
  });

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || med.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(medicines.map(m => m.category)))];

  const handleOpenAdd = () => {
    setFormData({ name: '', category: '', stock: 0, salePrice: 0, minStock: 10, form: MedicineForm.TABLET, dosage: '', purchasePrice: 0, expiryDate: '' });
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setFormData(med);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.salePrice) {
        if (isEditing && formData.id) {
            onUpdateMedicine(formData as Medicine);
        } else {
            onAddMedicine({
                ...formData as Medicine,
                id: Math.random().toString(36).substr(2, 9),
                purchasePrice: formData.purchasePrice || 0,
                expiryDate: formData.expiryDate || new Date().toISOString(),
                description: formData.description || '',
                supplierId: 'sup1'
            });
        }
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Gestion des Médicaments</h1>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-all w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          Nouveau Médicament
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, dosage..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter size={20} className="text-slate-400 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                categoryFilter === cat 
                  ? 'bg-emerald-100 text-emerald-700 font-medium' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Nom du Produit</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Forme</th>
                <th className="p-4">Prix Vente</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Expiration</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMedicines.map(med => (
                <tr key={med.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{med.name}</div>
                    <div className="text-slate-500 text-xs">{med.dosage}</div>
                  </td>
                  <td className="p-4 text-slate-600">{med.category}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs border border-slate-200">
                      {med.form}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{med.salePrice} FCFA</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${med.stock <= med.minStock ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                      <span className={med.stock <= med.minStock ? 'text-red-600 font-medium' : 'text-slate-600'}>
                        {med.stock}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(med)}
                        className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteMedicine(med.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMedicines.length === 0 && (
            <div className="p-8 text-center text-slate-500">
                Aucun médicament trouvé.
            </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                  {isEditing ? 'Modifier le médicament' : 'Ajouter un médicament'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                    <input required type="text" className="w-full p-2 border rounded-lg" 
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prix Vente</label>
                  <input required type="number" className="w-full p-2 border rounded-lg" 
                    value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input required type="number" className="w-full p-2 border rounded-lg" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiration</label>
                  <input required type="date" className="w-full p-2 border rounded-lg" 
                    value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''} 
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 shrink-0">
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

export default Inventory;