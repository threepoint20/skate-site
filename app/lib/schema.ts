// Neon PostgreSQL 資料庫 Schema
import { pgTable, serial, text, integer, timestamp, json } from 'drizzle-orm/pg-core';

// 部落格文章表
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  date: text('date').notNull(),
  category: text('category').notNull(),
  readTime: text('read_time').notNull(),
  author: text('author').notNull(),
  tags: json('tags').$type<string[]>().notNull().default([]),
  status: text('status').notNull().default('已發布'),
  views: integer('views').notNull().default(0),
  coverImage: text('cover_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;