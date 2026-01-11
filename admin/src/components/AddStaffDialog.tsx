import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createStaff } from '@/api/helpers/staff'
import { toast } from "sonner"

const formSchema = z.object({
  firstname: z.string().min(1, {
    message: 'Required.'
  }),
  lastname: z.string().min(1, {
    message: 'Required.'
  }),
  middle_name: z.string().optional(),
  rfid_code: z.string().min(1, {
    message: 'Required.'
  }),
  phone_number: z.string().min(1, {
    message: 'Required.'
  }),
  email: z.string().min(1, {
    message: 'Required.'
  }),
  staff_type: z.string().min(1, {
    message: 'Required.'
  }),
  photo_url: z.string().optional()
})

export function AddStaffDialog({ children, onCreate }: { children: React.ReactNode, onCreate: () => void; }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      middle_name: "",
      rfid_code: "",
      phone_number: "",
      email: "",
      staff_type: "",
      photo_url: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const data = await createStaff(values)
    if (!data.success) {
      toast.error(data.message);
      setLoading(false);
      return;
    }

    toast.success(data.message);
    resetForm(false);
    setLoading(false);
  }

  const resetForm = (open: boolean) => {
    setOpen(open);
    if (open === false) {
      form.reset();
      onCreate();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[600px]">
        <DialogHeader className="text-left">
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>
            Add new staff to the list this will allow Staff RFID to be verified at the gate entrance and track logs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Jefrey" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Baladjay" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Gomez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                <FormField
                    control={form.control}
                    name="staff_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Type of Staff<span className="text-red-500">*</span>
                        </FormLabel>

                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Staff Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="faculty">Faculty</SelectItem>
                              <SelectItem value="guard">Guard/Security</SelectItem>
                              <SelectItem value="administrator">Administrator</SelectItem>
                              <SelectItem value="canteen_vendors">Canteen Vendor</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rfid_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-400">RFID CODE<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input className="border-blue-400" placeholder="BF7366A3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                </div>
                <div className="grid grid-cols-2 gap-2">
                  
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="09xxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jg.baladjay@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FormLabel>2x2 Photo</FormLabel>
                  <Input type="file" />
                </div>

                <div className="mt-6">
                  <Button disabled={loading} type="submit">{loading ? "Adding Staff..." : "Add Staff"}</Button>
                </div>
              </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}