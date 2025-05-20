import {pgTable ,uuid , text , timestamp} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './user_schema';

export const project = pgTable('project' , {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    userId: uuid('user_id')
    .notNull()
    .references(() => users.id , {onDelete: 'cascade'}),
})