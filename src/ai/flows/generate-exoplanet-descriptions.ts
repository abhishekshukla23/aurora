'use server';

/**
 * @fileOverview A flow to generate descriptive summaries of exoplanet parameters.
 *
 * - generateExoplanetDescription - A function that generates a descriptive summary of exoplanet parameters.
 * - GenerateExoplanetDescriptionInput - The input type for the generateExoplanetDescription function.
 * - GenerateExoplanetDescriptionOutput - The return type for the generateExoplanetDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExoplanetDescriptionInputSchema = z.object({
  planetOrbitalPeriod: z
    .number()
    .describe('The orbital period of the exoplanet in days.')
    .positive(),
  planetTransitDuration: z
    .number()
    .describe('The duration of the exoplanet transit in hours.')
    .positive(),
  planetTransitDepth: z
    .number()
    .describe('The transit depth of the exoplanet in parts per million.')
    .positive(),
  planetRadius: z.number().describe('The radius of the exoplanet in Earth radii.').positive(),
  stellarEffectiveTemperature: z
    .number()
    .describe('The effective temperature of the host star in Kelvin.')
    .positive(),
  stellarRadius: z
    .number()
    .describe('The radius of the host star in solar radii.')
    .positive(),
});

export type GenerateExoplanetDescriptionInput = z.infer<
  typeof GenerateExoplanetDescriptionInputSchema
>;

const GenerateExoplanetDescriptionOutputSchema = z.object({
  description: z.string().describe('A descriptive summary of the exoplanet parameters.'),
});

export type GenerateExoplanetDescriptionOutput = z.infer<
  typeof GenerateExoplanetDescriptionOutputSchema
>;

export async function generateExoplanetDescription(
  input: GenerateExoplanetDescriptionInput
): Promise<GenerateExoplanetDescriptionOutput> {
  return generateExoplanetDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExoplanetDescriptionPrompt',
  input: {schema: GenerateExoplanetDescriptionInputSchema},
  output: {schema: GenerateExoplanetDescriptionOutputSchema},
  prompt: `You are an expert in exoplanetary science. Generate a short, descriptive summary of the provided exoplanet parameters, focusing on their potential implications for habitability or uniqueness.

Planet Orbital Period: {{{planetOrbitalPeriod}}} days
Planet Transit Duration: {{{planetTransitDuration}}} hours
Planet Transit Depth: {{{planetTransitDepth}}} ppm
Planet Radius: {{{planetRadius}}} Earth radii
Stellar Effective Temperature: {{{stellarEffectiveTemperature}}} K
Stellar Radius: {{{stellarRadius}}} Solar radii`,
});

const generateExoplanetDescriptionFlow = ai.defineFlow(
  {
    name: 'generateExoplanetDescriptionFlow',
    inputSchema: GenerateExoplanetDescriptionInputSchema,
    outputSchema: GenerateExoplanetDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
