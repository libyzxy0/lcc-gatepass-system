import React, { useState } from 'react'
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import Turnstile, { useTurnstile } from "react-turnstile"
import { Eye, EyeOff } from 'lucide-react';
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import lccBackground from '@/assets/lcc.webp'
import { useAuthStore } from "@/stores/useAuthStore";

const formSchema = z.object({
  email: z.string().email().min(1, "Email required!"),
  password: z.string().min(1, "Password required!"),
  captcha: import.meta.env.MODE === "development" ? z.string() : z.string().min(1, "Please verify captcha first!"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const turnstile = useTurnstile();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      captcha: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await login(values.email, values.password, values.captcha);
      navigate('/dashboard');
      turnstile.reset();
    } catch (error: any) {

      if (!error.response) {
        alert('Somthing went wrong!');
        return;
      }

      if (error.response.status === 404) {
        form.setError("email", {
          type: "manual",
          message: error.response?.data.error,
        });
      }
      if (error.response.status === 401) {
        form.setError("password", {
          type: "manual",
          message: error.response?.data.error,
        });
      }

      if (error.response.status === 403) {
        form.setError("captcha", {
          type: "manual",
          message: error.response?.data.error
        })
        turnstile.reset();
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("w-[90%] md:w-[460px] z-20", className)} {...props}>
      <Card className="rounded-3xl text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login as Admin</CardTitle>
          <CardDescription>
            Enter your email and password below to login to admin dashboard.
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
                    <FormItem className="text-left">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="py-6 " type="text" placeholder="Enter your admin email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input className="py-6" type={showPass ? 'text' : 'password'} placeholder="Enter your admin password" {...field} />
                          <Button type="button" onClick={() => setShowPass(!showPass)} variant={'ghost'} className="absolute right-2 bottom-1.5">
                            {showPass ? (
                              <Eye className="size-5 text-muted-foreground" strokeWidth={1.5} />
                            ) : (
                              <EyeOff className="size-5 text-muted-foreground" strokeWidth={1.5} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="text-right text-sm font-medium hover:text-blue-400 hover:underline mt-1"><a href="/forgot">Forgot password?</a></div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="captcha"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormControl>
                        <Turnstile
                          sitekey="0x4AAAAAACFTRTyVip79G4aZ"
                          onVerify={
                            (token) => field.onChange(token)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="py-6 bg-blue-700" disabled={loading}>{loading ? (
                  <Spinner />
                ) : (
                  <>
                    {"Login"}
                  </>
                )}</Button>
              </FieldGroup>
            </form>
          </Form>
          <p className="text-xs text-muted-foreground mt-6">© Copyright 2026 La Concepcion College Digital Gatepass System All rights reserved.</p>
        </CardContent>
      </Card>
    </div >
  )
}

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center relative">

      <img
        src={lccBackground}
        alt="La Concepcion College"
        className="absolute z-10 h-screen w-full object-cover blur-md"
      />

      <div className="absolute z-20 h-screen w-full bg-black opacity-50"></div>

      <div className="relative z-30 w-full flex items-center justify-center relative">
        <LoginForm />
      </div>
    </div>
  );
}
