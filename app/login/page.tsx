import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[551px] shrink-0 bg-primary-100 px-8 py-12 flex flex-col justify-between items-center lg:items-start z-10">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 self-start">
          <div className="size-11 rounded-full premium-gradient flex items-center justify-center shadow-sm">
            <span className="text-white font-serif text-xl">春</span>
          </div>
          <span className="font-serif font-bold text-2xl text-primary-900">
            Haru yo Koi
          </span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto lg:mx-0 flex-1 flex flex-col justify-center">
          <LoginForm />
        </div>

        {/* Footer info */}
        <div className="self-start">
          <p className="font-serif text-sm text-black/60">
            2026 R Academia haru yo kopi
          </p>
        </div>
      </div>

      {/* Right Side: Visual Background */}
      <div className="hidden lg:block flex-1 relative bg-primary-900">
        <Image
          src="/images/login-bg.png"
          alt="Haru Yo Koi background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-primary-900/40" />
        
        {/* Decorative elements or text could go here */}
        <div className="absolute bottom-12 right-12 text-right text-white/80 max-w-xs">
          <p className="font-serif text-lg italic">
            "Aprende japonés y sumérgete en la cultura nipona."
          </p>
        </div>
      </div>
    </div>
  );
}
