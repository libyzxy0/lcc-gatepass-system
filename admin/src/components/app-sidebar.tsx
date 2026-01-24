import * as React from "react"
import {
  LayoutDashboard,
  Settings2,
  ClipboardClock,
  Users,
  IdCard,
  BookUser
} from "lucide-react"
import { NavManage } from "@/components/nav-manage"
import { NavOverview } from "@/components/nav-overview"
import { NavUser } from "@/components/nav-user"
import { NavHeader } from "@/components/nav-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  overview: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Logs",
      url: "/dashboard/logs",
      icon: ClipboardClock,
    }
  ],
  manage: [
    {
      title: "Students",
      url: "/dashboard/students",
      icon: IdCard,
    },
    {
      title: "Staffs",
      url: "/dashboard/staffs",
      icon: BookUser,
    },
    {
      title: "Visitors",
      icon: Users,
      url: '#',
      items: [
        {
          title: 'Accounts',
          url: '/dashboard/visitors'
        },
        {
          title: 'QRPass',
          url: '/dashboard/gatepass'
        }
      ]
    },
    {
      title: "Settings",
      icon: Settings2,
      url: "/dashboard/settings",
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavOverview items={data.overview} />
        <NavManage items={data.manage} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
