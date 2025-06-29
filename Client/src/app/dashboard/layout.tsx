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
    <div className="flex bg-[url('/images/texture.png')] bg-cover bg-fixed">
      <Sidebar />
      {/* Main content area with proper scrolling */}
      <main className="flex-1 min-w-0 min-h-screen p-4 sm:p-8 lg:p-12 ml-[250px] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}