// Paste this code into your main component file, e.g., src/components/exoplanet-analyzer.tsx

'use client'; // This is important for Next.js to run this code in the browser

import { useState, useEffect } from 'react';
import { InferenceSession, Tensor } from 'onnxruntime-web';

export function ExoplanetAnalyzer() {
  const [session, setSession] = useState<InferenceSession | null>(null);
  const [formData, setFormData] = useState({
    pl_orbper: '10.5',
    pl_trandur: '3.2',
    pl_trandep: '2500',
    pl_rade: '12.0',
    st_teff: '5800',
    st_rad: '1.1',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<{ prediction: string; confidence: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelPath = '/model.onnx';
        const newSession = await InferenceSession.create(modelPath);
        setSession(newSession);
        setIsLoading(false);
      } catch (e) {
        setError('Failed to load the AI model.');
        setIsLoading(false);
        console.error(e);
      }
    };
    loadModel();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      setError('Model is not loaded yet.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const inputData = new Float32Array(Object.values(formData).map(Number));
      const inputTensor = new Tensor('float_input', inputData, [1, 6]);
      const feeds = { [session.inputNames[0]]: inputTensor };
      const results = await session.run(feeds);
      
      const predictionLabel = results.output_label.data[0] as number;
      const confidenceScores = results.probabilities.data as Float32Array;
      
      const predictionText = predictionLabel === 1 ? 'Is an Exoplanet' : 'Not an Exoplanet';
      const confidence = predictionLabel === 1 ? confidenceScores[1] : confidenceScores[0];

      setResult({
        prediction: predictionText,
        confidence: `${(confidence * 100).toFixed(2)}%`,
      });
    } catch (e) {
      setError('An error occurred during prediction.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto p-4">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Exoplanet Parameters</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-300 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="number"
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                step="any"
                required
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          <button type="submit" disabled={isLoading} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
            {isLoading ? 'Processing...' : 'Predict Exoplanet'}
          </button>
        </form>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg p-8 text-center">
        {isLoading && !result && <div className="text-gray-400">Loading AI Model...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {result && (
          <div className="text-white">
            <h3 className="text-lg font-semibold">Prediction Result</h3>
            <p className="text-2xl mt-2" style={{ color: result.prediction === 'Is an Exoplanet' ? '#4ade80' : '#f87171' }}>
              {result.prediction}
            </p>
            <p className="text-lg mt-1">Confidence: {result.confidence}</p>
          </div>
        )}
        {!isLoading && !result && !error && (
          <div className="text-gray-400">
            <h3 className="text-lg font-semibold">Awaiting Input</h3>
            <p>Fill in the parameters and run the prediction model.</p>
          </div>
        )}
      </div>
    </div>
  );
}

