import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'

function Admin() {
  return (
    <>
      <AppSidebar />
      <div className="p-8">
          <Outlet />
      </div>
    </>
  )
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <Admin />
    </SidebarProvider>
  )
}