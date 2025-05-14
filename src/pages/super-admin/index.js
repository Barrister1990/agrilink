import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/super-admin/dashboard");
  }, []);
  return null;
}
