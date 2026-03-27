import dotenv from 'dotenv';

// Load environment variables early (explicit path to backend/.env)
dotenv.config({ path: new URL('../.env', import.meta.url) });

