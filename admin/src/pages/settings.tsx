import { Switch } from '@/components/ui/switch'

export default function Settings() {
  return (
    <div>
      <header>
        <h1 className="font-semibold text-2xl">Settings</h1>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-3 items-center">
          <div className="col-span-2">
            <h1 className="font-semibold">Emergency Open</h1>
            <p className="text-sm text-muted-foreground">Open all gates without any authorization.</p>
          </div>
          <div className="text-right">
            <Switch />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center">
          <div className="col-span-2">
            <h1 className="font-semibold">Parent SMS Notifications</h1>
            <p className="text-sm text-muted-foreground">Notify parents through SMS when their child enters or leaves the school.</p>
          </div>
          <div className="text-right">
            <Switch />
          </div>
        </div>
      </div>
    </div>
  )
}