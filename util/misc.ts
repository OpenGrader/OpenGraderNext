import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "types";

export const queryParamToNumber = (param: string | string[] | undefined): number => {
  if (param == null) return -1;
  if (Array.isArray(param)) return parseInt(param[0]);
  return parseInt(param);
};

export const getCurrentUser = async (client: SupabaseClient): Promise<User | null> => {
  const { data: su, error: suError } = await client.auth.getUser();

  if (suError) {
    throw new Error("Could not find user.");
  }

  const suId = su.user.id;
  const { data: profile, error } = await client
    .from("user")
    .select("id, given_name, family_name, euid, email, auth_id, can_create_class")
    .eq("auth_id", suId)
    .single();

  if (error || !profile) {
    return null;
  }

  return {
    id: profile.id,
    name: `${profile.given_name} ${profile.family_name}`,
    given_name: profile.given_name,
    family_name: profile.family_name,
    euid: profile.euid,
    canCreateClass: profile.can_create_class,
    // stub
    grade: 0,
    submissionCount: 0,
    alerts: { missing: 0, plagiarism: 0, errors: 0 },
    auth_id: profile.auth_id,
  };
};
