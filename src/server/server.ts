
// Import our route handlers
import queryRoutes from './routes/queryRoutes';
import weatherRoutes from './routes/weatherRoutes';
// server/server.ts
import express from 'express';
import cors from 'cors'; // Essential for frontend-backend communication
import * as dotenv from 'dotenv';
dotenv.config();


// Initialize the app
const app = express();
const PORT = process.env.PORT || 3001; // Backend usually runs on a different port than React (e.g., 3000)

// --- Industry Standard Middleware ---
// 1. CORS: Allows your React app (default: localhost:3000) to safely talk to your backend (localhost:3001).
// Junior Dev Tip: In production, you would restrict origin to your actual domain.
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// 2. JSON Body Parser: Allows Express to read JSON data sent in POST/PUT requests (like when creating a query).
app.use(express.json());

// --- Register Routes ---
// This is where we map our logic to API paths
app.use('/api/queries', queryRoutes); // CRUD operations (CREATE/READ/UPDATE/DELETE)
app.use('/api/weather', weatherRoutes); // Weather Proxy (INSTRUCTION #1 data, now secure)
// Start the server
app.listen(PORT, () => {
    console.log(`\n\n🚀 Backend Server running on http://localhost:${PORT}`);
    console.log('--- Ready for Frontend Connection ---');
});