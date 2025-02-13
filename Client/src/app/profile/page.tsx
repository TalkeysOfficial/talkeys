"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AVATAR_STYLES = [
  "avataaars",
  "bottts",
  "croodles",
  "croodles-neutral",
  "identicon",
  "micah",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
];

const BACKGROUND_COLORS = [
  { name: "Light Blue", value: "b6e3f4" },
  { name: "Soft Pink", value: "ffd5dc" },
  { name: "Lavender", value: "d1d4f9" },
  { name: "Peach", value: "f4b6c2" },
  { name: "Mint Green", value: "a0e7e5" },
];

const AvatarCustomizer = () => {
  const [avatarStyle, setAvatarStyle] = useState(AVATAR_STYLES[0]);
  const [backgroundColor, setBackgroundColor] = useState(BACKGROUND_COLORS[0].value);
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedStyle = localStorage.getItem("avatarStyle") ?? AVATAR_STYLES[0];
    const storedBg = localStorage.getItem("avatarBg") ?? BACKGROUND_COLORS[0].value;

    setAvatarStyle(storedStyle);
    setBackgroundColor(storedBg);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("name") ?? "user";
    const seed = storedName.toLowerCase().replace(/[^a-z0-9]/g, "");
    setAvatarUrl(`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}&backgroundColor=${backgroundColor}`);
  }, [avatarStyle, backgroundColor]);

  const handleSave = () => {
    localStorage.setItem("avatarStyle", avatarStyle);
    localStorage.setItem("avatarBg", backgroundColor);
    window.dispatchEvent(new Event("storage")); 
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">Customize Your Avatar</h2>

      <div className="relative w-40 h-40 mb-6">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={150}
            height={150}
            className="rounded-full border-4 border-white shadow-lg"
            onError={() => setAvatarUrl("/default-avatar.png")} 
          />
        )}
      </div>

      <label className="mt-4 font-semibold text-lg">Avatar Style:</label>
      <div className="grid grid-cols-5 gap-4 mt-4">
  {AVATAR_STYLES.map((style) => (
    <button
      key={style}
      onClick={() => setAvatarStyle(style)}
      className={`p-1 border-2 ${
        avatarStyle === style ? "border-blue-500" : "border-gray-400"
      } rounded-lg`}
    >
      <Image
        src={`https://api.dicebear.com/7.x/${style}/svg?seed=user`}
        alt={style}
        width={50}
        height={50}
        className="rounded-lg"
      />
    </button>
  ))}
</div>


      <label className="mt-4 font-semibold text-lg">Background Color:</label>
      <select
        value={backgroundColor}
        onChange={(e) => setBackgroundColor(e.target.value)}
        className="border p-2 mt-2 text-black rounded-lg w-60"
      >
        {BACKGROUND_COLORS.map((color) => (
          <option key={color.value} value={color.value}>
            {color.name}
          </option>
        ))}
      </select>

      <div className="mt-6 flex gap-6">
        <button onClick={handleSave} className="p-3 bg-blue-500 text-white rounded-lg shadow-md w-40">
          Save Avatar
        </button>
        <button onClick={() => router.push("/")} className="p-3 bg-red-500 text-white rounded-lg shadow-md w-40">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
