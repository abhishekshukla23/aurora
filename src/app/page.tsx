import ExoplanetAnalyzer from '@/components/aurora/exoplanet-analyzer';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-primary">
          Aurora
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Analyze celestial object parameters to generate an AI-powered description and assess its characteristics.
        </p>
      </div>
      <ExoplanetAnalyzer />
    </main>
  );
}
