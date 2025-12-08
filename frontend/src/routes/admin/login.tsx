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
import Turnstile, { useTurnstile } from "react-turnstile";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from 'react'


const formSchema = z.object({
  email: z.string().min(1, "Username required!"),
  password: z.string().min(1, "Password required!"),
  captcha: z.string().min(1, "Please verify captcha first!"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const turnstile = useTurnstile();
  const [loading, setLoading] = useState(false);

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
      console.log(values);
      await login(values.email, values.password, values.captcha);
      navigate('/dashboard');
      turnstile.reset();
    } catch (error: any) {

      if (error.response.status === 404) {
        form.setError("email", {
          type: "manual",
          message: error.response?.data.message,
        });
      }
      if (error.response.status === 400) {
        form.setError("password", {
          type: "manual",
          message: error.response?.data.message,
        });
      }

      if (error.response.status === 403) {
        form.setError("captcha", {
          type: "manual",
          message: error.response?.data.message
        })
        turnstile.reset();
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("w-[400px]", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login As Admin</CardTitle>
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

                <FormField
                  control={form.control}
                  name="captcha"
                  render={({ field }) => (
                    <FormItem>
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
    </div >
  )
}

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}