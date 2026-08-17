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
    <div className="space-y-8 text-white">
      {/* Alert banner */}
      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-red-500/20 border border-red-500/40 text-red-300"
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠️"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Header matching my_profile.php lines 594-636 */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
        <div className="w-32 h-32 rounded-full bg-[#f39c12]/20 border-4 border-[#f39c12] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#f39c12]/30">
          <span className="text-5xl font-bold text-[#f39c12]">{firstLetter}</span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
            <span>
              {profile?.first_name} {profile?.last_name}
            </span>
            <span className="text-3xl" title={`${profile?.user_level} VIP Level`}>
              {userLevelIcon}
            </span>
          </h2>
          <p className="text-white/80 text-xs mb-4">
            @{profile?.username} • Verified Parking Lagbe Member
          </p>

          {/* 3 Stat Boxes matching my_profile.php lines 609-623 */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 min-w-[130px]">
              <p className="text-white/60 text-xs">Total Points</p>
              <p className="text-[#f39c12] text-xl font-bold mt-0.5">
                {(profile?.points || 0).toLocaleString()} PTS
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 min-w-[130px]">
              <p className="text-white/60 text-xs">VIP Status</p>
              <p className="text-white text-xl font-bold capitalize mt-0.5">
                {profile?.user_level || "Bronze"}
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 min-w-[160px]">
              <p className="text-white/60 text-xs">Favorite Location</p>
              <p className="text-emerald-400 text-base font-bold mt-1 truncate">Banani / Gulshan, Dhaka</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2 text-xs font-bold transition shadow"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile Details"}
          </button>
        </div>
      </section>

      {/* Account & Personal Information matching my_profile.php lines 639-700 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#f39c12] hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-white outline-none focus:border-[#f39c12]"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-white outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-white outline-none focus:border-[#f39c12]"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-semibold mb-1">Address / Street</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-white outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] px-5 py-2 font-bold text-white shadow"
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="text-white/60 text-[11px] mb-1">Full Name</p>
                <p className="text-white text-sm font-semibold">
                  {profile?.first_name} {profile?.last_name}
                </p>
              </div>

              <div>
                <p className="text-white/60 text-[11px] mb-1">Username</p>
                <p className="text-white text-sm font-semibold">@{profile?.username}</p>
              </div>

              <div>
                <p className="text-white/60 text-[11px] mb-1">Email Address</p>
                <p className="text-white text-sm font-semibold">{profile?.email || "Not specified"}</p>
              </div>

              <div>
                <p className="text-white/60 text-[11px] mb-1">Phone Number</p>
                <p className="text-white text-sm font-semibold">{profile?.phone || "Not specified"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-white/60 text-[11px] mb-1">Address</p>
                <p className="text-white text-sm font-semibold">{profile?.address || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Security matching my_profile.php lines 679-700 */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white">Account Security</h3>

          <div>
            <div className="flex justify-between items-center mb-2 text-xs">
              <p className="text-white/60">Account Verification</p>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 font-bold text-[10px]">
                Verified ✓
              </span>
            </div>
            <p className="text-white/80 text-[11px]">
              Your driver account identity is verified on Parking Lagbe.
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-white/60 text-xs mb-1">Account Role</p>
            <p className="text-white text-sm font-bold capitalize">
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
