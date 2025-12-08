import { Outlet, useLocation, Link } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function Admin() {
  const location = useLocation();

  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <>
      <AppSidebar />
      <div className="p-4 md:p-8 w-full">
        <div className="pb-5 flex flex-row items-center gap-2">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {parts.map((name, index) => (
                <BreadcrumbItem key={index}>
                  <Link
                    to={"/" + parts.slice(0, index + 1).join("/")}
                    className="capitalize"
                  >
                    {name}
                  </Link>

                  {index < parts.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <main>
          <Outlet />
        </main>
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