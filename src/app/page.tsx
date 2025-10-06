import ExoplanetAnalyzer from '@/components/aurora/exoplanet-analyzer';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-primary">
          Aurora
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Use a machine learning model to predict if a celestial object is an exoplanet based on its parameters.
        </p>
      </div>
      <ExoplanetAnalyzer />
    </main>
  );
}
