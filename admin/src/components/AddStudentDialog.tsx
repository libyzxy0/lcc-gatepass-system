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
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createStudent } from '@/api/helpers/student'
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
  student_id: z.string().min(1, {
    message: 'Required.'
  }),
  grade_level: z.string().min(1, {
    message: 'Required.'
  }),
  section: z.string().min(1, {
    message: 'Required.'
  }),
  parent_name: z.string().min(1, {
    message: 'Required.'
  }),
  parent_phone_number: z.string().min(1, {
    message: 'Required.'
  }),
  address: z.string().min(1, {
    message: 'Required.'
  })
})

export function AddStudentDialog({ children, onCreate }: { children: React.ReactNode, onCreate: () => void; }) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      middle_name: "",
      rfid_code: "",
      student_id: "",
      grade_level: "",
      section: "",
      parent_name: "",
      parent_phone_number: "",
      address: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await createStudent(values);
    console.log(data);
    
    if(!data.success) {
      toast.error(data.message);
      return;
    }
   
    toast.success(data.message);
    form.reset();
    setOpen(false);
    onCreate();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Add new student to the list this will allow Student RFID to be verified at the gate entrance and track logs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Krisha Sophia" {...field} />
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
                      <Input placeholder="De Peralta" {...field} />
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
                      <Input placeholder="N/A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
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
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="20250326" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="grade_level"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Grade Level<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="SHS-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Section<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="TVL-ICT-12A All Things Tech" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogDescription className="text-sm">
              Person to Contact in Case of Emergency:
            </DialogDescription>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="parent_name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Parent Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Emilio Aguinaldo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_phone_number"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Phone Number<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="09976953621" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Address<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Phase 1, Palmera, San Jose del Monte, Bulacan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Input type="file" />
            </div>

            <div className="mt-6">
              <Button type="submit">Add Student</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}