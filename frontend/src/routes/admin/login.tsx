import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FieldGroup,
} from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from 'react'


const formSchema = z.object({
  email: z.string().min(1, "Username required!"),
  password: z.string().min(1, "Password required!"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, admin } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log(values);
      await login(values.email, values.password);
      navigate('/admin');
    } catch (error: any) {
      form.setError(error.response.status === 404 ? "email" : "password", {
        type: "manual",
        message: error.response?.data.message || "Failed to login!",
      });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className={cn("w-[400px]", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your username and password below to login to admin dashboard. Under Development this project isn't finished yet, please dont share this link to anyone hehe labyu guys.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="py-6" type="text" placeholder="aieshadacallos@gmail.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input className="py-6" type="password" placeholder="mypassword123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="py-6" disabled={loading}>{loading ? (
                  <Spinner />
                ) : (
                  <>
                    {"Login"}
                  </>
                )}</Button>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}