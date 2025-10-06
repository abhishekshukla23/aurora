# **App Name**: Aurora

## Core Features:

- Feature Input Form: Form with six inputs to collect exoplanet feature data: Planet Orbital Period, Planet Transit Duration, Planet Transit Depth, Planet Radius, Stellar Effective Temperature, Stellar Radius. Includes input validation for positive numbers.
- Prediction Engine: Fetch exoplanet predictions with confidence level from the serverless backend. Enables CORS. Displays 'Is an Exoplanet' in a green box and 'Not an Exoplanet' in a gray box. Displays a loading spinner while waiting for the prediction and an error message if the backend returns an error.
- AI Prediction Tool: Use a pre-trained scikit-learn model to predict exoplanet status based on input features; returns a JSON prediction with confidence. This tool provides the prediction to the Prediction Engine.

## Style Guidelines:

- Background color: Dark gray (#222222) to provide a space-like ambience and contrast for the data display.
- Primary color: Electric blue (#7DF9FF) to reflect scientific and futuristic data presentation; prominent for key UI elements like prediction results.
- Accent color: Violet (#D02090) for highlighting interactive elements and to complement the electric blue; for calls to action and input field highlighting.
- Body font: 'Inter', sans-serif, for clean and easily readable data presentation and labels.
- Headline font: 'Space Grotesk', sans-serif, to give a tech and scientific look to titles and section headers.
- Use a single-column layout for straightforward navigation and form input on smaller screens; grid layout for wider screens.
- Use icons to depict each input feature type, enhancing the visual intuitiveness of data fields (e.g., a planet icon for radius).