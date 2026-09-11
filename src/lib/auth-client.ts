// lib/auth-client.ts

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(), // Automatically attaches role to session.user
  ],
  baseURL: "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
