import { boolean, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('aiOutput',{
    id:serial('id').primaryKey(),
    formData:varchar('formData'),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug'),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt')
})

export const UserSubscription=pgTable('userSubscription',{
    id:serial('id').primaryKey(),
    email:varchar('email'),
    userName:varchar('userName'),
    active:boolean('active'),
    paymentId:varchar('paymentId'),
    joinDate:varchar('joinData')
})

// --- Analytics event logging table ---
export const Analytics = pgTable('analytics', {
    id: serial('id').primaryKey(),
    userId: varchar('userId'), // User identifier (can be null for anonymous events)
    eventType: varchar('eventType'), // e.g., 'login', 'caption_generated', 'post_published'
    timestamp: varchar('timestamp'), // Store as ISO string for simplicity
    metadata: text('metadata'), // JSON string for any extra info
});