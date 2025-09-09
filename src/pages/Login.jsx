/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const formSchema = z.object({
//   email: z.string().email("Enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values) => {
//     setIsLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log("Login attempt:", values);
//     setIsLoading(false);
//   };

//   return (
//     <div
//       className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
//       style={{ backgroundImage: 'url("/001.jpg")' }}
//     >
//       <div className="bg-white/90 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
//         {/* Left Info Panel */}
//         <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 flex-col justify-center items-center">
//           <img
//             src="/logo.png"
//             alt="Logo"
//             className="h-16 w-16 rounded-full mb-6"
//           />
//           <h2 className="text-3xl font-bold mb-2">Welcome</h2>
//           <p className="text-center text-sm leading-relaxed max-w-xs">
//             Empower your business with smarter tools. We help you grow and scale
//             with confidence.
//           </p>
//         </div>

//         {/* Right Login Panel */}
//         <div className="w-full md:w-1/2 p-8">
//           <Card className="border-0 shadow-none">
//             <CardHeader className="text-center">
//               <CardTitle className="text-2xl font-bold text-gray-800">
//                 Login
//               </CardTitle>
//               <CardDescription className="text-gray-500">
//                 Access your account securely
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <div>
//                   <label className="block mb-1 text-sm font-medium text-gray-700">
//                     Username
//                   </label>
//                   <Input
//                     placeholder="Type here your name"
//                     {...form.register("email")}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1 text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Type here your password"
//                       {...form.register("password")}
//                       className="w-full pr-10"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 text-gray-600"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Signing in..." : "Log In"}
//                 </Button>
//               </form>

//               <div className="mt-4 text-center text-sm text-gray-500">
//                 <Link
//                   to="/forgot-password"
//                   className="hover:underline text-blue-600"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login attempt:", values);
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden "
      >
        {/* Left Info Panel */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-10 flex-col justify-center items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16 w-16 rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold mb-2">Welcome</h2>
          <p className="text-center text-sm leading-relaxed max-w-xs">
            Empower your business with smarter tools. We help you grow and scale
            with confidence.
          </p>
        </div>

        {/* Right Login Panel */}
        <div
          className="w-full md:w-1/2 p-8 bg-gradient-to-br from-blue-100 to-blue-300 flex-col justify-center items-center"
          style={{ borderColor: "#ccc" }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Login
              </CardTitle>
              <CardDescription className="text-gray-500">
                Access your account securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Type here your name"
                      {...form.register("email")}
                      className="w-full pl-10"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Type here your password"
                      {...form.register("password")}
                      className="w-full pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Log In"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                <Link
                  to="/forgot-password"
                  className="hover:underline text-blue-600"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
