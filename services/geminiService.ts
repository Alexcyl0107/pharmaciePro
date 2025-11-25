import { GoogleGenAI } from "@google/genai";
import { Medicine, Sale } from "../types";

const API_KEY = process.env.API_KEY || ''; // In a real app, this comes from env

export const generatePharmacyReport = async (
  prompt: string,
  inventory: Medicine[],
  sales: Sale[]
): Promise<string> => {
  if (!API_KEY) {
    return "Clé API Gemini non configurée. Veuillez configurer process.env.API_KEY.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Create a context summary to send to the model
    const contextData = {
      location: "Togo (Afrique de l'Ouest)",
      currency: "FCFA (XOF)",
      inventorySummary: inventory.map(m => ({
        name: m.name,
        stock: m.stock,
        salesPrice: m.salePrice,
        exp: m.expiryDate
      })),
      todaysSalesTotal: sales.reduce((acc, curr) => acc + curr.total, 0),
      salesCount: sales.length,
      lowStockItems: inventory.filter(m => m.stock <= m.minStock).map(m => m.name)
    };

    const fullPrompt = `
      Tu es un assistant expert pour une pharmacie située au Togo.
      Le contexte monétaire est le Franc CFA (FCFA).
      Prends en compte les réalités locales (pathologies comme le paludisme, moyens de paiement comme Flooz/T-Money).
      
      Voici les données actuelles de la pharmacie en format JSON simplifié :
      ${JSON.stringify(contextData)}
      
      La demande de l'utilisateur est : "${prompt}"
      
      Réponds de manière professionnelle, concise et utile pour un pharmacien togolais. Si c'est une analyse, donne des chiffres clés.
      Formate la réponse en Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "Aucune réponse générée.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Une erreur est survenue lors de la consultation de l'assistant IA.";
  }
};