import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?redirect=/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
    </div>
  );
}