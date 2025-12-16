# ☀️ Weather Application
This project is a full-stack weather application built as a technical assessment. It demonstrates industry-standard practices, focusing on secure API key management, and robust data persistence (CRUD), and advanced user experience features.

## 🚀 Key Features Demonstrated
### Real-Time Weather & Security
- Secure API Proxy: All OpenWeatherMap API calls (Current Weather, 5-Day Forecast) are proxied through the Express backend to protect the API key from client-side exposure. This is an industry-standard security measure.

- Flexible Location Input: Supports location input by City Name, ZIP/Postal Code, or real-time device geolocation ("Use Current Location").

- 5-Day Forecast: Consolidated 5-day temperature forecasts are displayed, meeting the "Stand Apart" requirement.

### Data Persistence (CRUD) & Validation
- Full CRUD System: Allows users to Create, Read, Update, and Delete historical weather queries, persisting data to a remote PostgreSQL database.

- Location/Date Validation: The backend uses the OpenWeatherMap Geocoding API to validate that a location exists and checks date range integrity before saving or updating data.
