import React, { useState } from 'react';
import { generatePharmacyReport } from '../services/geminiService';
import { Medicine, Sale } from '../types';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  medicines: Medicine[];
  sales: Sale[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ medicines, sales }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    
    // Simulate thinking if no API key in demo, but try to call service
    const result = await generatePharmacyReport(prompt, medicines, sales);
    
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <Sparkles size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Assistant Pharmacie Intelligent</h2>
        <p className="text-slate-500 max-w-md mx-auto mt-2">
            Posez des questions sur vos stocks, vos ventes ou demandez une analyse de rentabilité. 
            Propulsé par Gemini 2.5 Flash.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 h-64 overflow-y-auto bg-slate-50/50">
            {!response && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <p className="text-sm">Exemples de questions :</p>
                    <ul className="text-xs mt-2 list-disc list-inside space-y-1">
                        <li>Quels sont les médicaments qui expirent bientôt ?</li>
                        <li>Analyse mes ventes de la journée</li>
                        <li>Rédige un rapport pour le gérant</li>
                    </ul>
                </div>
            )}
            
            {loading && (
                <div className="flex items-center justify-center h-full gap-3 text-emerald-600">
                    <Loader2 className="animate-spin" />
                    <span className="font-medium animate-pulse">Analyse des données en cours...</span>
                </div>
            )}

            {response && (
                <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    {/* Basic markdown rendering replacement for demo */}
                    {response.split('\n').map((line, i) => (
                        <p key={i} className={`mb-1 ${line.startsWith('#') ? 'font-bold text-slate-900 mt-2' : ''} ${line.startsWith('-') ? 'ml-4' : ''}`}>
                             {line.replace(/^#+\s/, '').replace(/^-\s/, '• ')}
                        </p>
                    ))}
                </div>
            )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleAsk} className="flex gap-2">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Posez votre question à l'IA..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button 
                    type="submit" 
                    disabled={loading || !prompt}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    <span>Envoyer</span>
                    <Send size={18} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
