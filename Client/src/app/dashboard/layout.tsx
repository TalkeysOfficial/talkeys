"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isSignedIn) router.replace("/sign");
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex bg-[url('/images/texture.png')] bg-cover">
      <Sidebar />
      {/* left margin = sidebar width (250px) */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-12 ml-[250px]">
        {children}
      </main>
    </div>
  );
}
