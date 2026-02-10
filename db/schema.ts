import {
  pgTable,
  text,
  boolean,
  timestamp,
  bigint,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(), // required
  customerId: text("id").unique(), // ID from Lemonsqueezy
  name: text("name").notNull(), // required
  email: text("email").notNull().unique(), // required
  emailVerified: boolean("emailVerified").notNull(), // required
  image: text("image"), // optional
  createdAt: timestamp("createdAt").notNull().defaultNow(), // required
  updatedAt: timestamp("updatedAt").notNull().defaultNow(), // required
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),

  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),

  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),

  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"),

  createdAt: timestamp("createdAt").notNull().defaultNow(), // required
  updatedAt: timestamp("updatedAt").notNull().defaultNow(), // required
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(), // required
  updatedAt: timestamp("updatedAt").notNull().defaultNow(), // required
});

/**
 * Products table
 */
export const products = pgTable("products", {
  variantId: bigint("variant_id", { mode: "number" }).primaryKey(),
  productId: bigint("product_id", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(), // required
  updatedAt: timestamp("updatedAt").notNull().defaultNow(), // required
});

/**
 * Subscriptions table
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerId: text("customer_id")
    .notNull()
    .unique()
    .references(() => account.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),

  subscriptionId: integer("subscription_id").notNull(),

  productId: bigint("product_id", { mode: "number" }).notNull(),

  variantId: bigint("variant_id", { mode: "number" })
    .notNull()
    .references(() => products.variantId, {
      onUpdate: "cascade",
    }),

  status: text("status").notNull(),

  cancelled: boolean("cancelled").default(false),

  renewsAt: timestamp("renews_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),

  createdAt: timestamp("createdAt").notNull().defaultNow(), // required
  updatedAt: timestamp("updatedAt").notNull().defaultNow(), // required
});
