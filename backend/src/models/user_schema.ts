import {pgTable , text , uuid , timestamp , jsonb} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users' , {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    refreshToken: text('refresh_token'),  
    accessToken: text('access_token'),  
    recentChoices: jsonb('recentChoices').default(sql`'[]'::jsonb`),
})

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;