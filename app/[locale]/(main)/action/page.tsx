import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { SearchArea } from "./components/search-area";

export default async function ActionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  return <SearchArea />;
}
