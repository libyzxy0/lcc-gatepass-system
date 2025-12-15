"use client"

import { DoorOpen } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import gpassIcon from '@/assets/icon.png'

export function NavHeader() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
   
                <img src={gpassIcon} alt="GPass Icon" className="h-12 w-12 object-contain p-0 m-0" />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{"LCC GATEPASS SYSTEM"}</span>
                <span className="truncate text-xs">{"Developed by Group 2"}</span>
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}