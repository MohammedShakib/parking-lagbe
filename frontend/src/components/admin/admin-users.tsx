"use client";

import { useEffect, useState } from "react";

interface AdminUser {
  username: string;
  email: string;
  name: string;
  phone: string;
  status: "verified" | "unverified" | "suspended";
  points: number;
  user_level: "Bronze" | "Gold" | "Diamond";
  registration_date: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
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

  const handleUpdateStatus = async (username: string, newStatus: string) => {
    setUpdatingUser(username);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newStatus }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch {
      // Handled
    } finally {
      setUpdatingUser(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">User Accounts & Verification</h2>
          <p className="text-xs text-neutral-400">
            Audit registered drivers, adjust VIP tiers, and manage account statuses.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, name, or email..."
          className="w-full sm:w-72 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
          No users match the search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">VIP Tier & Points</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {filtered.map((u) => (
                <tr key={u.username} className="hover:bg-neutral-800/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">@{u.username}</div>
                    <div className="text-[11px] text-neutral-400">{u.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{u.email}</div>
                    <div className="text-[11px] text-neutral-500">{u.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-amber-400">{u.user_level}</span>
                    <div className="text-[11px] text-neutral-400">{u.points} pts</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        u.status === "verified"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : u.status === "suspended"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-neutral-800 text-neutral-400 border-neutral-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {u.status !== "verified" && (
                      <button
                        disabled={updatingUser === u.username}
                        onClick={() => handleUpdateStatus(u.username, "verified")}
                        className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-neutral-950 hover:bg-emerald-400 transition"
                      >
                        Verify ✓
                      </button>
                    )}
                    {u.status !== "suspended" && (
                      <button
                        disabled={updatingUser === u.username}
                        onClick={() => handleUpdateStatus(u.username, "suspended")}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition"
                      >
                        Suspend
                      </button>
                    )}
                    {u.status === "suspended" && (
                      <button
                        disabled={updatingUser === u.username}
                        onClick={() => handleUpdateStatus(u.username, "verified")}
                        className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-teal-400 hover:bg-teal-500/20 transition"
                      >
                        Reactivate
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
