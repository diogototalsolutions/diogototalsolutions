import "server-only";
import { db } from "@/lib/supabase/rest";

export async function getActiveServices() {
  return db.select("services?select=id,title,description&is_public=eq.true&status=eq.active&order=created_at.desc");
}
