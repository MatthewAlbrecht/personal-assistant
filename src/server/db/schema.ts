// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  date,
  mysqlTableCreator,
  timestamp,
  varchar,
  year,
  tinyint,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `personal-assistant_${name}`,
);

export const people = mysqlTable(
  "person",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    slug: varchar("slug", { length: 256 }).unique(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    birthday: date("birthday"),
    yearMet: year("year_met"),
    checkInCadence: tinyint("check_in_cadence").notNull(),
    phoneNumber: varchar("phone_number", { length: 32 }),
    email: varchar("email", { length: 256 }),
    nextCheckInDate: date("next_check_in_date").notNull(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const peopleRelations = relations(people, ({ many }) => ({
  checkIns: many(checkIns),
  peopleToTags: many(peopleToTags),
}));

// create a check-ins table
export const checkIns = mysqlTable(
  "check_in",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    personId: bigint("person_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    checkInDate: date("check_in_date"),
    checkInRating: tinyint("check_in_rating"),
    checkInNotes: varchar("check_in_notes", { length: 256 }),
  },
  (example) => ({
    personIdIndex: index("person_id_idx").on(example.personId),
  }),
);

export const checkInRelations = relations(checkIns, ({ one }) => ({
  person: one(people, {
    fields: [checkIns.personId],
    references: [people.id],
  }),
}));

// create a tags table
export const tags = mysqlTable(
  "tag",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const tagRelations = relations(tags, ({ many }) => ({
  peopleToTags: many(peopleToTags),
}));

export const peopleToTags = mysqlTable(
  "people_to_tags",
  {
    personId: bigint("person_id", { mode: "number" }).notNull(),
    tagId: bigint("tag_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    primary: index("primary_idx").on(example.personId, example.tagId),
  }),
);

export const peopleToTagsRelations = relations(peopleToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [peopleToTags.tagId],
    references: [tags.id],
  }),
  person: one(people, {
    fields: [peopleToTags.personId],
    references: [people.id],
  }),
}));
