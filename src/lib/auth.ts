// lib/auth.ts

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(
  process.env.MONGODB_URL || "mongodb://localhost:27017"
);

const db = client.db(
  process.env.MONGODB_DATABASE || "venraz"
);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    jwt({
      jwt: {
        issuer: "venraz",
        audience: "venraz",
        expirationTime: "15m",
      },
    }),
  ],
});