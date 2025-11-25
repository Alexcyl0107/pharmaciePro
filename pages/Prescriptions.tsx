import React, { useState } from 'react';
import { Prescription, PrescriptionStatus } from '../types';
import { FileText, Upload } from 'lucide-react';

interface PrescriptionsProps {
  prescriptions: Prescription[];
  onAddPrescription: (p: Prescription) => void;
  onUpdateStatus: (id: string, status: PrescriptionStatus) => void;
}

const Prescriptions: React.FC<PrescriptionsProps> = ({ prescriptions, onAddPrescription, onUpdateStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    medications: ''
  });

  const getStatusColor = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case PrescriptionStatus.PREPARING: return 'bg-blue-100 text-blue-700 border-blue-200';
      case PrescriptionStatus.READY: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case PrescriptionStatus.COMPLETED: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPrescription({
      id: `p${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: PrescriptionStatus.PENDING,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      medications: formData.medications.split(',').map(s => s.trim())
    });
    setShowModal(false);
    setFormData({ patientName: '', doctorName: '', medications: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Ordonnances</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium"
        >
          <Upload size={18} />
          Nouvelle Ordonnance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(PrescriptionStatus).map((status) => (
          <div key={status} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{status}</h3>
              <span className="bg-white text-slate-500 px-2 py-0.5 rounded-md text-xs font-bold border border-slate-200">
                {prescriptions.filter(p => p.status === status).length}
              </span>
            </div>

            <div className="space-y-3">
              {prescriptions.filter(p => p.status === status).map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-slate-400">{p.date}</span>
                    <FileText size={16} className="text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-800">{p.patientName}</h4>
                  <p className="text-xs text-slate-500 mb-3">Dr. {p.doctorName}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.medications.map((med, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-600">
                        {med}
                      </span>
                    ))}
                  </div>

                  {status !== PrescriptionStatus.COMPLETED && (
                    <button 
                      onClick={() => {
                        const next = 
                          status === PrescriptionStatus.PENDING ? PrescriptionStatus.PREPARING :
                          status === PrescriptionStatus.PREPARING ? PrescriptionStatus.READY :
                          PrescriptionStatus.COMPLETED;
                        onUpdateStatus(p.id, next);
                      }}
                      className="w-full py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Passer à l'étape suivante
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

       {/* Add Modal */}
       {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Enregistrer Ordonnance</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Patient</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Médecin Prescripteur</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" 
                    value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Médicaments (séparés par virgule)</label>
                  <textarea required className="w-full p-2 border rounded-lg h-24" 
                    placeholder="Ex: Paracétamol, Amoxicilline..."
                    value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})} />
                </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;