// hooks/usePassManagement.ts
import { useEffect, useState } from "react";
import { bookPass, getPass } from "@/lib/services/eventApi";

export function usePassManagement(eventId: string) {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      const data = await getPass(eventId);
      const qrs: string[] = [];
      if (data?.passes?.length) {
        for (const passItem of data.passes) {
          const passUUID = passItem.passUUID;
          for (const qrString of passItem.qrStrings) {
            const id = qrString._id ?? qrString.id;
            qrs.push(`${passUUID}+${id}`);
          }
        }
      }
      setCodes(qrs);
    } catch {
      setCodes([]);
    }
  }

  useEffect(() => {
    refresh();
  }, [eventId]);

  async function create(teamCode: string) {
    setLoading(true);
    try {
      await bookPass(teamCode, eventId);
      await refresh();
      return true;
    } finally {
      setLoading(false);
    }
  }

  return { codes, loading, create, refresh };
}
