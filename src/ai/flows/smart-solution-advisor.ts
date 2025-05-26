'use server';

/**
 * @fileOverview An AI agent that provides customized sub-metering solution recommendations for landlords.
 *
 * - getSmartSolution - A function that suggests optimal sub-metering solutions based on property type and usage patterns.
 * - SmartSolutionAdvisorInput - The input type for the getSmartSolution function.
 * - SmartSolutionAdvisorOutput - The return type for the getSmartSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSolutionAdvisorInputSchema = z.object({
  propertyType: z
    .string()
    .describe('The type of property (e.g., apartment, condo, office).'),
  usagePatterns: z
    .string()
    .describe(
      'Description of the property usage patterns, including energy consumption habits.'
    ),
});
export type SmartSolutionAdvisorInput = z.infer<typeof SmartSolutionAdvisorInputSchema>;

const SmartSolutionAdvisorOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('The recommended sub-metering solution for the property.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the recommendation, explaining why it is suitable for the property type and usage patterns.'
    ),
});
export type SmartSolutionAdvisorOutput = z.infer<typeof SmartSolutionAdvisorOutputSchema>;

export async function getSmartSolution(
  input: SmartSolutionAdvisorInput
): Promise<SmartSolutionAdvisorOutput> {
  return smartSolutionAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSolutionAdvisorPrompt',
  input: {schema: SmartSolutionAdvisorInputSchema},
  output: {schema: SmartSolutionAdvisorOutputSchema},
  prompt: `You are an expert in sub-metering solutions, providing recommendations to landlords based on their property type and usage patterns.

  Based on the following information, provide a sub-metering solution recommendation and explain your reasoning.

  Property Type: {{{propertyType}}}
  Usage Patterns: {{{usagePatterns}}}

  Recommendation:
  Reasoning: `,
});

const smartSolutionAdvisorFlow = ai.defineFlow(
  {
    name: 'smartSolutionAdvisorFlow',
    inputSchema: SmartSolutionAdvisorInputSchema,
    outputSchema: SmartSolutionAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
