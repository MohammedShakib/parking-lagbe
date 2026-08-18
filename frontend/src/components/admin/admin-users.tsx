"use client";

import { useEffect, useState } from "react";
import { Search, MoreHorizontal, UserCheck, UserX, User, Settings, Check } from "lucide-react";

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
    if (!window.confirm(`Are you sure you want to change verification status to ${status}?`)) return;
    
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] mb-1">Users</h1>
          <p className="text-sm text-slate-500">
            Total {users.length} registered accounts
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EAF0] text-sm text-slate-900 rounded-lg outline-none focus:border-[#149fe8]"
            />
          </div>
          <button className="bg-white border border-[#E5EAF0] text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 rounded-xl bg-slate-100 border border-[#E5EAF0] animate-pulse" />
      ) : (
        <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
            <thead className="bg-[#F7F9FC] text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-[#E5EAF0]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Loyalty</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.username} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3">
                      <div className="font-semibold text-slate-900">
                        {u.first_name} {u.last_name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">@{u.username}</div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="text-slate-900">{u.email}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{u.phone || "No phone"}</div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 capitalize font-medium text-slate-700 text-[13px]">
                        {u.role === "admin" ? <Settings className="w-3.5 h-3.5" /> : u.role === "garage_owner" ? <UserCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {u.role.replace("_", " ")}
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="font-semibold text-slate-900">{u.points}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 capitalize">{u.user_level}</div>
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          u.status === "verified"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {u.status === "verified" ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status !== "verified" ? (
                          <button
                            onClick={() => handleVerify(u.username, "verified")}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition border border-emerald-100"
                            title="Verify User"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(u.username, "unverified")}
                            className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded transition border border-transparent"
                            title="Revoke Verification"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded transition" title="More Options">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
