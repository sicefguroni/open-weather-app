// server/routes/weatherRoutes.ts
import { Router } from 'express';
import { fetchWeatherProxy } from '../services/openWeatherProxyService'; // <-- Import the service function

const router = Router(); // Junior Dev Tip: This is the critical object needed for app.use()

// GET /api/weather?location=Paris
router.get('/', async (req, res) => {
    const { location, lat, lon } = req.query; 

    try {
        // Validation: Ensure at least one form of location is provided
        if (!location && (!lat || !lon)) {
             return res.status(400).json({ error: "Missing location or coordinates." });
        }
        
        // 1. Call the service function to execute the business logic
        const data = await fetchWeatherProxy(
            location as string, 
            lat ? parseFloat(lat as string) : null, 
            lon ? parseFloat(lon as string) : null
        );
        
        // 2. Send the result back to the frontend
        res.status(200).json(data);
    } catch (error: any) {
        console.error("Proxy error:", error);
        // Architecture: Return a generic 500 error to hide specific API details
        // Note: fetchWeatherProxy throws an error if location is not found (404)
        const statusCode = error.message.includes("not found") ? 404 : 500;
        res.status(statusCode).json({ error: error.message || "Failed to retrieve weather data." });
    }
});

// Architecture Decision: We must export the router object so server.ts can use it.
export default router;