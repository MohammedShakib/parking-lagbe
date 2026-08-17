"use client";

import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

interface ProfileEditorProps {
  initialProfile: ProfileWithAccount | null;
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(initialProfile?.first_name || "");
  const [lastName, setLastName] = useState(initialProfile?.last_name || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [address, setAddress] = useState(initialProfile?.address || "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const firstLetter = (
    profile?.first_name?.charAt(0) ||
    profile?.username?.charAt(0) ||
    "U"
  ).toUpperCase();

  const userLevelIcon =
    profile?.user_level === "diamond"
      ? "💎"
      : profile?.user_level === "gold"
      ? "🏆"
      : "⭐";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          address,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (profile) {
        setProfile({
          ...profile,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: address,
        });
      }

      setIsEditing(false);
      setMessage({ text: "Personal profile updated successfully!", type: "success" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : "Update failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert banner */}
      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠️"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Header in White Theme */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-32 h-32 rounded-full bg-amber-50 border-4 border-[#f39c12] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-5xl font-bold text-amber-800">{firstLetter}</span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center justify-center md:justify-start gap-2">
            <span>
              {profile?.first_name} {profile?.last_name}
            </span>
            <span className="text-3xl" title={`${profile?.user_level} VIP Level`}>
              {userLevelIcon}
            </span>
          </h2>
          <p className="text-slate-500 text-xs mb-4">
            @{profile?.username} • Verified Parking Lagbe Member
          </p>

          {/* 3 Stat Boxes in White Theme */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 min-w-[130px]">
              <p className="text-slate-500 text-xs">Total Points</p>
              <p className="text-[#d97706] text-xl font-bold mt-0.5">
                {(profile?.points || 0).toLocaleString()} PTS
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 min-w-[130px]">
              <p className="text-slate-500 text-xs">VIP Status</p>
              <p className="text-slate-900 text-xl font-bold capitalize mt-0.5">
                {profile?.user_level || "Bronze"}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 min-w-[160px]">
              <p className="text-slate-500 text-xs">Favorite Location</p>
              <p className="text-emerald-700 text-base font-bold mt-1 truncate">Banani / Gulshan, Dhaka</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2.5 text-xs font-bold transition shadow-sm"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile Details"}
          </button>
        </div>
      </section>

      {/* Account & Personal Information in White Theme */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#d97706] hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Address / Street</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] px-5 py-2 font-bold text-white shadow-sm"
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="text-slate-400 text-[11px] font-semibold mb-1">Full Name</p>
                <p className="text-slate-900 text-sm font-semibold">
                  {profile?.first_name} {profile?.last_name}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] font-semibold mb-1">Username</p>
                <p className="text-slate-900 text-sm font-semibold">@{profile?.username}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] font-semibold mb-1">Email Address</p>
                <p className="text-slate-900 text-sm font-semibold">{profile?.email || "Not specified"}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] font-semibold mb-1">Phone Number</p>
                <p className="text-slate-900 text-sm font-semibold">{profile?.phone || "Not specified"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-slate-400 text-[11px] font-semibold mb-1">Address</p>
                <p className="text-slate-900 text-sm font-semibold">{profile?.address || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Security in White Theme */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Account Security</h3>

          <div>
            <div className="flex justify-between items-center mb-2 text-xs">
              <p className="text-slate-500">Account Verification</p>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 font-bold text-[10px]">
                Verified ✓
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Your driver account identity is verified on Parking Lagbe.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-slate-500 text-xs mb-1">Account Role</p>
            <p className="text-slate-900 text-sm font-bold capitalize">
              {profile?.role === "admin"
                ? "Platform Super Admin"
                : profile?.role === "garage_owner"
                ? "Space Host (Business)"
                : "Verified Driver"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
