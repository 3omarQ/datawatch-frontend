import { LoginLogo } from "@/components/auth/LoginLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center px-4 py-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[410px] space-y-7">
        <LoginLogo />
        {children}
      </div>
    </div>
  );
}
