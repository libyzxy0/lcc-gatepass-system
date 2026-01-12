import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { General } from '@/components/settings/General'
import { Admins } from '@/components/settings/Admins'
import { Gates } from '@/components/settings/Gates'
import { Danger } from '@/components/settings/Danger'
import { useSearchParams } from "react-router";

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your gatepass system configuration</p>
      </div>

      <Tabs defaultValue={searchParams.get('activeTab') || 'general'} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" onClick={() => setSearchParams({ activeTab: 'general' })}>General</TabsTrigger>
          <TabsTrigger value="admins" onClick={() => setSearchParams({ activeTab: 'admins' })}>Admins</TabsTrigger>
          <TabsTrigger value="gates" onClick={() => setSearchParams({ activeTab: 'gates' })}>Gates</TabsTrigger>
          <TabsTrigger value="danger" onClick={() => setSearchParams({ activeTab: 'danger' })}>Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <General />
        </TabsContent>
        <TabsContent value="admins" className="space-y-6">
          <Admins />
        </TabsContent>
        <TabsContent value="gates" className="space-y-6">
          <Gates />
        </TabsContent>
        <TabsContent value="danger" className="space-y-6">
          <Danger />
        </TabsContent>
      </Tabs>
    </div>
  )
}