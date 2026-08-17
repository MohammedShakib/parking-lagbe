import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProfileWithAccount, UserRole } from "../supabase/database.types";
import { createSafeSupabaseServerClient, createSupabaseServerClient } from "../supabase/server";

/**
 * Gets the current Supabase Auth user, if authenticated.
 */
export async function getCurrentUser() {
  const supabase = await createSafeSupabaseServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Gets the full combined profile (account_information + personal_information + role) for the authenticated user.
 */
export async function getCurrentProfile(): Promise<ProfileWithAccount | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();

  // 1. Fetch account information
  const { data: account, error: accountError } = await supabase
    .from("account_information")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (accountError || !account) {
    // If account record is missing but user is authenticated, construct fallback
    const role: UserRole = user.email?.includes("admin") ? "admin" : "regular_user";
    return {
      auth_user_id: user.id,
      username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
      email: user.email || "",
      first_name: user.user_metadata?.first_name || "User",
      last_name: user.user_metadata?.last_name || "",
      phone: user.user_metadata?.phone || null,
      address: null,
      status: "unverified",
      owner_id: null,
      default_dashboard: "user",
      points: 0,
      user_level: "bronze",
      total_earned_points: 0,
      role,
    };
  }

  // 2. Fetch personal information
  const { data: personal } = await supabase
    .from("personal_information")
    .select("*")
    .eq("username", account.username)
    .maybeSingle();

  // 3. Determine role
  let role: UserRole = "regular_user";
  let isVerifiedOwner = false;

  if (account.username === "admin" || user.user_metadata?.role === "admin" || user.app_metadata?.role === "admin") {
    role = "admin";
  } else {
    // Check dual user first
    const { data: dual } = await supabase
      .from("dual_user")
      .select("owner_id, is_verified")
      .eq("username", account.username)
      .maybeSingle();

    if (dual) {
      role = "dual_user";
      isVerifiedOwner = dual.is_verified;
    } else {
      // Check garage owners
      const { data: garageOwner } = await supabase
        .from("garage_owners")
        .select("owner_id, is_verified")
        .eq("username", account.username)
        .maybeSingle();

      if (garageOwner) {
        role = "garage_owner";
        isVerifiedOwner = garageOwner.is_verified;
      }
    }
  }

  return {
    auth_user_id: user.id,
    username: account.username,
    email: personal?.email || user.email || "",
    first_name: personal?.first_name || user.user_metadata?.first_name || account.username,
    last_name: personal?.last_name || user.user_metadata?.last_name || "",
    phone: personal?.phone || null,
    address: personal?.address || null,
    status: account.status,
    owner_id: account.owner_id,
    default_dashboard: account.default_dashboard,
    points: account.points,
    user_level: account.user_level,
    total_earned_points: account.total_earned_points,
    role,
    is_verified_owner: isVerifiedOwner,
  };
}

/**
 * Signs the user out, clears session cookies, and redirects to login.
 */
export async function signOutAction() {
  "use server";
  const supabase = await createSafeSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Switches the user's default dashboard between 'user' and 'business'.
 */
export async function switchDashboardAction(target: "user" | "business") {
  "use server";
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("account_information")
    .update({ default_dashboard: target })
    .eq("auth_user_id", user.id);

  revalidatePath("/", "layout");
  if (target === "business") {
    redirect("/business");
  } else {
    redirect("/dashboard");
  }
}
