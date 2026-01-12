import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Danger() {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible actions - proceed with caution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold">Clear All Gatepass Records</h3>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all gatepass history. This action cannot be undone.
          </p>
          <Button variant="destructive" className="w-full sm:w-auto">
            Clear All Records
          </Button>
        </div>

        <div className="border-t pt-6 space-y-3">
          <h3 className="font-semibold">Reset System to Default</h3>
          <p className="text-sm text-muted-foreground">
            Reset all settings, gates, and configurations to factory defaults. User accounts will be preserved.
          </p>
          <Button variant="destructive" className="w-full sm:w-auto">
            Reset System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}