"use client";

import { Field, PrimaryButton, TextInput } from "@/components/auth/fields";
import { authClient } from "@/lib/auth-client";



export default function ProfilePage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-[#62dfdf]">Account Details</h2>

      <div className="bg-white p-6 rounded-xl border border-[#DEDACE] shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#0E1B1B] text-white flex items-center justify-center text-xl font-bold">
          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#0E1B1B]">
            {session?.user?.name || "User Name"}
          </h3>
          <p className="text-sm text-[#6B7268]">{session?.user?.email}</p>
        </div>
      </div>

      <form className="bg-white p-6 rounded-xl border border-[#DEDACE] shadow-sm space-y-4">
        <div>
          <Field label="Full name" htmlFor="name" />
          <TextInput id="name" type="text" defaultValue={session?.user?.name || ""} />
        </div>

        <div>
          <Field label="Email address" htmlFor="email" />
          <TextInput
            id="email"
            type="email"
            defaultValue={session?.user?.email || ""}
            disabled
          />
        </div>

        <PrimaryButton type="submit">Save Changes</PrimaryButton>
      </form>
    </div>
  );
}