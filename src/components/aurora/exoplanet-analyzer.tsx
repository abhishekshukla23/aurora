"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getExoplanetPredictionAction } from '@/app/actions';
import type { PredictionOutput } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Orbit, Hourglass, ArrowDownToLine, Globe, Sun, Star, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  planetOrbitalPeriod: z.coerce.number({invalid_type_error: "Must be a number."}).positive({ message: "Must be a positive number." }),
  planetTransitDuration: z.coerce.number({invalid_type_error: "Must be a number."}).positive({ message: "Must be a positive number." }),
  planetTransitDepth: z.coerce.number({invalid_type_error: "Must be a number."}).positive({ message: "Must be a positive number." }),
  planetRadius: z.coerce.number({invalid_type_error: "Must be a number."}).positive({ message: "Must be a positive number." }),
  stellarEffectiveTemperature: z.coerce.number({invalid_type_error: "Must be a number."}).positive({ message: "Must be a positive number." }),
  stellarRadius: z.coerce.number({invalid_type_error: "Must be a number."}).positive({ message: "Must be a positive number." }),
});

type FormData = z.infer<typeof formSchema>;

const formFields: { name: keyof FormData; label: string; placeholder: string; icon: React.ElementType }[] = [
  { name: 'planetOrbitalPeriod', label: 'Planet Orbital Period (days)', placeholder: 'e.g., 365.25', icon: Orbit },
  { name: 'planetTransitDuration', label: 'Planet Transit Duration (hours)', placeholder: 'e.g., 2.5', icon: Hourglass },
  { name: 'planetTransitDepth', label: 'Planet Transit Depth (ppm)', placeholder: 'e.g., 840', icon: ArrowDownToLine },
  { name: 'planetRadius', label: 'Planet Radius (Earth radii)', placeholder: 'e.g., 1.0', icon: Globe },
  { name: 'stellarEffectiveTemperature', label: 'Stellar Effective Temperature (K)', placeholder: 'e.g., 5778', icon: Sun },
  { name: 'stellarRadius', label: 'Stellar Radius (Solar radii)', placeholder: 'e.g., 1.0', icon: Star },
];

export default function ExoplanetAnalyzer() {
  const [predictionResponse, setPredictionResponse] = useState<PredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planetOrbitalPeriod: undefined,
      planetTransitDuration: undefined,
      planetTransitDepth: undefined,
      planetRadius: undefined,
      stellarEffectiveTemperature: undefined,
      stellarRadius: undefined,
    }
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);
    setPredictionResponse(null);

    const result = await getExoplanetPredictionAction(data);

    if (result.success) {
      setPredictionResponse(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }
  
  return (
    <div className="grid md:grid-cols-2 md:gap-12 lg:gap-16">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Exoplanet Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formFields.map(({ name, label, placeholder, icon: Icon }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder={placeholder} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : 'Predict Exoplanet'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8 md:mt-0">
        <Card className="bg-transparent border-0 shadow-none md:bg-card/50 md:border-border/50 md:shadow-sm min-h-[300px] flex items-center justify-center p-4">
          <div className="w-full text-center">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-primary">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="mt-4 font-headline text-lg">Running prediction model...</p>
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {predictionResponse && (
              <div className="animate-in fade-in-50 duration-500">
                <h2 className="font-headline text-2xl text-primary mb-4">Prediction Result</h2>
                <div
                  className={cn(
                    "rounded-lg p-6 text-2xl font-bold font-headline tracking-wider flex items-center justify-center gap-4",
                    predictionResponse.prediction === 'Is an Exoplanet'
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  )}
                >
                    {predictionResponse.prediction === 'Is an Exoplanet' ? 
                        <CheckCircle2 className="h-8 w-8" /> :
                        <XCircle className="h-8 w-8" />
                    }
                  <span>{predictionResponse.prediction}</span>
                </div>
                <div className="mt-4 text-lg text-muted-foreground">
                  Confidence: <span className="font-bold text-foreground">{predictionResponse.confidence}</span>
                </div>
              </div>
            )}
            
            {!isLoading && !error && !predictionResponse && (
              <div className="text-center text-muted-foreground">
                <p className="font-headline text-lg">Awaiting Input</p>
                <p>Fill in the parameters and run the prediction model.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
