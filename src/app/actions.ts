
'use server';

import { z } from 'zod';
import { generateAppFromPrompt } from '@/ai/flows/generate-app-from-prompt';
import { handleApiErrorsAndExplain } from '@/ai/flows/handle-api-errors-and-explain';

const promptSchema = z.string().min(10, { message: "Please enter a more detailed description (at least 10 characters)." });

export type FormState = {
  success: boolean;
  data: string | null;
  error: string | null;
  timestamp?: number;
};

export async function generateAppAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userInput = formData.get('prompt') as string;

  const validatedPrompt = promptSchema.safeParse(userInput);
  if (!validatedPrompt.success) {
    return {
      success: false,
      data: null,
      error: validatedPrompt.error.errors[0].message,
    };
  }

  try {
    let generatedCode = await generateAppFromPrompt(validatedPrompt.data);
    
    generatedCode = generatedCode.replace(/^```html\s*|```\s*$/g, '').trim();

    if (!generatedCode || !generatedCode.toLowerCase().includes('</html>')) {
        throw new Error("The model did not return a valid HTML response. Please try rephrasing your prompt.");
    }

    return { success: true, data: generatedCode, error: null, timestamp: Date.now() };
  } catch (e: any) {
    console.error("Error generating app:", e);
    
    try {
        const { userFriendlyExplanation } = await handleApiErrorsAndExplain({ errorMessage: e.message });
        return {
            success: false,
            data: null,
            error: userFriendlyExplanation || "An unknown error occurred. Please try again.",
        };
    } catch (explainError) {
        console.error("Error explaining error:", explainError);
        return { success: false, data: null, error: "An unexpected error occurred while generating the app. Please check your prompt and try again." };
    }
  }
}
