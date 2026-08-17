import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProfileWithAccount, UserRole } from "../supabase/database.types";
import { createSafeSupabaseServerClient, createSupabaseServerClient } from "../supabase/server";

/**
 * Gets the current Supabase Auth user, or returns mock user representation if in demo mode.
 */
export async function getCurrentUser() {
  const supabase = await createSafeSupabaseServerClient();
  if (supabase) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) return user;
    } catch {
      // Fallback
    }
  }

  // Fallback demo user check via cookie
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("pl_demo_role")?.value;
  const demoUsername = cookieStore.get("pl_demo_username")?.value || "demo_user";

  if (demoRole || demoUsername) {
    return {
      id: `local-${demoRole || "user"}-id`,
      email: `${demoUsername}@parkinglagbe.com`,
      user_metadata: {
        username: demoUsername,
        role: demoRole || "regular_user",
        first_name: demoRole === "admin" ? "Admin" : demoRole === "garage_owner" ? "Garage" : "Demo",
        last_name: demoRole === "garage_owner" ? "Host" : "User",
      },
      app_metadata: {
        role: demoRole || "regular_user",
      },
    } as unknown as {
      id: string;
      email: string;
      user_metadata: Record<string, unknown>;
      app_metadata: Record<string, unknown>;
    };
  }

  return null;
}

/**
 * Gets the full combined profile (account_information + personal_information + role).
 * Automatically provides rich mock data when operating locally.
 */
export async function getCurrentProfile(): Promise<ProfileWithAccount | null> {
  const cookieStore = await cookies();
  const demoRole = (cookieStore.get("pl_demo_role")?.value as UserRole) || "regular_user";
  const demoUsername = cookieStore.get("pl_demo_username")?.value || "demo_driver";

  const user = await getCurrentUser();

  const supabase = await createSafeSupabaseServerClient();
  if (supabase && user && !user.id.startsWith("local-")) {
    try {
      // 1. Fetch account information
      const { data: account, error: accountError } = await supabase
        .from("account_information")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (!accountError && account) {
        // 2. Fetch personal information
        const { data: personal } = await supabase
          .from("personal_information")
          .select("*")
          .eq("username", account.username)
          .maybeSingle();

        // 3. Determine role
        let role: UserRole = "regular_user";
        let isVerifiedOwner = false;

        if (
          account.username === "admin" ||
          user.user_metadata?.role === "admin" ||
          user.app_metadata?.role === "admin"
        ) {
          role = "admin";
        } else {
          const { data: dual } = await supabase
            .from("dual_user")
            .select("owner_id, is_verified")
            .eq("username", account.username)
            .maybeSingle();

          if (dual) {
            role = "dual_user";
            isVerifiedOwner = dual.is_verified;
          } else {
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
          first_name: personal?.first_name || (user.user_metadata?.first_name as string) || account.username,
          last_name: personal?.last_name || (user.user_metadata?.last_name as string) || "",
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
    } catch {
      // Fallback to local profile
    }
  }

  // Fallback rich local demo profile based on role
  if (demoRole === "admin" || demoUsername.includes("admin")) {
    return {
      auth_user_id: "demo-admin-id",
      username: "admin",
      email: "admin@parkinglagbe.com",
      first_name: "Super",
      last_name: "Admin",
      phone: "+880 1711-000000",
      address: "Dhaka Central Command, Bangladesh",
      status: "verified",
      owner_id: null,
      default_dashboard: "admin",
      points: 9999,
      user_level: "diamond",
      total_earned_points: 9999,
      role: "admin",
      is_verified_owner: true,
    };
  }

  if (demoRole === "garage_owner" || demoUsername.includes("owner") || demoUsername.includes("host")) {
    return {
      auth_user_id: "demo-owner-id",
      username: demoUsername || "demo_owner",
      email: `${demoUsername || "owner"}@parkinglagbe.com`,
      first_name: "Rafiqul",
      last_name: "Islam",
      phone: "+880 1819-123456",
      address: "House 45, Road 11, Banani, Dhaka",
      status: "verified",
      owner_id: "owner-banani-01",
      default_dashboard: "business",
      points: 3450,
      user_level: "diamond",
      total_earned_points: 5200,
      role: "garage_owner",
      is_verified_owner: true,
    };
  }

  // Default driver profile
  return {
    auth_user_id: "demo-driver-id",
    username: demoUsername || "demo_driver",
    email: `${demoUsername || "driver"}@parkinglagbe.com`,
    first_name: "Shakib",
    last_name: "Ahmed",
    phone: "+880 1712-345678",
    address: "Gulshan 2, Dhaka, Bangladesh",
    status: "verified",
    owner_id: null,
    default_dashboard: "user",
    points: 1250,
    user_level: "gold",
    total_earned_points: 2400,
    role: "regular_user",
    is_verified_owner: false,
  };
}

/**
 * Signs the user out, clears session cookies, and redirects to login.
 */
export async function signOutAction() {
  "use server";
  const supabase = await createSafeSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut().catch(() => {});
  }
  const cookieStore = await cookies();
  cookieStore.delete("pl_demo_role");
  cookieStore.delete("pl_demo_username");
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Switches the user's default dashboard between 'user' and 'business'.
 */
export async function switchDashboardAction(target: "user" | "business") {
  "use server";
  const cookieStore = await cookies();
  const newRole: UserRole = target === "business" ? "garage_owner" : "regular_user";
  cookieStore.set("pl_demo_role", newRole, { path: "/" });

  const user = await getCurrentUser();
  const supabase = await createSafeSupabaseServerClient();
  if (supabase && user && !user.id.startsWith("local-")) {
    try {
      await supabase
        .from("account_information")
        .update({ default_dashboard: target })
        .eq("auth_user_id", user.id);
    } catch {
      // Ignored in local mode
    }
  }

  revalidatePath("/", "layout");
  if (target === "business") {
    redirect("/business");
  } else {
    redirect("/dashboard");
  }
}
