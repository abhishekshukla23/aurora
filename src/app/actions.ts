'use server';

import { z } from 'zod';

const CLOUD_FUNCTION_URL = 'https://predict-exoplanet-z2p2g74r5a-uc.a.run.app';

const formSchema = z.object({
  planetOrbitalPeriod: z.coerce.number().positive({ message: "Must be a positive number." }),
  planetTransitDuration: z.coerce.number().positive({ message: "Must be a positive number." }),
  planetTransitDepth: z.coerce.number().positive({ message: "Must be a positive number." }),
  planetRadius: z.coerce.number().positive({ message: "Must be a positive number." }),
  stellarEffectiveTemperature: z.coerce.number().positive({ message: "Must be a positive number." }),
  stellarRadius: z.coerce.number().positive({ message: "Must be a positive number." }),
});

export type PredictionInput = z.infer<typeof formSchema>;

export type PredictionOutput = {
  prediction: string;
  confidence: string;
};

type ActionResponse = {
  success: true;
  data: PredictionOutput;
} | {
  success: false;
  error: string;
};

export async function getExoplanetPredictionAction(
  input: PredictionInput
): Promise<ActionResponse> {
  const parsed = formSchema.safeParse(input);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
    return { success: false, error: `Invalid input data:\n${errorMessages}` };
  }

  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prediction service returned an error: ${response.status} ${errorText}`);
    }

    const prediction: PredictionOutput = await response.json();
    return { success: true, data: prediction };

  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'An unexpected error occurred while communicating with the prediction service. Please try again later.' };
  }
}
