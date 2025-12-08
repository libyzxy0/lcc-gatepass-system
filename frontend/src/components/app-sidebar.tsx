"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Settings2,
  ClipboardClock,
  Users,
  IdCard,
  BookUser
} from "lucide-react"

import { NavData } from "@/components/nav-data"
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
      name: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students Log",
      url: "/dashboard/students/logs",
      icon: BookUser,
    },
    {
      name: "Visitors Log",
      url: "/dashboard/visitors/logs",
      icon: ClipboardClock,
    },
  ],
  navData: [
    {
      title: "Students RFID",
      url: "/dashboard/students/rfid",
      icon: IdCard,
    },
    {
      title: "Visitors",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Allowed",
          url: "#",
        },
        {
          title: "Pending Approval",
          url: "#",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Offices",
          url: "#",
        },
        {
          title: "Admins & Staffs",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavOverview overview={data.overview} />
        <NavData items={data.navData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
