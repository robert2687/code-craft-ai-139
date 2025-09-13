'use server';

/**
 * @fileOverview Generates HTML, CSS, and JavaScript code for a basic, runnable web application based on a user-provided description.
 *
 * - generateAppFromPrompt - A function that takes a prompt describing the desired application and returns the generated code.
 * - GenerateAppFromPromptInput - The input type for the generateAppFromPrompt function.
 * - GenerateAppFromPromptOutput - The return type for the generateAppFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppFromPromptInputSchema = z.string().describe('A description of the application to generate.');
export type GenerateAppFromPromptInput = z.infer<typeof GenerateAppFromPromptInputSchema>;

const GenerateAppFromPromptOutputSchema = z.string().describe('The generated HTML, CSS, and JavaScript code for the application.');
export type GenerateAppFromPromptOutput = z.infer<typeof GenerateAppFromPromptOutputSchema>;

export async function generateAppFromPrompt(input: GenerateAppFromPromptInput): Promise<GenerateAppFromPromptOutput> {
  return generateAppFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppFromPromptPrompt',
  input: {schema: GenerateAppFromPromptInputSchema},
  output: {schema: GenerateAppFromPromptOutputSchema},
  prompt: `You are an expert web developer tasked with creating a complete, single-file HTML application based on the user's request.\n\n**CRITICAL INSTRUCTIONS:**\n1. **Single File Mandate:** ALL HTML, CSS, and JavaScript MUST be in one single .html file. Do not create separate files or link to external .css or .js files, except for CDN links for libraries.\n2. **Use Tailwind CSS:** You MUST use Tailwind CSS for all styling. Include the necessary script tag in the <head>: <script src="https://cdn.tailwindcss.com"></script>\n3. **Self-Contained and Runnable:** The generated code must be fully functional and runnable by simply opening the HTML file in a browser. All logic must be included within <script> tags.\n4. **No Explanations:** Your entire response must be ONLY the raw HTML code for the application. Do NOT include any explanations, comments, or markdown formatting like \`\`\`html or \`\`\` before or after the code.\n5. **Modern Design:** Create a visually appealing, modern, and responsive user interface. Use the 'Inter' font from Google Fonts.\n6. **Completeness:** Implement the core functionality described by the user. If the request is simple, feel free to add small, creative features to make the app more impressive.\n7. **Structure:** Create a standard HTML structure with <!DOCTYPE html>, <html>, <head>, and <body> tags. Include a <meta name="viewport" content="width=device-width, initial-scale=1.0"> for responsiveness.\n\n**User's Request:** {{{input}}}`,
});

const generateAppFromPromptFlow = ai.defineFlow(
  {
    name: 'generateAppFromPromptFlow',
    inputSchema: GenerateAppFromPromptInputSchema,
    outputSchema: GenerateAppFromPromptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
