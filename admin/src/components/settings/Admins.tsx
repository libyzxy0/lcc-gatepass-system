import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { getAdmins, createAdmin } from '@/api/helpers/admin'
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
import { AdminCard } from '@/components/AdminCard'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Required.'
  }),
  email: z.email(),
  phone_number: z.string().min(1, {
    message: 'Required.'
  }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must be less than 32 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  role: z.enum(['admin', 'security', 'developer', 'other'], {
    message: 'Please select a valid role'
  })
})

export function Admins() {
  const [loading, setLoading] = useState(false);
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-all-admins'],
    queryFn: getAdmins
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      role: 'admin'
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const data = await createAdmin(values)
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
            <UserPlus className="w-5 h-5" />
            Add Administrator
          </CardTitle>
          <CardDescription>Grant admin access to new users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Jan Liby Dela Costa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Password<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your desired password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="09xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>
                        Role<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="security">Security Officer</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={loading} className="w-full sm:w-auto" type="submit">{loading ? 'Adding Admin...' : 'Add Administrator'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
          <CardDescription>Manage existing admin accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((admin, i) => (
              <AdminCard
                key={i}
                id={admin.id}
                name={admin.name}
                email={admin.email}
                is_super_admin={admin.is_super_admin}
                role={admin.role} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}