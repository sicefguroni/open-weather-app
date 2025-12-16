import { Pool } from 'pg'; // Import the PostgreSQL client pool
import * as dotenv from 'dotenv';
dotenv.config();

// Pool manages connections to the database efficiently by preventing resource exhaustion
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
})

// Test connection (non-blocking - server will start even if DB is unavailable)
pool.query('SELECT NOW()')
    .then(res => console.log('✅ PostgreSQL connection successful', res.rows[0].now))
    .catch(err => {
        console.error('⚠️  PostgreSQL connection failed:', err.message);
    });

// Export the pool for use in other files
export default pool;