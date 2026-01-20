import { pgTable, serial, varchar, text, boolean, json, integer } from "drizzle-orm/pg-core";

// Courses table
export const CourseList = pgTable("course_list", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  level: varchar("level").notNull(),
  includeVideo: varchar("includeVideo").notNull().default("Yes"),
  courseOutput: text("courseOutput").notNull(),
  createdBy: varchar("createdBy").notNull(),
  userName: varchar("userName").notNull(),
  userProfileImage: varchar("userProfileImage").notNull(),
  // Fix: Use a working default image URL
  courseBanner: varchar("courseBanner").default(
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80"
  ),
  publish: boolean("publish").default(false),
  Duration: varchar("duration").notNull().default("1 Hour"), // Added missing field with default
  noOfChapters: varchar("noOfChapters").notNull().default("0"), // Added missing field with default
});

// Chapters table — supports multiple videos
export const Chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  content: json("content").notNull(),    // store AI generated JSON content
  userName: varchar("userName").notNull(),
  videoId: varchar("videoId").default(null),
  chapterIndex: integer("chapterIndex").default(0),
});