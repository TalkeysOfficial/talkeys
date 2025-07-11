"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Sidebar from "@/app/dashboard/Sidebar";
import Greeting from "@/components/dashboard/Greeting";
import UserProfileForm from "@/components/dashboard/UserProfileForm";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/useUser";
import { RefreshCcw } from "lucide-react";

const AVATAR_STYLES = [
  "avataaars", "bottts", "croodles", "croodles-neutral",
  "identicon", "micah", "open-peeps", "personas",
  "pixel-art", "pixel-art-neutral",
];

const BACKGROUND_COLORS = [
  { name: "Light Blue", value: "b6e3f4" },
  { name: "Soft Pink", value: "ffd5dc" },
  { name: "Lavender", value: "d1d4f9" },
  { name: "Peach", value: "f4b6c2" },
  { name: "Mint Green", value: "a0e7e5" },
];

// ✅ Randomize both style and background
const randomizeAvatar = () => ({
  style: AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)],
  bg: BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)].value
});

export default function ProfilePage() {
  const { user, isLoading, error, mutate } = useUser();
  const router = useRouter();

  const [style, setStyle] = useState(AVATAR_STYLES[0]);
  const [bg, setBg] = useState(BACKGROUND_COLORS[0].value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setStyle(localStorage.getItem("avatarStyle") ?? AVATAR_STYLES[0]);
    setBg(localStorage.getItem("avatarBg") ?? BACKGROUND_COLORS[0].value);
  }, []);

  const seed = (user?.name ?? "user").toLowerCase().replace(/[^a-z0-9]/g, "");
  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bg}`;

  const saveAvatar = () => {
    localStorage.setItem("avatarStyle", style);
    localStorage.setItem("avatarBg", bg);
    window.dispatchEvent(new Event("storage"));
    mutate();
  };

  if (isLoading) return <Skeleton text="Loading profile…" />;
  if (error || !user) return <Skeleton err text="Failed to load profile" />;

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-grow px-6 lg:px-12 py-10 text-white max-w-4xl mx-auto">
        <Greeting name={user.name || user.displayName || "Friend"} />

        {/* AVATAR SECTION */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Avatar</h2>

          <div className="flex flex-wrap items-start gap-8">
            <Avatar className="h-28 w-28 ring-4 ring-purple-500 shrink-0">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-3xl">{seed[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-3">
                {AVATAR_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`p-0.5 rounded-lg border-2 ${
                      s === style ? "border-purple-500" : "border-gray-600"
                    }`}
                  >
                    <Image
                      src={`https://api.dicebear.com/7.x/${s}/svg?seed=${seed}&backgroundColor=${bg}`}
                      alt={s}
                      width={56}
                      height={56}
                      className="rounded-md"
                    />
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {BACKGROUND_COLORS.map((c) => (
                    <option value={c.value} key={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    const { style, bg } = randomizeAvatar();
                    setStyle(style);
                    setBg(bg);
                  }}
                >
                  <RefreshCcw size={16} /> Random
                </Button>

                <Button onClick={saveAvatar} className="ml-auto">
                  Save avatar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PROFILE TEXT FIELDS */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold mb-6">Profile settings</h2>
          <UserProfileForm user={user} mutate={mutate} />
        </section>
      </main>
    </div>
  );
}

/* tiny helper component */
function Skeleton({ text, err = false }: { text: string; err?: boolean }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div
        className={`flex-grow flex items-center justify-center ${
          err ? "text-red-400" : "text-gray-400"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

   