'use server';

import {
  generateExoplanetDescription,
  type GenerateExoplanetDescriptionInput,
  type GenerateExoplanetDescriptionOutput,
} from '@/ai/flows/generate-exoplanet-descriptions';
import { z } from 'zod';

const formSchema = z.object({
  planetOrbitalPeriod: z.coerce.number().positive({ message: "Must be a positive number." }),
  planetTransitDuration: z.coerce.number().positive({ message: "Must be a positive number." }),
  planetTransitDepth: z.coerce.number().positive({ message: "Must be a positive number." }),
  planetRadius: z.coerce.number().positive({ message: "Must be a positive number." }),
  stellarEffectiveTemperature: z.coerce.number().positive({ message: "Must be a positive number." }),
  stellarRadius: z.coerce.number().positive({ message: "Must be a positive number." }),
});

type ActionResponse = {
  success: true;
  data: GenerateExoplanetDescriptionOutput;
} | {
  success: false;
  error: string;
};

export async function getExoplanetDescriptionAction(
  input: GenerateExoplanetDescriptionInput
): Promise<ActionResponse> {
  const parsed = formSchema.safeParse(input);

  if (!parsed.success) {
    // Collect all error messages
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
    return { success: false, error: `Invalid input data:\n${errorMessages}` };
  }

  try {
    const description = await generateExoplanetDescription(parsed.data);
    return { success: true, data: description };
  } catch (e) {
    console.error(e);
    // Provide a more user-friendly error
    return { success: false, error: 'An unexpected error occurred while communicating with the AI model. Please try again later.' };
  }
}
