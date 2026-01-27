import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getConfig, updateConfig } from "@/api/helpers/sysconfig"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

export function General() {
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey: ["get-config"],
    queryFn: getConfig
  })

  const mutation = useMutation({
    mutationFn: updateConfig,
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ["get-config"] })

      const prevData = queryClient.getQueryData(["get-config"])

      queryClient.setQueryData(["get-config"], (old: any) => ({
        ...old,
        [newValue.key]: newValue.value
      }))

      return { prevData }
    },
    onError: (_err, _, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(["get-config"], ctx.prevData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-config"] })
    }
  })

  const handleConfigChange = (key: 'sms_alerts' | 'tracking_mode' | 'emergency_open', value: boolean) => {
    mutation.mutate({ key, value })
  }

  if (isPending) {
    return (
      <div>
        <Skeleton className="w-full h-[340px]" />
      </div>
    )
  }

  if (error) return "An error occurred: " + error

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Preferences</CardTitle>
        <CardDescription>Configure gatepass system behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Tracking Mode</Label>
            <p className="text-xs text-muted-foreground md:mr-24">
              Approve all gatepass requests and only track visitor details and gatepass informations without manually approving or rejecting gatepass.
            </p>
          </div>
          <Switch
            checked={data.tracking_mode}
            onCheckedChange={(value) =>
              handleConfigChange("tracking_mode", value)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Emergency Open</Label>
            <p className="text-xs text-muted-foreground md:mr-24">
              Open all gates without any authorization. Use this for emergency situations to avoid delay.
            </p>
          </div>
          <Switch
            checked={data.emergency_open}
            onCheckedChange={(value) =>
              handleConfigChange("emergency_open", value)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>SMS Alerts</Label>
            <p className="text-xs text-muted-foreground md:mr-24">
              Send SMS notifications to guardians about ehir child's entry and exit activities.
            </p>
          </div>
          <Switch
            checked={data.sms_alerts}
            onCheckedChange={(value) =>
              handleConfigChange("sms_alerts", value)
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
