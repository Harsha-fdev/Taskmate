import dotenv from 'dotenv';
dotenv.config(); 

import { app } from './app';
import { db } from './db/db_connect';
import { users } from './models/user_schema';

const port = process.env.PORT || 8000;

(async () => {
  try {
    // Simple test query to check DB connection
    await db.select().from(users).limit(1);//checks atleast 1 table is present or not
    console.log('Database connected successfully.');

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();
