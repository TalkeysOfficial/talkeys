   "use client";

   import useSWR from "swr";
   
   const API = "http://localhost:8000"; 
   
   const fetcher = async (endpoint: string) => {
     const token = localStorage.getItem("accessToken") ?? "";
   
     const res = await fetch(`${API}${endpoint}`, {
       headers: { Authorization: `Bearer ${token}` },
       credentials: "include",
     });
   
     if (res.status === 401) {
       localStorage.removeItem("accessToken");
       if (typeof window !== "undefined") {
         window.location.href = "/sign";
       }
       throw new Error("unauthorised");
     }
   
     if (!res.ok) {
       throw new Error(await res.text());
     }
   
     return res.json();
   };
   
   export function useUser() {
     const { data, error, mutate } = useSWR("/dashboard/profile", fetcher, {
       revalidateOnFocus: true, 
     });
   
     return {
       user: data,
       isLoading: !data && !error,
       error,
       mutate,
     };
   }
   