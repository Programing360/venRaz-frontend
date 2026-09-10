import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(
  process.env.MONGODB_URL || "mongodb://localhost:27017",
);

const db = client.db(process.env.MONGODB_DATABASE || "venraz");

const ADMIN_EMAIL = "fhlimon36@gmail.com";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
      },
    },
  },

  // Server-side hook to automatically set the user role on creation
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const isAdmin =
            user.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

          return {
            data: {
              ...user,
              role: isAdmin ? "admin" : "user",
            },
          };
        },
      },
    },
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
