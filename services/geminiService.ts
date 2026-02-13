import { GoogleGenAI, Type } from "@google/genai";
import { TransactionType } from "../types";

// Helper to determine transaction type based on AI response or fallback
interface ParsedTransaction {
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  borrower?: string;
}

export const parseNaturalLanguageTransaction = async (input: string, ledgerName: string = 'Dad', familyMembers: string[] = []): Promise<ParsedTransaction | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key not found");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const familyContext = familyMembers.length > 0 ? `Known family members: ${familyMembers.join(', ')}.` : '';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following transaction description into a JSON object: "${input}".
      
      Rules:
      - 'type' must be one of: 'expense', 'income', 'dad_loan' (borrowing from ${ledgerName}), 'dad_repayment' (paying back ${ledgerName}).
      - If it mentions "${ledgerName}", "Dad" or "Father" and borrowing/owing, it is 'dad_loan'.
      - If it mentions paying back "${ledgerName}" or "Dad", it is 'dad_repayment'.
      - Default to 'expense' if spending money.
      - Default to 'income' if receiving money (salary, sold items).
      - 'amount' should be a number.
      - 'category' should be a short string (e.g., "Food", "Transport", "Utilities").
      - 'description' should be a clean summary.
      - 'borrower': Identify who borrowed the money or who is repaying based on the input text. ${familyContext} 
      - If a name from the known family members list appears, use it as the borrower. 
      - Default to the first known family member if implies self but not specified, or just "Me".
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['expense', 'income', 'dad_loan', 'dad_repayment'] },
            borrower: { type: Type.STRING },
          },
          required: ["description", "amount", "category", "type"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text) as ParsedTransaction;
    // Default borrower if strictly related to dad ledger and missing
    if ((data.type === 'dad_loan' || data.type === 'dad_repayment') && !data.borrower) {
        data.borrower = familyMembers[0] || "Me";
    }
    return data;
  } catch (error) {
    console.error("Gemini parsing error:", error);
    return null;
  }
};
