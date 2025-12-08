import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Spinner } from "@/components/ui/spinner"
import { useNavigate } from "react-router";

export default function ProtectedRoute() {
  const { getSession, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function restore() {
      try {
        await getSession();
      } catch {
        console.error("Failed to get session!");
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  if (loading) return (
    <div className="h-screen flex justify-center items-center">
      <Spinner className="size-16" />
    </div>
  );
  
  if(!loading && !isAuthenticated) {
    navigate('/login');
  }

  return <Outlet />;
}
