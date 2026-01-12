import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function General() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Preferences</CardTitle>
        <CardDescription>Configure gatepass system behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-approve verified visitor passes</Label>
            <p className="text-sm text-muted-foreground">Automatically approve gatepass requests from verified visitors</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Guardian SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">Send SMS notification to guardians about their childs entry and exit activities.</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Emergency Open</Label>
            <p className="text-sm text-muted-foreground">Open all gates without any authorizations, only activate this feature during an emergency.</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}