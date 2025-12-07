"use client"

import * as React from "react"
import {
  PieChart,
  Settings2,
  ClipboardClock,
  Users
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
  /*
  user: {
    name: "Krisha Sophia De Peralta",
    email: "krishasophia@gmail.com",
    avatar: "https://graph.facebook.com/100009108078372/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662",
  },
  */
  navData: [
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
      title: "Students RFID",
      url: "/admin/students/rfid",
      icon: Users,
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
  overview: [
    {
      name: "Overview",
      url: "/admin",
      icon: PieChart,
    },
    {
      name: "Students Log",
      url: "/admin/students/logs",
      icon: ClipboardClock,
    },
    {
      name: "Visitors Log",
      url: "/admin/visitors/logs",
      icon: ClipboardClock,
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
