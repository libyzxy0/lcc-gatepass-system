import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
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
import { updateStudent } from '@/api/helpers/student'
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useQuery,
} from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query';
import { getStudent } from '@/api/helpers/student'

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

type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStudentDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('student');
  const queryClient = useQueryClient();
  
  const { isPending, error, data } = useQuery({
    queryKey: ['get-student', id],
    queryFn: () => getStudent(id),
    enabled: open && !!id
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      middle_name: '',
      rfid_code: '',
      student_id: '',
      grade_level: '',
      section: '',
      address: '',
      guardian_phone_number: '',
      guardian_firstname: '',
      guardian_lastname: '',
      guardian_middle_name: '',
      guardian_rfid_code: '',
      relationship: '',
    }
  })

  useEffect(() => {
    if (data) {
      form.reset({
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        middle_name: data.middle_name || '',
        rfid_code: data.rfid_code || '',
        student_id: data.student_id || '',
        grade_level: data.grade_level || '',
        section: data.section || '',
        address: data.address || '',
        guardian_phone_number: data.guardian?.phone_number || '',
        guardian_firstname: data.guardian?.firstname || '',
        guardian_lastname: data.guardian?.lastname || '',
        guardian_middle_name: data.guardian?.middle_name || '',
        guardian_rfid_code: data.guardian?.rfid_code || '',
        relationship: data.guardian?.relationship || '',
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to get student info!');
    }
  }, [error]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!data) return;
    
    setLoading(true);
    const result = await updateStudent(data.id, values)
    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }
    
    await queryClient.refetchQueries({ queryKey: ['get-students'] });

    toast.success(result.message);
    resetForm(false);
    setLoading(false);
    onOpenChange(false);
  }

  const resetForm = (open: boolean) => {
    if (open === false) {
      form.reset();
      setCurrentPage('student');
    }
  }

  if (isPending) {
    return (
      <Dialog open={open}>
        <DialogContent className="md:min-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <p>Loading student information...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="md:min-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <p className="text-red-500">Failed to load student information</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[600px]">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Edit student informations.
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
                <div className="flex flex-col gap-2">
                  <FormLabel>2x2 Photo</FormLabel>
                  <Input type="file" />
                </div>
                <div className="mt-6 flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setCurrentPage('student')}>Previous</Button>
                  <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Student"}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}