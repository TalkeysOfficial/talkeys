"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface Props {
  user: {
    displayName?: string;
    about?: string;
  };
  mutate: () => void;
}

/* --------- HARDCODE YOUR EXPRESS HOST ONCE HERE ------------ */
const API = "http://localhost:8000"; // 👉 adjust port if needed
/* ----------------------------------------------------------- */

export default function UserProfileForm({ user, mutate }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [about, setAbout]             = useState(user.about || "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "err">(
    "idle",
  );

  // autofocus the first input on mount
  const nameInputRef = useRef<HTMLInputElement>(null);

  async function save() {
    setStatus("saving");

    const res = await fetch(`${API}/dashboard/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
      },
      body: JSON.stringify({ displayName, about }),
    });

    if (res.ok) {
      setStatus("saved");
      mutate();                            // refresh SWR cache
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      console.error(await res.text());
      setStatus("err");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* status pill */}
      {status !== "idle" && (
        <div
          className={clsx(
            "inline-block rounded-full px-3 py-1 text-sm",
            status === "saving" && "bg-blue-600/40 text-blue-200",
            status === "saved"  && "bg-green-600/40 text-green-200",
            status === "err"    && "bg-red-600/40 text-red-200",
          )}
        >
          {status === "saving"
            ? "Saving…"
            : status === "saved"
            ? "Saved ✅"
            : "Something went wrong"}
        </div>
      )}

      {/* display-name */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">
          Display name
        </label>
        <input
          ref={nameInputRef}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
        />
      </div>

      {/* about */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">About</label>
        <textarea
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white resize-none"
        />
      </div>

      <Button disabled={status === "saving"} onClick={save}>
        {status === "saving" ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
