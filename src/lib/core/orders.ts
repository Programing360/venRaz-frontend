"use server";

import { getUserToken } from "./session";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is missing");
}

export const authHeaders = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  return header;
};
