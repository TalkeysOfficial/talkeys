"use client";
import Link from "next/link";

export default function CommunityRow({ community }: { community: any }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/60 rounded-lg">
      <div className="h-10 w-10 rounded-full bg-purple-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-white font-medium">{community.name}</p>
        <p className="text-xs text-gray-400 line-clamp-1">
          {community.description}
        </p>
      </div>
      <Link
        href={`/communities/${community._id}`}
        className="px-3 py-1 bg-purple-600 rounded text-sm"
      >
        View
      </Link>
    </div>
  );
}
