// New Frontend service file: src/services/crudService.ts
const BACKEND_URL = 'http://localhost:3001/api/queries'; // Assuming your backend runs on port 3001

export const createWeatherQuery = async (locationName: string, startDate: string, endDate: string) => {
    // Junior Dev Tip: You are now calling YOUR server, not the weather API directly!
    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationName, startDate, endDate }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create query on backend.");
    }
    return response.json();
};
// You'd repeat this for READ, UPDATE, and DELETE.