import { Router, Request, Response } from 'express';
import pool from '../db/db';

const router = Router();

// POST /api/queries
// Required: Allow user(s) to enter both a location and a date range
router.post('/', async (req: Request, res: Response) => {
    const { locationName, startDate, endDate } = req.body;

    // --- Validation ---
    if (!locationName || !startDate || !endDate) {
        return res.status(400).json({ error: "Missing required fields: location, start date, and end date." });
    }

    // Validate the date ranges
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
        return res.status(400).json({ error: "Start date must not be after the end date." });
    }

    try {
        // 1. Validate Location & Get Coordinates (API Integration)
        // We assume fetchHistoricalData handles location validation 
        // by converting the name to precise lat/lon.


        // 2. Store all information into a database (CREATE)
        const queryText = `
            INSERT INTO "WeatherQuery" 
                ("locationName", latitude, longitude, "startDate", "endDate", "retrievedData")
            VALUES 
                ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `;
        const values = [locationName, startDate, endDate];

        const result = await pool.query(queryText, values);
        
        // Success: Return the newly created record
        res.status(201).json(result.rows[0]); 

    } catch (error) {
        console.error("Database error during CREATE:", error);
        res.status(500).json({ error: "Failed to process weather query and save to database." });
    }
});
// Export the router for use in server.ts
export default router;

// GET /api/queries - Read all previously requested data
router.get('/', async (req: Request, res: Response) => {
    try {
        // Allows users to read any of the weather information they have requested previously
        const queryText = `
            SELECT id, "locationName", "startDate", "endDate", "createdAt"
            FROM "WeatherQuery" 
            ORDER BY "createdAt" DESC;
        `;
        const result = await pool.query(queryText);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Database error during READ all:", error);
        res.status(500).json({ error: "Failed to retrieve queries from database." });
    }
});

// GET /api/queries/:id - Read a single query detail (including the heavy weather data)
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const queryText = `
            SELECT *
            FROM "WeatherQuery" 
            WHERE id = $1;
        `;
        const result = await pool.query(queryText, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Query ID not found." });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Database error during READ one:", error);
        res.status(500).json({ error: "Failed to retrieve query details." });
    }
});

// PUT /api/queries/:id
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { locationName, startDate, endDate } = req.body;
    
    // Validation is critical here as well (same checks as CREATE)
    if (!locationName || !startDate || !endDate) {
        return res.status(400).json({ error: "Missing required fields for update." });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
        return res.status(400).json({ error: "Start date must not be after the end date." });
    }
    
    try {


        // 2. UPDATE the database record
        const queryText = `
            UPDATE "WeatherQuery"
            SET 
                "locationName" = $1, 
                latitude = $2, 
                longitude = $3, 
                "startDate" = $4, 
                "endDate" = $5, 
                "retrievedData" = $6 
            WHERE 
                id = $7
            RETURNING *;
        `;
        const values = [locationName, startDate, endDate, id];

        const result = await pool.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Cannot update record: ID not found." });
        }
        
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Database error during UPDATE:", error);
        res.status(500).json({ error: "Failed to update weather query." });
    }
});


// DELETE /api/queries/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Allow users to be able to delete any of the records in the database.
        const queryText = `
            DELETE FROM "WeatherQuery"
            WHERE id = $1
            RETURNING *;
        `;
        const result = await pool.query(queryText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Cannot delete record: ID not found." });
        }
        
        // Industry Standard: Return 204 No Content for a successful DELETE with no body, 
        // or 200 with the deleted object for confirmation.
        res.status(200).json({ message: `Record with ID ${id} deleted successfully.` }); 

    } catch (error) {
        console.error("Database error during DELETE:", error);
        res.status(500).json({ error: "Failed to delete weather query." });
    }
});