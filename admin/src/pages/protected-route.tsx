import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { HashLoader } from 'react-spinners'

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
    <div className="h-screen flex justify-center items-center gap-6 flex-col">
      <HashLoader color="#3b82f6" speedMultiplier={2} />
      <p className="text-muted-foreground text-[12px]">Checking session, wait lang po...</p>
    </div>
  );
  
  if(!loading && !isAuthenticated) {
    navigate('/login');
  }

  return <Outlet />;
}
