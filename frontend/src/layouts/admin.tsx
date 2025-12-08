import { Outlet, useLocation } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function Admin() {
  const location = useLocation();

  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <>
      <AppSidebar />
      <main className="p-4 md:p-8">
        <div className="pb-5 flex flex-row items-center gap-2">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {parts.map((name, index) => (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                    href={"/" + parts.slice(0, index + 1).join("/")}
                    className="capitalize"
                  >
                    {name}
                  </BreadcrumbLink>

                  {index < parts.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Outlet />
      </main>
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