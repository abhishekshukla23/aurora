'use server';

import { z } from 'zod';
// This is a placeholder. In a real environment, you would get this
// from a config or environment variable.
const CLOUD_FUNCTION_URL = 'https://us-central1-your-project-id.cloudfunctions.net/predict_exoplanet';


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
    // In a real application, you would replace this URL with your actual
    // Cloud Function URL. You also need to make sure your function is deployed
    // and CORS is configured to allow requests from your app.
    // For now, we will mock the response.
    console.log("Calling mock prediction service with:", parsed.data);

    // Mocking the fetch call to the cloud function
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const random = Math.random();
    const mockPrediction = {
        prediction: random > 0.5 ? 'Is an Exoplanet' : 'Not an Exoplanet',
        confidence: (random * 30 + 70).toFixed(2) + '%',
    };

    return { success: true, data: mockPrediction };

  } catch (e) {
    console.error(e);
    return { success: false, error: 'An unexpected error occurred while communicating with the prediction service. Please try again later.' };
  }
}
