import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const unicorns = pgTable(
  "unicorns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    features: jsonb("features").notNull().default({}),
    position: jsonb("position").notNull().default({ x: 0, y: 0, z: 0 }),
    velocity: jsonb("velocity").notNull().default({ x: 0, y: 0, z: 0 }),
  },
  (table) => ({
    userIdIdx: index("idx_unicorns_user_id").on(table.userId),
    createdAtIdx: index("idx_unicorns_created_at").on(table.createdAt),
  }),
);
