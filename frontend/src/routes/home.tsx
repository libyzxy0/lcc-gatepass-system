import { useAuthStore } from "@/stores/useAuthStore";

export default function Home() {
  const { admin } = useAuthStore();
  return (
    <div>
      <h1>Hi {admin?.firstname}</h1>
    </div>
  )
}