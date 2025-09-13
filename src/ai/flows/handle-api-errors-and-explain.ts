'use server';
/**
 * @fileOverview Handles API errors and provides explanations to the user.
 *
 * - handleApiErrorsAndExplain - A function that takes an error message and generates a user-friendly explanation.
 * - HandleApiErrorsAndExplainInput - The input type for the handleApiErrorsAndExplain function.
 * - HandleApiErrorsAndExplainOutput - The return type for the handleApiErrorsAndExplain function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleApiErrorsAndExplainInputSchema = z.object({
  errorMessage: z
    .string()
    .describe('The error message received from the API.'),
});
export type HandleApiErrorsAndExplainInput = z.infer<typeof HandleApiErrorsAndExplainInputSchema>;

const HandleApiErrorsAndExplainOutputSchema = z.object({
  userFriendlyExplanation: z
    .string()
    .describe(
      'A user-friendly explanation of the error message and possible solutions.'
    ),
});
export type HandleApiErrorsAndExplainOutput = z.infer<typeof HandleApiErrorsAndExplainOutputSchema>;

export async function handleApiErrorsAndExplain(
  input: HandleApiErrorsAndExplainInput
): Promise<HandleApiErrorsAndExplainOutput> {
  return handleApiErrorsAndExplainFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleApiErrorsAndExplainPrompt',
  input: {schema: HandleApiErrorsAndExplainInputSchema},
  output: {schema: HandleApiErrorsAndExplainOutputSchema},
  prompt: `You are an AI assistant that explains technical error messages to non-technical users.

  Given the following error message from an API:
  """
  {{errorMessage}}
  """

  Explain what this error means in simple terms, and suggest possible solutions the user can try.
  Focus on being helpful and avoiding technical jargon. Suggest actions related to retrying, rephrasing, or adjusting parameters.
  Do not mention that this is an API error, just explain what the application is trying to do and why it might have failed.
  Format the explanation as a single paragraph. Do not include a title.
  If the error indicates the response was blocked for safety reasons, suggest the user rephrase the prompt to be less harmful. Do not mention the word "safety".
  If the error indicates there was an invalid API key, suggest the user check their API key configuration.
  If the error indicates a rate limit was exceeded, suggest the user try again later.
  If the error indicates the prompt was too long, suggest the user shorten their prompt.
  If the error indicates the model did not return a valid response, suggest the user try again.
  `,
});

const handleApiErrorsAndExplainFlow = ai.defineFlow(
  {
    name: 'handleApiErrorsAndExplainFlow',
    inputSchema: HandleApiErrorsAndExplainInputSchema,
    outputSchema: HandleApiErrorsAndExplainOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
