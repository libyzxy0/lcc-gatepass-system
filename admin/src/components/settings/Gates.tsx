import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, Trash2 } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { getGates, createGate } from '@/api/helpers/gate'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Required.'
  }),
  gate_id: z.string().min(1, {
    message: 'Required.'
  }),
  secret: z.string().min(1, {
    message: 'Required.'
  }),
  type: z.enum(['entry', 'exit', 'entry-exit'], {
    message: 'Please select a valid type'
  })
})

export function Gates() {
  const [loading, setLoading] = useState(false);
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-all-gates'],
    queryFn: getGates,
    refetchInterval: 500,
    refetchOnWindowFocus: true
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gate_id: "",
      secret: "",
      type: 'entry-exit'
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const data = await createGate(values)
    if (!data.success) {
      toast.error(data.message);
      setLoading(false);
      return;
    }

    refetch();
    toast.success(data.message);
    form.reset();
    setLoading(false);
  }


  if (isPending) return (
    <>
      <Skeleton className="w-full h-[210px]" />
      <Skeleton className="w-full h-[220px]" />
    </>
  );

  if (error) return "Error occurred: " + error;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Add Gate Location
          </CardTitle>
          <CardDescription>Register new gate entry/exit points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gate Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Main Entrance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gate_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gate ID<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="ESP-GATE-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gate Secret<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="cfc379eb-461e-42eb-a68c-ac5329a36439" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>
                      Access Type<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gate type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="entry">Entry (Single Direction)</SelectItem>
                            <SelectItem value="exit">Exit (Single Direction)</SelectItem>
                            <SelectItem value="entry-exit">Entry/Exit (Bi-Directional)</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} className="w-full sm:w-auto">{loading ? 'Adding Gate' : 'Add Gate'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deployed Gates</CardTitle>
          <CardDescription>All registered gate locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.length !== 0 ? data.map((gate, i) => (
              <div key={i} className={`flex items-center justify-between p-4 border rounded-lg ${gate.status === 'online' ? 'bg-green-400/10 border-green-200' : ''}`}>
                <div>
                  <p className={`font-medium ${gate.status === 'online' ? 'text-green-400' : ''}`}>{gate.name}</p>
                  <p className="text-sm text-muted-foreground">{gate.gate_id}</p>
                  <div className="flex gap-3 mt-1">
                    <p className="text-xs text-muted-foreground capitalize">Type: {gate.type}</p>
                    <p className={`text-xs font-medium capitalize ${gate.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                      {gate.status}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )) : (
              <p className="text-center">No deployed gates yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}