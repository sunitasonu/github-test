import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { postData } from "@/utils/api"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginCorporate = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });



const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      const response = await postData("/login", {
        emailId: values.email,
        password: values.password,
      });

      if (response.success) {
        localStorage.setItem("accessToken", response.result.token);
   
        localStorage.setItem("user", JSON.stringify({
            id: response.result.id,
            name: response.result.name,
            email: response.result.email,
            phone: response.result.mobileNo,
            position: response.result.position,
            address: response.result.address,
        }));
        toast.success("Login successful!");

        setTimeout(() => {
        navigate("/dashboard");
        }, 1000); // wait 1 second before navigating
        
      } else {
        toast.error(response.result || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setIsLoading(false);
};


  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-primary-foreground p-12">
       
        <div className="max-w-md text-center space-y-6">
          <div className="bg-primary-foreground/20 rounded-2xl p-6 inline-block">
            <Building2 className="h-16 w-16 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold">SabajiMandi Enterprise</h1>
          <p className="text-lg text-primary-foreground/80">
            Secure, scalable business management platform trusted by
            organizations worldwide.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Shield className="h-4 w-4" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center space-x-2 mb-4 lg:hidden">
              <div className="bg-primary rounded-lg p-2">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SabajiMandi</span>
            </div>
            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your corporate credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corporate Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.name@company.com" {...field} />
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                 <Toaster  position="top-right" /> 
              </form>
            </Form>

            <Separator />

            <div className="space-y-3 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Forgot your password?
              </Link>
              <div className="text-xs text-muted-foreground">
                Need access? Contact your system administrator or{" "}
                <Link to="/support" className="text-primary hover:underline">
                  IT support
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginCorporate;
