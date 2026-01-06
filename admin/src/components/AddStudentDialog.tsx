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
import { createStudent } from '@/api/helpers/student'
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  firstname: z.string().min(1, {
    message: 'Required.'
  }),
  lastname: z.string().min(1, {
    message: 'Required.'
  }),
  middle_name: z.string().optional(),
  guardian_middle_name: z.string().optional(),
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
  address: z.string().min(1, {
    message: 'Required.'
  }),
  guardian_firstname: z.string().min(1, {
    message: 'Required.'
  }),
  guardian_lastname: z.string().min(1, {
    message: 'Required.'
  }),
  guardian_rfid_code: z.string().min(1, {
    message: 'Required.'
  }),
  guardian_phone_number: z.string().min(1, {
    message: 'Required.'
  }),
  relationship: z.string().min(1, {
    message: 'Required.'
  })
})

export function AddStudentDialog({ children, onCreate }: { children: React.ReactNode, onCreate: () => void; }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('student');
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
      address: "",
      guardian_phone_number: "",
      guardian_firstname: "",
      guardian_lastname: "",
      guardian_middle_name: "",
      guardian_rfid_code: "",
      relationship: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setLoading(true);
    const data = await createStudent(values)
    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    resetForm(false);
  }

  const resetForm = (open: boolean) => {
    setOpen(open);
    if (open === false) {
      form.reset();
      setCurrentPage('student');
      onCreate();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Add new student to the list this will allow Student RFID to be verified at the gate entrance and track logs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs onValueChange={setCurrentPage} value={currentPage}>
              <TabsList>
                <TabsTrigger value="student">Student Info</TabsTrigger>
                <TabsTrigger value="guardian">Guardian Info</TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="space-y-4 mt-4">
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
                <div className="flex flex-col gap-2">
                  <FormLabel>2x2 Photo</FormLabel>
                  <Input type="file" />
                </div>

                <div className="mt-6">
                  <Button type="button" onClick={() => setCurrentPage('guardian')}>Next</Button>
                </div>
              </TabsContent>
              <TabsContent value="guardian" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="guardian_firstname"
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
                    name="guardian_lastname"
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
                    name="guardian_middle_name"
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

                <div className="grid grid-cols-3 gap-2">

                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px]">
                          Relationship to Student<span className="text-red-500">*</span>
                        </FormLabel>

                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="grandparent">Grandparent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="aunt_uncle">Aunt/Uncle</SelectItem>
                              <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardian_rfid_code"
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
                    name="guardian_phone_number"
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
                <div className="flex flex-col gap-2">
                  <FormLabel>2x2 Photo</FormLabel>
                  <Input type="file" />
                </div>
                <div className="mt-6">
                  <Button type="submit">{loading ? "Creating..." : "Add Student"}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}