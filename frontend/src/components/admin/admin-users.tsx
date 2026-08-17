"use client";

import { useEffect, useState } from "react";

interface AdminUserItem {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  status: "verified" | "unverified" | "suspended";
  role: "admin" | "garage_owner" | "driver";
  points: number;
  user_level: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!ignore && data.users) {
          setUsers(data.users);
        }
      } catch {
        // Handled
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleVerify = async (username: string, status: "verified" | "unverified") => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user status");
      }

      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating user");
    }
  };

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Account Management & Verification</h2>
          <p className="text-xs text-slate-500">
            Monitor registered driver accounts, verify identity status, and manage platform roles.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username, email, name..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#f39c12]"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-xs text-slate-500">No user accounts found matching query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">User & Name</th>
                <th className="p-4">Email & Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Points & Tier</th>
                <th className="p-4">Identity Status</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.username} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">
                      {u.first_name} {u.last_name}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">@{u.username}</div>
                  </td>

                  <td className="p-4">
                    <div className="text-slate-900">{u.email}</div>
                    <div className="text-slate-500 text-[11px]">{u.phone || "No phone"}</div>
                  </td>

                  <td className="p-4">
                    <span className="capitalize font-semibold text-slate-700">
                      {u.role === "admin"
                        ? "🛡️ Super Admin"
                        : u.role === "garage_owner"
                        ? "🏢 Space Host"
                        : "🚗 Driver"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-[#d97706]">{u.points} PTS</div>
                    <span className="text-[10px] text-slate-500 capitalize">{u.user_level} VIP</span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        u.status === "verified"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {u.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {u.status !== "verified" ? (
                      <button
                        onClick={() => handleVerify(u.username, "verified")}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                      >
                        ✓ Mark Verified
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(u.username, "unverified")}
                        className="rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-3 py-1.5 text-xs font-medium text-slate-700 transition border border-slate-200"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
