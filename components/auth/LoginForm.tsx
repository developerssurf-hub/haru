"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Lock, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

const loginSchema = z.object({
  identifier: z.string().min(3, "El usuario o email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("identifier", values.identifier);
      formData.append("password", values.password);

      const result = await loginAction(formData);

      if (result.success) {
        router.push("/campus");
      } else {
        setError(result.error || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-6xl font-serif font-bold text-primary-900 leading-tight">
          Sign IN
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm"
          >
            <AlertCircle className="size-4" />
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-serif text-black/80 ml-1">
              User name or email
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-900 transition-colors group-focus-within:text-primary">
                <User className="size-5" />
              </div>
              <input
                {...register("identifier")}
                type="text"
                placeholder="User"
                className="w-full bg-white/50 border border-primary-900 rounded-md py-3.5 pl-11 pr-4 text-primary-900 placeholder:text-primary-900/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-main transition-all font-serif"
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-red-500 ml-1">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-serif text-black/80 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-900 transition-colors group-focus-within:text-primary">
                <Lock className="size-5" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="*******"
                className="w-full bg-white/50 border border-primary-900 rounded-md py-3.5 pl-11 pr-4 text-primary-900 placeholder:text-primary-900/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-main transition-all font-serif"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden group py-4 rounded-xl bg-gradient-to-r from-[#8E004A] to-[#DE4B86] text-white font-serif text-lg font-bold transition-all hover:shadow-[0_10px_20px_rgba(222,75,134,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </div>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-main to-primary-700"
            initial={{ x: "100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4 }}
          />
        </button>
      </form>
    </motion.div>
  );
}
